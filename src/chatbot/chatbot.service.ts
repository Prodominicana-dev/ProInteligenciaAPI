import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ChatbotService {
  constructor(
    @Inject('DataSource_analytica') private Analytica: DataSource,
    @Inject('DataSource_ceird') private Ceird: DataSource,
  ) {}

  async getLastUpdateDate(): Promise<Date | null> {
    const result = await this.Analytica.query(`
        SELECT MAX([Fecha]) as lastUpdate FROM vw_SEBCRDIEDPorPaisT
        WHERE [US$ Millones] IS NOT NULL
      `);
    return result[0]?.lastUpdate ? new Date(result[0].lastUpdate) : null;
  }
  // endpoint para que el chatbot obtenga la última fecha de actualización de los datos

  async getIEDByCountry(): Promise<string> {
    const rawData = await this.Analytica.query(`
    SELECT * FROM vw_SEBCRDIEDPorPaisT
    WHERE [US$ Millones] IS NOT NULL
  `);

    const grouped = new Map<
      string,
      { amount: number; country: string; year: number }
    >();

    for (const item of rawData) {
      const date = new Date(item['Fecha']);
      const year = date.getFullYear();
      const country = item['País'];
      const amount = Number(item['US$ Millones']);

      const key = `${country}-${year}`;
      if (grouped.has(key)) {
        grouped.get(key)!.amount += amount;
      } else {
        grouped.set(key, { country, year, amount });
      }
    }

    const summaries = Array.from(grouped.values())
      .sort((a, b) => a.year - b.year || a.country.localeCompare(b.country))
      .map(
        ({ country, year, amount }) =>
          `<p>La inversión extranjera directa desde ${country} en el año ${year} fue de ${amount.toFixed(2)} millones de dólares estadounidenses.</p>`,
      )
      .join('\n');

    return `
    <html>
      <head><title>IED por País</title></head>
      <body>
        <h1>Inversión Extranjera Directa por País</h1>
        ${summaries}
      </body>
    </html>
  `;
  }

  async getIEDBySector(): Promise<string> {
    const rawData = await this.Analytica.query(`
    SELECT * FROM vw_SEBCRDIEDPorSectorQ
    WHERE [US$ Millones] IS NOT NULL
  `);

    const grouped = new Map<
      string,
      { amount: number; sector: string; year: number }
    >();

    for (const item of rawData) {
      const date = new Date(item['Fecha']);
      const year = date.getFullYear();
      const sector = item['Sector'];
      const amount = Number(item['US$ Millones']);

      const key = `${sector}-${year}`;
      if (grouped.has(key)) {
        grouped.get(key)!.amount += amount;
      } else {
        grouped.set(key, { sector, year, amount });
      }
    }

    const summaries = Array.from(grouped.values())
      .sort((a, b) => a.year - b.year || a.sector.localeCompare(b.sector))
      .map(
        ({ sector, year, amount }) =>
          `<p>La inversión extranjera directa en el sector ${sector} en el año ${year} fue de ${amount.toFixed(2)} millones de dólares estadounidenses.</p>`,
      )
      .join('\n');

    return `
    <html>
      <head><title>IED por Sector</title></head>
      <body>
        <h1>Inversión Extranjera Directa por Sector</h1>
        ${summaries}
      </body>
    </html>
  `;
  }

  async getIEDSummaryByYear(): Promise<string> {
    const rawData = await this.Analytica.query(`
    SELECT * FROM vw_SEBCRDIEDPorPaisT
    WHERE [US$ Millones] IS NOT NULL
  `);

    const grouped = new Map<number, number>();

    for (const item of rawData) {
      const date = new Date(item['Fecha']);
      const year = date.getFullYear();
      const amount = Number(item['US$ Millones']);

      grouped.set(year, (grouped.get(year) || 0) + amount);
    }

    const summaries = Array.from(grouped.entries())
      .sort(([a], [b]) => a - b)
      .map(
        ([year, amount]) =>
          `<p>La inversión extranjera directa total en el año ${year} fue de ${amount.toFixed(2)} millones de dólares estadounidenses.</p>`,
      )
      .join('\n');

    return `
    <html>
      <head><title>Resumen IED por Año</title></head>
      <body>
        <h1>Resumen de Inversión Extranjera Directa por Año</h1>
        ${summaries}
      </body>
    </html>
  `;
  }

  async getExportsByCountry(): Promise<string> {
    const rawData = await this.Ceird.query(`
    SELECT Año, Pais, SUM(Total_Valor_FOB) AS Total
    FROM dbo.ChatBot
    WHERE Total_Valor_FOB IS NOT NULL
    GROUP BY Año, Pais
    ORDER BY Año, Pais
  `);

    const summaries: string[] = rawData.map(
      (item) =>
        `<p>Las exportaciones hacia ${item.Pais} en el año ${item.Año} fueron de ${Number(item.Total).toFixed(2)} dólares estadounidenses FOB.</p>`,
    );

    return `
    <html>
      <head><title>Exportaciones por País</title></head>
      <body>
        <h1>Resumen de Exportaciones por País y Año</h1>
        ${summaries.join('\n')}
      </body>
    </html>
  `;
  }

  async getExportsByProduct(
    startYear: number,
    endYear: number,
  ): Promise<string> {
    const rawData = await this.Ceird.query(`
  SELECT Año, [Sub-partida] AS product, SUM(Total_Valor_FOB) AS total
  FROM dbo.ChatBot
  WHERE Total_Valor_FOB IS NOT NULL
    AND Total_Valor_FOB > 0
    AND [Sub-partida] NOT LIKE '%N/D%'
    AND Año BETWEEN ${startYear} AND ${endYear}
  GROUP BY Año, [Sub-partida]
  ORDER BY Año, [Sub-partida]
`);

    const summaries = rawData.map(
      (item) =>
        `<p>Las exportaciones del producto "${item.product}" en el año ${item.Año} fueron de ${formatUSD(item.total)} USD.</p>`,
    );
    const yearTitle =
      startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;

    return `
    <html>
  <head><title>Exportaciones por Producto</title></head>
  <body>
    <h1>Resumen de Exportaciones por Producto (${yearTitle})</h1>
    ${summaries.join('\n')}
  </body>
</html>
  `;
  }
}

function formatUSD(value: number): string {
  if (value >= 1_000_000_000)
    return (value / 1_000_000_000).toFixed(2) + ' Billones';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + ' Millones';
  if (value >= 1_000) return (value / 1_000).toFixed(2) + ' Mil';
  return value.toFixed(2);
}
