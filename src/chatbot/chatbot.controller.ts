import { Controller, Get, Param, Query, Res } from '@nestjs/common';
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
    @Query('product') product: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('country') country?: string,
    @Query('year') year?: number
  ) {
    if (!product) {
      return { error: 'Debe enviar el parámetro product' };
    }
    // Validación básica de paginación
    const pageNum = page && page > 0 ? page : undefined;
    const pageSizeNum = pageSize && pageSize > 0 ? pageSize : undefined;
    return await this.chatbotService.getExportsByProductCountry(product, pageNum, pageSizeNum, country, year);
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
    @Query('producto') producto: string,
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    if (!producto || !fechaInicio || !fechaFin) {
      return { error: 'Debe enviar producto, fechaInicio y fechaFin' };
    }
    return await this.chatbotService.getIEDByCountryFiltered(producto, fechaInicio, fechaFin);
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
  async getIEDByCountry(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number
  ) {
    const pageNum = page && page > 0 ? page : undefined;
    const pageSizeNum = pageSize && pageSize > 0 ? pageSize : undefined;
    return await this.chatbotService.getIEDByCountry(pageNum, pageSizeNum);
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
  async getIEDSummaryByYear() {
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
  async getExportsByCountry(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number
  ) {
    const pageNum = page && page > 0 ? page : undefined;
    const pageSizeNum = pageSize && pageSize > 0 ? pageSize : undefined;
    return await this.chatbotService.getExportsByCountry(pageNum, pageSizeNum);
  }
}
