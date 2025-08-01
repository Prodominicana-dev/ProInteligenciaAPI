import { Controller, Get, Res } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { Response } from 'express';

@Controller('apiv2/chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('ied-by-country')
  async getIEDByCountry(@Res() res: Response) {
    try {
      const html = await this.chatbotService.getIEDByCountry();
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send('<p>Error al obtener datos de IED por país</p>');
    }
  }

  @Get('ied-by-sector')
  async getIEDBySector(@Res() res: Response) {
    try {
      const html = await this.chatbotService.getIEDBySector();
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send('<p>Error al obtener datos de IED por sector</p>');
    }
  }

  @Get('ied-summary-by-year')
  async getIEDSummaryByYear(@Res() res: Response) {
    try {
      const html = await this.chatbotService.getIEDSummaryByYear();
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send('<p>Error al obtener resumen de IED por año</p>');
    }
  }

  @Get('export-data')
  async getExportData(@Res() res: Response) {
    try {
      const html = await this.chatbotService.getExportData();
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send('<p>Error al obtener datos de exportación</p>');
    }
  }
}
