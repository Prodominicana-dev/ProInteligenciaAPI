import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ChatbotService {
  constructor(private dataSource: DataSource) {}

  async getViewData(): Promise<any[]> {
    const query = 'SELECT * FROM vw_SEBCRDIEDPorPaisT';
    return await this.dataSource.query(query);
  }
}
