import { Controller, Get, Param, Query, Res, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { Response } from 'express';

@Controller('apiv2/chatbot')
export class ChatbotController {
  /**
   * Endpoint para obtener exportaciones de un producto específico agrupadas por país y año.
   * @query product Nombre o código del producto.
   * @returns Array de objetos con país, año, monto, fecha y producto.
   */
  @Get('exports-by-product-country')
  async getExportsByProductCountry(
    @Res() res: Response,
    @Query('product') product: string,
    @Query('country') country?: string,
    @Query('year') year?: string,
  ) {
    console.log('Petición recibida: /apiv2/chatbot/exports-by-product-country', { product, country, year });
    if (!product) {
      return res.status(400).send('<p>Debe enviar el parámetro product</p>');
    }
    const yearNum = year ? Number(year) : undefined;
    const html = await this.chatbotService.getExportsByProductCountry(product, country, yearNum);
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }
  /**
   * Endpoint para obtener la IED por país filtrada por producto y rango de fechas.
   * @query producto Nombre del producto a filtrar.
   * @query fechaInicio Fecha de inicio (YYYY-MM-DD).
   * @query fechaFin Fecha de fin (YYYY-MM-DD).
   * @returns HTML con el resumen de IED por país y año.
   */
  @Get('ied-by-country-filtered')
  async getIEDByCountryFiltered(
    @Res() res: Response,
    @Query('producto') producto: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    console.log('Petición recibida: /apiv2/chatbot/ied-by-country-filtered', { producto, fechaInicio, fechaFin });
    if (!producto || !fechaInicio || !fechaFin) {
      return res.status(400).send('<p>Debe enviar producto, fechaInicio y fechaFin</p>');
    }
    const html = await this.chatbotService.getIEDByCountryFiltered(producto, fechaInicio, fechaFin);
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
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
      return res.status(500).send('<p>Error al obtener datos de IED por país</p>');
    }
  }

  /**
   * Endpoint para obtener la IED agrupada por sector y año.
   * @returns HTML con el resumen de IED por sector y año.
   */
  @Get('ied-by-sector')
  async getIEDBySector() {
    return await this.chatbotService.getIEDBySector();
  }

  /**
   * Endpoint para obtener el resumen total de IED por año.
   * @returns HTML con el resumen de IED total por año.
   */
  @Get('ied-summary-by-year')
  async getIEDSummaryByYear() : Promise<string> {
    return await this.chatbotService.getIEDSummaryByYear();
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
  ) {
    if (!startYear || !endYear) {
      return { error: 'Debe enviar startYear y endYear' };
    }
    return await this.chatbotService.getExportsByProduct(startYear, endYear);
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
      return res.status(500).send('<p>Error al obtener datos de exportación</p>');
    }
  }

  /**
   * Endpoint para consultar datos de un archivo Excel en SharePoint.
   * @body fileUrl URL del archivo Excel en SharePoint.
   * @body filter Filtro opcional para la consulta.
   * @returns HTML con los datos consultados.
   */
  @Post('sharepoint-excel')
  async getSharepointExcelData(
    @Res() res: Response,
    @Body('fileUrl') fileUrl: string,
    @Body('filter') filter?: string,
  ) {
    if (!fileUrl) {
      return res.status(400).send('<p>Debe enviar el parámetro fileUrl</p>');
    }
    try {
      const html = await this.chatbotService.getSharepointExcelData(fileUrl, filter);
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (error) {
      console.error(error);
      return res.status(500).send('<p>Error al consultar datos de SharePoint Excel</p>');
    }
  }

  /**
   * Endpoint para consultar datos de un archivo Excel en SharePoint (GET).
   * @query fileUrl URL del archivo Excel en SharePoint.
   * @query filter Filtro opcional para la consulta.
   * @returns HTML con los datos consultados.
   */
  @Get('sharepoint-excel')
  async getSharepointExcelDataGet(
    @Res() res: Response,
    @Query('fileUrl') fileUrl: string,
    @Query('filter') filter?: string,
  ) {
    if (!fileUrl) {
      return res.status(400).send('<p>Debe enviar el parámetro fileUrl</p>');
    }
    try {
      const html = await this.chatbotService.getSharepointExcelData(fileUrl, filter);
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (error) {
      console.error(error);
      return res.status(500).send('<p>Error al consultar datos de SharePoint Excel</p>');
    }
  }
}
