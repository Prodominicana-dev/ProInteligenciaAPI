import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ChatbotService {
  constructor(
    @Inject('DataSource_analytica') private Analytica: DataSource,
    @Inject('DataSource_ceird') private Ceird: DataSource,
  ) {}

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
    SELECT * FROM dbo.ChatBot
    WHERE Total_Valor_FOB IS NOT NULL
  `);

    // Mapa para agrupar por año y país
    const grouped = new Map<number, Map<string, number>>();

    for (const item of rawData) {
      const year = Number(item['Año']);
      const country = item['Pais'];
      const value = Number(item['Total_Valor_FOB']) || 0;

      if (!grouped.has(year)) grouped.set(year, new Map());
      grouped
        .get(year)
        .set(country, (grouped.get(year).get(country) || 0) + value);
    }

    // Construcción de HTML
    const summaries: string[] = [];
    for (const [year, countriesMap] of Array.from(grouped.entries()).sort(
      ([a], [b]) => a - b,
    )) {
      for (const [country, total] of Array.from(
        countriesMap.entries(),
      ).sort()) {
        summaries.push(
          `<p>Las exportaciones hacia ${country} en el año ${year} fueron de ${total.toFixed(2)} dólares estadounidenses FOB.</p>`,
        );
      }
    }

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

  async getExportsByProduct(): Promise<string> {
    const rawData = await this.Ceird.query(`
    SELECT * FROM dbo.ChatBot
    WHERE Total_Valor_FOB IS NOT NULL
  `);

    // Mapa para agrupar por año y producto
    const grouped = new Map<number, Map<string, number>>();

    for (const item of rawData) {
      const year = Number(item['Año']);
      const product = item['Sub-partida'];
      const value = Number(item['Total_Valor_FOB']) || 0;

      if (!grouped.has(year)) grouped.set(year, new Map());
      grouped
        .get(year)
        .set(product, (grouped.get(year).get(product) || 0) + value);
    }

    // Construcción de HTML
    const summaries: string[] = [];
    for (const [year, productsMap] of Array.from(grouped.entries()).sort(
      ([a], [b]) => a - b,
    )) {
      for (const [product, total] of Array.from(productsMap.entries()).sort()) {
        summaries.push(
          `<p>Las exportaciones del producto "${product}" en el año ${year} fueron de ${total.toFixed(2)} dólares estadounidenses FOB.</p>`,
        );
      }
    }

    return `
  <html>
    <head><title>Exportaciones por Producto</title></head>
    <body>
      <h1>Resumen de Exportaciones por Producto y Año</h1>
      ${summaries.join('\n')}
    </body>
  </html>
  `;
  }
}
