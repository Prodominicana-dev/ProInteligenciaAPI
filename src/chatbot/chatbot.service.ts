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
          `La inversión extranjera directa desde ${country} en el año ${year} fue de ${amount.toFixed(2)} millones de dólares estadounidenses.`,
      );

    return summaries.join('\n');
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
          `La inversión extranjera directa en el sector ${sector} en el año ${year} fue de ${amount.toFixed(2)} millones de dólares estadounidenses.`,
      );

    return summaries.join('\n');
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
          `La inversión extranjera directa total en el año ${year} fue de ${amount.toFixed(2)} millones de dólares estadounidenses.`,
      );

    return summaries.join('\n');
  }

  async getExportData(): Promise<any> {
    const query = `
      SELECT *
      FROM vw_DGANeto
      WHERE [Régimen Arancelario] IN (
        '1', '10', '11', '2', '7',
        'Admisión Temporal',
        'Consumo de reexportación',
        'Depósito de reexportación',
        'nacional',
        'Zonas Francas'
      )
    `;

    const data = await this.Ceird.query(query);

    return {
      title: 'Exportaciones nacionales por régimen arancelario',
      description:
        'Estos datos muestran el volumen y valor de las exportaciones realizadas desde la República Dominicana, segmentadas por régimen arancelario. Esta información representa las estadísticas más actualizadas sobre el comportamiento exportador del país.',
      data,
    };
  }
}
