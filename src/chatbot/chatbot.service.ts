import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ChatbotService {
  /**
   * Obtiene exportaciones de un producto específico agrupadas por país y año.
   * @param product Nombre o código del producto.
   * @returns Array de objetos con país, año, monto, fecha y producto.
   */
  /**
   * Obtiene exportaciones de un producto específico agrupadas por país y año, con paginación y filtros opcionales.
   * @param product Nombre o código del producto.
   * @param page Página solicitada (opcional).
   * @param pageSize Cantidad de resultados por página (opcional).
   * @param country País destino (opcional).
   * @param year Año de exportación (opcional).
   * @returns Array de objetos con país, año, monto, fecha y producto.
   */
  async getExportsByProductCountry(
    product: string,
    page?: number,
    pageSize?: number,
    country?: string,
    year?: number
  ): Promise<{ data: Array<{ country: string; year: number; total: number; date: string; product: string }>, total: number }> {
    let query = `SELECT p.nombre AS Pais, d.fecha_declaracion AS Año, prod.descripcion AS product, SUM(d.valor_exportacion_fob) AS total
      FROM dbo.Declaraciones_New d
      JOIN dbo.Paises_New p ON d.pais_id = p.id
      JOIN dbo.Productos_New prod ON d.producto_id = prod.id
      WHERE d.valor_exportacion_fob IS NOT NULL
        AND d.valor_exportacion_fob > 0
        AND d.fecha_declaracion >= 2020
        AND prod.codigo_a6 = @0`;
    const params: any[] = [product];
    let paramIndex = 1;
    if (country) {
      query += ` AND p.nombre = @${paramIndex}`;
      params.push(country);
      paramIndex++;
    }
    if (year) {
      query += ` AND d.fecha_declaracion = @${paramIndex}`;
      params.push(year);
      paramIndex++;
    }
    query += ` GROUP BY p.nombre, d.fecha_declaracion, prod.descripcion ORDER BY d.fecha_declaracion, p.nombre`;

    const rawData = await this.Ceird.query(query, params);
    const total = rawData.length;
    let data = rawData.map((item: any) => ({
      country: item.Pais,
      year: item.Año,
      total: Number(item.total),
      date: null,
      product: item.product
    }));
    // paginación
    if (page && pageSize) {
      const start = (page - 1) * pageSize;
      data = data.slice(start, start + pageSize);
    }
    return { data, total };
  }
  /**
   * Obtiene la inversión extranjera directa (IED) por país filtrada por producto y rango de fechas.
   * @param producto Nombre del producto a filtrar.
   * @param fechaInicio Fecha de inicio (formato YYYY-MM-DD).
   * @param fechaFin Fecha de fin (formato YYYY-MM-DD).
   * @returns HTML con el resumen de IED por país y año.
   */
  async getIEDByCountryFiltered(producto: string, fechaInicio: string, fechaFin: string): Promise<Array<{ country: string; year: number; amount: number; date: string }>> {
    const rawData = await this.Analytica.query(`
      SELECT * FROM vw_SEBCRDIEDPorPaisT
      WHERE [US$ Millones] IS NOT NULL
        AND [Producto] = '${producto}'
        AND [Fecha] >= '${fechaInicio}'
        AND [Fecha] <= '${fechaFin}'
      ORDER BY [Fecha] DESC
    `);

    const grouped = new Map<string, { amount: number; country: string; year: number; date: string }>();

    for (const item of rawData) {
      const dateObj = new Date(item['Fecha']);
      const year = dateObj.getFullYear();
      const country = item['País'];
      const amount = Number(item['US$ Millones']);
      const date = dateObj.toISOString().split('T')[0];

      const key = `${country}-${year}`;
      if (grouped.has(key)) {
        grouped.get(key)!.amount += amount;
      } else {
        grouped.set(key, { country, year, amount, date });
      }
    }

    return Array.from(grouped.values()).sort((a, b) => a.year - b.year || a.country.localeCompare(b.country));
  }
  constructor(
    @Inject('DataSource_analytica') private Analytica: DataSource,
    @Inject('DataSource_ceird') private Ceird: DataSource,
  ) {}

  /**
   * Obtiene la última fecha de actualización de los datos de IED.
   * @returns Fecha de la última actualización o null si no hay datos.
   */
  async getLastUpdateDate(): Promise<Date | null> {
    const result = await this.Analytica.query(`
        SELECT MAX([Fecha]) as lastUpdate FROM vw_SEBCRDIEDPorPaisT
        WHERE [US$ Millones] IS NOT NULL
      `);
    return result[0]?.lastUpdate ? new Date(result[0].lastUpdate) : null;
  }
  // endpoint para que el chatbot obtenga la última fecha de actualización de los datos

  /**
   * Obtiene la inversión extranjera directa (IED) agrupada por país y año.
   * @returns Array de objetos con país, año y monto.
   */
  async getIEDByCountry(page?: number, pageSize?: number): Promise<{ data: Array<{ country: string; year: number; amount: number; date: string }>, total: number }> {
    const rawData = await this.Analytica.query(`
      SELECT * FROM vw_SEBCRDIEDPorPaisT
      WHERE [US$ Millones] IS NOT NULL
    `);

    const grouped = new Map<string, { amount: number; country: string; year: number; date: string }>();

    for (const item of rawData) {
      const dateObj = new Date(item['Fecha']);
      const year = dateObj.getFullYear();
      const country = item['País'];
      const amount = Number(item['US$ Millones']);
      const date = dateObj.toISOString().split('T')[0]; // formato YYYY-MM-DD

      const key = `${country}-${year}`;
      if (grouped.has(key)) {
        grouped.get(key)!.amount += amount;
      } else {
        grouped.set(key, { country, year, amount, date });
      }
    }

    let data = Array.from(grouped.values()).sort((a, b) => a.year - b.year || a.country.localeCompare(b.country));
    const total = data.length;
    if (page && pageSize) {
      const start = (page - 1) * pageSize;
      data = data.slice(start, start + pageSize);
    }
    return { data, total };
  }

  /**
   * Obtiene la inversión extranjera directa (IED) agrupada por sector y año.
   * @returns HTML con el resumen de IED por sector y año.
   */
  async getIEDBySector(): Promise<Array<{ sector: string; year: number; amount: number; date: string }>> {
    const rawData = await this.Analytica.query(`
      SELECT * FROM vw_SEBCRDIEDPorSectorQ
      WHERE [US$ Millones] IS NOT NULL
    `);

    const grouped = new Map<string, { amount: number; sector: string; year: number; date: string }>();

    for (const item of rawData) {
      const dateObj = new Date(item['Fecha']);
      const year = dateObj.getFullYear();
      const sector = item['Sector'];
      const amount = Number(item['US$ Millones']);
      const date = dateObj.toISOString().split('T')[0];

      const key = `${sector}-${year}`;
      if (grouped.has(key)) {
        grouped.get(key)!.amount += amount;
      } else {
        grouped.set(key, { sector, year, amount, date });
      }
    }

    return Array.from(grouped.values()).sort((a, b) => a.year - b.year || a.sector.localeCompare(b.sector));
  }

  /**
   * Obtiene el resumen total de inversión extranjera directa (IED) por año.
   * @returns HTML con el resumen de IED total por año.
   */
  async getIEDSummaryByYear(): Promise<Array<{ year: number; amount: number; date: string }>> {
    const rawData = await this.Analytica.query(`
      SELECT * FROM vw_SEBCRDIEDPorPaisT
      WHERE [US$ Millones] IS NOT NULL
    `);

    const grouped = new Map<number, { amount: number; year: number; date: string }>();

    for (const item of rawData) {
      const dateObj = new Date(item['Fecha']);
      const year = dateObj.getFullYear();
      const amount = Number(item['US$ Millones']);
      const date = dateObj.toISOString().split('T')[0];

      if (grouped.has(year)) {
        grouped.get(year)!.amount += amount;
      } else {
        grouped.set(year, { year, amount, date });
      }
    }

    return Array.from(grouped.values()).sort((a, b) => a.year - b.year);
  }

  /**
   * Obtiene el resumen de exportaciones agrupadas por país y año.
   * @returns HTML con el resumen de exportaciones por país y año.
   */
  async getExportsByCountry(page?: number, pageSize?: number, year?: number, country?: string): Promise<{ data: Array<{ country: string; year: number; total: number; date: string }>, total: number }> {
    let query = `
      SELECT p.nombre AS Pais, d.fecha_declaracion AS Año, SUM(d.valor_exportacion_fob) AS Total
      FROM dbo.Declaraciones_New d
      JOIN dbo.Paises_New p ON d.pais_id = p.id
      WHERE d.valor_exportacion_fob IS NOT NULL AND d.valor_exportacion_fob > 0 AND d.fecha_declaracion >= 2020`;
    const params: any[] = [];
    let paramIndex = 0;
    if (year) {
      query += ` AND d.fecha_declaracion = @${paramIndex}`;
      params.push(year);
      paramIndex++;
    }
    if (country) {
      query += ` AND p.nombre = @${paramIndex}`;
      params.push(country);
      paramIndex++;
    }
    query += ` GROUP BY p.nombre, d.fecha_declaracion ORDER BY d.fecha_declaracion, p.nombre`;

    const rawData = await this.Ceird.query(query, params);

    let data = rawData.map((item: any) => ({
      country: item.Pais,
      year: item.Año,
      total: Number(item.Total),
      date: null
    }));
    const total = data.length;
    if (page && pageSize) {
      const start = (page - 1) * pageSize;
      data = data.slice(start, start + pageSize);
    }
    return { data, total };
  }

  /**
   * Obtiene la lista de productos disponibles.
   * @returns Array de objetos con código y descripción del producto.
   */
  async getProducts(): Promise<Array<{ code: string; description: string }>> {
    const rawData = await this.Ceird.query(`
      SELECT codigo_a6 AS code, descripcion AS description
      FROM dbo.Productos_New
      ORDER BY descripcion
    `);
    return rawData.map((item: any) => ({
      code: item.code,
      description: item.description
    }));
  }
  async getExportsByProduct(
    startDate: string,
    endDate: string,
  ): Promise<Array<{ country: string; total: number; date: string }>> {
    try {
      let endDateSQL = endDate;
      const currentYear = new Date().getFullYear();
      if (endDate.startsWith(currentYear.toString())) {
        endDateSQL = 'GETDATE()';
      } else {
        endDateSQL = `'${endDate}'`;
      }
      const rawData = await this.Analytica.query(`
        SELECT [Fecha], [País], SUM([US$ Millones]) AS total
        FROM vw_SEBCRDIEDPorPaisT
        WHERE [US$ Millones] IS NOT NULL
          AND [US$ Millones] > 0
          AND [Fecha] BETWEEN '${startDate}' AND ${endDateSQL}
        GROUP BY [Fecha], [País]
        ORDER BY [Fecha], [País]
      `);
      return rawData.map((item: any) => ({
        country: item['País'],
        total: Number(item.total),
        date: item.Fecha ? new Date(item.Fecha).toISOString().split('T')[0] : null
      }));
    } catch (error) {
      console.error('Error en getExportsByProduct:', error);
      throw error;
    }
  }
}

function formatUSD(value: number): string {
  if (value >= 1_000_000_000)
    return (value / 1_000_000_000).toFixed(2) + ' Billones';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + ' Millones';
  if (value >= 1_000) return (value / 1_000).toFixed(2) + ' Mil';
  return value.toFixed(2);
}