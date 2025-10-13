import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';

@Module({
  providers: [
    {
      provide: 'DataSource_analytica',
      useFactory: async () => {
        const dataSource = new DataSource({
          type: 'mssql',
          url: process.env.DATAMARKET_ANALYTICA_DATABASE_URL,
          entities: [],
          synchronize: false,
          options: {
            encrypt: false,
            trustServerCertificate: true,
          },
        });
        return dataSource.initialize();
      },
    },
    {
      provide: 'DataSource_ceird',
      useFactory: async () => {
        const dataSource = new DataSource({
          type: 'mssql',
          url: process.env.DATAMARKET_CEIRD_DATABASE_URL,
          entities: [],
          synchronize: false,
          requestTimeout: 300000, // 5 minutos
          options: {
            encrypt: false,
            trustServerCertificate: true,
          },
        });
        return dataSource.initialize();
      },
    },
    ChatbotService,
  ],
  controllers: [ChatbotController],
  exports: [ChatbotService],
})
export class ChatbotModule { }