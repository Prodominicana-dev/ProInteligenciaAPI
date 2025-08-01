import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ChatbotService {
  constructor(
    @Inject('DataSource_analytica') private Analytica: DataSource,
    @Inject('DataSource_ceird') private Ceird: DataSource,
  ) {}

  async getIEDByCountry(): Promise<
    {
      country: string;
      year: number;
      amount: number;
      title: string;
      description: string;
    }[]
  > {
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

    return Array.from(grouped.values()).map(({ country, year, amount }) => ({
      country,
      year,
      amount: +amount.toFixed(2),
      title: `Inversión Extranjera Directa en ${country} - ${year}`,
      description: `Resumen actualizado de la inversión extranjera directa recibida por ${country} en el año ${year}, expresada en millones de dólares estadounidenses.`,
    }));
  }

  async getIEDBySector(): Promise<
    {
      sector: string;
      year: number;
      amount: number;
      title: string;
      description: string;
    }[]
  > {
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
      const sector = item['Sector']?.trim();
      const amount = Number(item['US$ Millones']);

      if (!sector) continue; // Evita registros vacíos

      const key = `${sector}-${year}`;

      if (grouped.has(key)) {
        grouped.get(key)!.amount += amount;
      } else {
        grouped.set(key, { sector, year, amount });
      }
    }

    return Array.from(grouped.values()).map(({ sector, year, amount }) => ({
      sector,
      year,
      amount: +amount.toFixed(2),
      title: `IED en el sector ${sector} - ${year}`,
      description: `Inversión extranjera directa registrada en el sector ${sector} durante el año ${year}, expresada en millones de dólares estadounidenses.`,
    }));
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
