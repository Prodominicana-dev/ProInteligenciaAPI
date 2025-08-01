import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ChatbotService {
  constructor(
    @Inject('DataSource_analytica') private Analytica: DataSource,
    @Inject('DataSource_ceird') private Ceird: DataSource,
  ) {}

  async getIEDByCountry(): Promise<any> {
    const data = await this.Analytica.query(
      'SELECT * FROM vw_SEBCRDIEDPorPaisT',
    );

    return {
      title: 'Inversión Extranjera Directa por país de origen',
      description:
        'Estos datos muestran la Inversión Extranjera Directa (IED) recibida por la República Dominicana, desglosada por país de origen. Reflejan los montos más actualizados disponibles, proporcionando una visión clara de qué naciones están invirtiendo en el país.',
      data,
    };
  }

  async getIEDBySector(): Promise<any> {
    const data = await this.Analytica.query(
      'SELECT * FROM vw_SEBCRDIEDPorSectorQ',
    );

    return {
      title: 'Inversión Extranjera Directa por sector económico',
      description:
        'Estos datos muestran la Inversión Extranjera Directa (IED) en la República Dominicana, desglosada por sectores económicos. Permiten identificar los sectores que están recibiendo mayor interés y capital extranjero en el país, con cifras actualizadas.',
      data,
    };
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
