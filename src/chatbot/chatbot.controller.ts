import { Controller, Get, Res } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { Response } from 'express';

@Controller('apiv2/chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('ied-by-country')
  async getIEDByCountry(@Res() res: Response) {
    try {
      const data = await this.chatbotService.getIEDByCountry();
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error al obtener datos de IED por país' });
    }
  }

  @Get('ied-by-sector')
  async getIEDBySector(@Res() res: Response) {
    try {
      const data = await this.chatbotService.getIEDBySector();
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error al obtener datos de IED por sector' });
    }
  }

  @Get('ied-summary-by-year')
  async getIEDSummaryByYear(@Res() res: Response) {
    try {
      const data = await this.chatbotService.getIEDSummaryByYear();
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error al obtener resumen de IED por año' });
    }
  }

  @Get('export-data')
  async getExportData(@Res() res: Response) {
    try {
      const data = await this.chatbotService.getExportData();
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error al obtener datos de exportación' });
    }
  }
}
