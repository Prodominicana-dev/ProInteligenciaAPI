import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { Response } from 'express';

@Controller('apiv2/chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('last-update-date')
  async getLastUpdateDate(@Res() res: Response) {
    try {
      const lastUpdate = await this.chatbotService.getLastUpdateDate();
      if (!lastUpdate) {
        return res
          .status(404)
          .send('<p>No se encontró fecha de actualización</p>');
      }
      return res
        .status(200)
        .send(
          `<p>La última actualización de la data fue: ${lastUpdate.toLocaleString()}</p>`,
        );
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send('<p>Error al obtener la fecha de actualización</p>');
    }
  }
  // endpoint para obtener la última fecha de actualización de los datos

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

  @Get('exports-by-product/:startYear/:endYear')
  async getExportsByProduct(
    @Param('startYear') startYear: number,
    @Param('endYear') endYear: number,
    @Res() res: Response,
  ) {
    try {
      if (!startYear || !endYear) {
        return res.status(400).send('<p>Debe enviar startYear y endYear</p>');
      }

      const html = await this.chatbotService.getExportsByProduct(
        startYear,
        endYear,
      );
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send('<p>Error al obtener datos de exportación</p>');
    }
  }

  @Get('exports-by-country')
  async getExportsByCountry(@Res() res: Response) {
    try {
      const html = await this.chatbotService.getExportsByCountry();
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
