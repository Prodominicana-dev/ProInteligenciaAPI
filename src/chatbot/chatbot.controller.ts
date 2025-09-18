import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { Response } from 'express';

@Controller('apiv2/chatbot')
export class ChatbotController {
  /**
   * Endpoint para obtener la IED por país filtrada por producto y rango de fechas.
   * @query producto Nombre del producto a filtrar.
   * @query fechaInicio Fecha de inicio (YYYY-MM-DD).
   * @query fechaFin Fecha de fin (YYYY-MM-DD).
   * @returns HTML con el resumen de IED por país y año.
   */
  @Get('ied-by-country-filtered')
  async getIEDByCountryFiltered(
    @Query('producto') producto: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Res() res: Response,
  ) {
    try {
      if (!producto || !fechaInicio || !fechaFin) {
        return res.status(400).send('<p>Debe enviar producto, fechaInicio y fechaFin</p>');
      }
      const html = await this.chatbotService.getIEDByCountryFiltered(producto, fechaInicio, fechaFin);
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (error) {
      console.error(error);
      return res.status(500).send('<p>Error al obtener datos filtrados</p>');
    }
  }
  constructor(private readonly chatbotService: ChatbotService) {}

  /**
   * Endpoint para obtener la última fecha de actualización de los datos de IED.
   * @returns Fecha de la última actualización en formato HTML.
   */
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

  /**
   * Endpoint para obtener la IED agrupada por país y año.
   * @returns HTML con el resumen de IED por país y año.
   */
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

  /**
   * Endpoint para obtener la IED agrupada por sector y año.
   * @returns HTML con el resumen de IED por sector y año.
   */
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

  /**
   * Endpoint para obtener el resumen total de IED por año.
   * @returns HTML con el resumen de IED total por año.
   */
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

  /**
   * Endpoint para obtener el resumen de exportaciones por producto y año, en un rango de años.
   * @param startYear Año inicial del rango.
   * @param endYear Año final del rango.
   * @returns HTML con el resumen de exportaciones por producto y año.
   */
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

  /**
   * Endpoint para obtener el resumen de exportaciones por país y año.
   * @returns HTML con el resumen de exportaciones por país y año.
   */
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
