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
    @Res() res: Response,
    @Query('product') product: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('country') country?: string,
    @Query('year') year?: number,
  ) {
    try {
      if (!product) {
        return res
          .status(400)
          .json({ error: 'Debe enviar el parámetro product' });
      }
      const pageNum = page && page > 0 ? page : undefined;
      const pageSizeNum = pageSize && pageSize > 0 ? pageSize : undefined;
      const data = await this.chatbotService.getExportsByProductCountry(
        product,
        pageNum,
        pageSizeNum,
        country,
        year,
      );
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-EXPORTS-BY-PRODUCT-COUNTRY:', error);
      return res
        .status(500)
        .json({
          message: 'Error al obtener exportaciones por producto y país',
        });
    }
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
    try {
      if (!producto || !fechaInicio || !fechaFin) {
        return res
          .status(400)
          .json({ error: 'Debe enviar producto, fechaInicio y fechaFin' });
      }
      const data = await this.chatbotService.getIEDByCountryFiltered(
        producto,
        fechaInicio,
        fechaFin,
      );
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-IED-BY-COUNTRY-FILTERED:', error);
      return res
        .status(500)
        .json({ message: 'Error al obtener IED por país filtrada' });
    }
  }
  constructor(private readonly chatbotService: ChatbotService) { }

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
          .json({ message: 'No se encontró fecha de actualización' });
      }
      return res.status(200).json({ lastUpdate: lastUpdate.toLocaleString() });
    } catch (error) {
      console.log('ERROR-LAST-UPDATE-DATE:', error);
      return res
        .status(500)
        .json({ message: 'Error al obtener la fecha de actualización' });
    }
  }
  // endpoint para obtener la última fecha de actualización de los datos

  /**
   * Endpoint para obtener la IED agrupada por país y año.
   * @returns HTML con el resumen de IED por país y año.
   */
  @Get('ied-by-country')
  async getIEDByCountry(
    @Res() res: Response,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    try {
      const pageNum = page && page > 0 ? page : undefined;
      const pageSizeNum = pageSize && pageSize > 0 ? pageSize : undefined;
      const data = await this.chatbotService.getIEDByCountry(
        pageNum,
        pageSizeNum,
      );
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-IED-BY-COUNTRY:', error);
      return res.status(500).json({ message: 'Error al obtener IED por país' });
    }
  }

  /**
   * Endpoint para obtener la IED agrupada por sector y año.
   * @returns HTML con el resumen de IED por sector y año.
   */
  @Get('ied-by-sector')
  async getIEDBySector(@Res() res: Response) {
    try {
      const data = await this.chatbotService.getIEDBySector();
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-IED-BY-SECTOR:', error);
      return res
        .status(500)
        .json({ message: 'Error al obtener IED por sector' });
    }
  }

  /**
   * Endpoint para obtener el resumen total de IED por año.
   * @returns HTML con el resumen de IED total por año.
   */
  @Get('ied-summary-by-year')
  async getIEDSummaryByYear(@Res() res: Response) {
    try {
      const data = await this.chatbotService.getIEDSummaryByYear();
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-IED-SUMMARY-BY-YEAR:', error);
      return res
        .status(500)
        .json({ message: 'Error al obtener resumen de IED por año' });
    }
  }

  /**
   * Endpoint para obtener el resumen de exportaciones por producto y año, en un rango de años.
   * @param startYear Año inicial del rango.
   * @param endYear Año final del rango.
   * @returns HTML con el resumen de exportaciones por producto y año.
   */
  @Get('exports-by-product/:startDate/:endDate')
  async getExportsByProduct(
    @Res() res: Response,
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
  ) {
    try {
      const data = await this.chatbotService.getExportsByProduct(
        startDate,
        endDate,
      );
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-EXPORTS-BY-PRODUCT:', error);
      console.log('ERROR-DETAIL:', error?.message || error);
      return res
        .status(500)
        .json({
          message: 'Error al obtener exportaciones por producto y fecha',
          error: error?.message || error
        });
    }
  }

  /**
   * Endpoint para obtener el resumen de exportaciones por país y año.
   * @returns HTML con el resumen de exportaciones por país y año.
   */
  @Get('exports-by-country')
  async getExportsByCountry(
    @Res() res: Response,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('year') year?: number,
    @Query('country') country?: string,
  ) {
    try {
      const pageNum = page && page > 0 ? page : undefined;
      const pageSizeNum = pageSize && pageSize > 0 ? pageSize : undefined;
      const data = await this.chatbotService.getExportsByCountry(
        pageNum,
        pageSizeNum,
        year,
        country,
      );
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-EXPORTS-BY-COUNTRY:', error);
      return res
        .status(500)
        .json({ message: 'Error al obtener exportaciones por país y año' });
    }
  }

  /**
   * Endpoint para obtener la lista de productos disponibles.
   * @returns Array de objetos con código y descripción del producto.
   */
  @Get('products')
  async getProducts(@Res() res: Response) {
    try {
      const data = await this.chatbotService.getProducts();
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-PRODUCTS:', error);
      return res
        .status(500)
        .json({ message: 'Error al obtener la lista de productos' });
    }
  }

  /**
   * Endpoint para exportaciones en 2020.
   */
  @Get('exports-2020')
  async getExports2020(@Res() res: Response, @Query('page') page?: number, @Query('pageSize') pageSize?: number, @Query('country') country?: string) {
    try {
      const data = await this.chatbotService.getExportsByCountry(page, pageSize, 2020, country);
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-EXPORTS-2020:', error);
      return res.status(500).json({ message: 'Error al obtener exportaciones de 2020' });
    }
  }

  /**
   * Endpoint para exportaciones en 2021.
   */
  @Get('exports-2021')
  async getExports2021(@Res() res: Response, @Query('page') page?: number, @Query('pageSize') pageSize?: number, @Query('country') country?: string) {
    try {
      const data = await this.chatbotService.getExportsByCountry(page, pageSize, 2021, country);
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-EXPORTS-2021:', error);
      return res.status(500).json({ message: 'Error al obtener exportaciones de 2021' });
    }
  }

  /**
   * Endpoint para exportaciones en 2022.
   */
  @Get('exports-2022')
  async getExports2022(@Res() res: Response, @Query('page') page?: number, @Query('pageSize') pageSize?: number, @Query('country') country?: string) {
    try {
      const data = await this.chatbotService.getExportsByCountry(page, pageSize, 2022, country);
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-EXPORTS-2022:', error);
      return res.status(500).json({ message: 'Error al obtener exportaciones de 2022' });
    }
  }

  /**
   * Endpoint para exportaciones en 2023.
   */
  @Get('exports-2023')
  async getExports2023(@Res() res: Response, @Query('page') page?: number, @Query('pageSize') pageSize?: number, @Query('country') country?: string) {
    try {
      const data = await this.chatbotService.getExportsByCountry(page, pageSize, 2023, country);
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-EXPORTS-2023:', error);
      return res.status(500).json({ message: 'Error al obtener exportaciones de 2023' });
    }
  }

  /**
   * Endpoint para exportaciones en 2024.
   */
  @Get('exports-2024')
  async getExports2024(@Res() res: Response, @Query('page') page?: number, @Query('pageSize') pageSize?: number, @Query('country') country?: string) {
    try {
      const data = await this.chatbotService.getExportsByCountry(page, pageSize, 2024, country);
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-EXPORTS-2024:', error);
      return res.status(500).json({ message: 'Error al obtener exportaciones de 2024' });
    }
  }

  /**
   * Endpoint para exportaciones en 2025.
   */
  @Get('exports-2025')
  async getExports2025(@Res() res: Response, @Query('page') page?: number, @Query('pageSize') pageSize?: number, @Query('country') country?: string) {
    try {
      const data = await this.chatbotService.getExportsByCountry(page, pageSize, 2025, country);
      return res.status(200).json(data);
    } catch (error) {
      console.log('ERROR-EXPORTS-2025:', error);
      return res.status(500).json({ message: 'Error al obtener exportaciones de 2025' });
    }
  }
}
