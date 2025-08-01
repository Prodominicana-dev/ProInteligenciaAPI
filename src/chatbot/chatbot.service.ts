import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ChatbotService {
  constructor(
    @Inject('DataSource_analytica') private Analytica: DataSource,
    @Inject('DataSource_ceird') private Ceird: DataSource,
  ) {}

  async getIEDByCountry(): Promise<any[]> {
    const query = 'SELECT * FROM vw_SEBCRDIEDPorPaisT';
    return await this.Analytica.query(query);
  }

  async getIEDBySector(): Promise<any[]> {
    const query = 'SELECT * FROM vw_SEBCRDIEDPorSectorQ';
    return await this.Analytica.query(query);
  }

  async getExportData(): Promise<any[]> {
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
    return await this.Ceird.query(query);
  }
}
