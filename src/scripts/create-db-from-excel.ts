import * as ExcelJS from 'exceljs';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

function parseDateRange(str: string): string | null {
  const match = str.match(/(\w+)-(\w+)\s+(\d{4})/);
  if (match) {
    const [, startMonth, , year] = match;
    const monthMap: { [key: string]: string } = {
      enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
      julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
    };
    const month = monthMap[startMonth.toLowerCase()];
    if (month) {
      return `${year}-${month}-01`;
    }
  }
  return null;
}

async function createDatabaseFromExcel() {
  // Initialize DataSource for CEIRD
  const dataSource = new DataSource({
    type: 'mssql',
    url: process.env.DATAMARKET_CEIRD_DATABASE_URL,
    entities: [],
    synchronize: false,
    requestTimeout: 300000,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  });

  await dataSource.initialize();
  console.log('DataSource initialized.');

  // Path to Excel
  const excelPath = 'C:\\Proyectos ProInteligencia\\ProInteligenciaAPI\\chatbot data\\Chatbot ProDominicana.xlsx'; // Change to your path
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);

  const worksheet = workbook.getWorksheet(1);
  const headers = [];
  worksheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber - 1] = cell.value?.toString().replace(/[^a-zA-Z0-9_]/g, '_') || `Col_${colNumber}`;
  });

  // Infer schema from first few rows
  const sampleRows = [];
  let rowIndex = 2;
  while (sampleRows.length < 10 && rowIndex <= worksheet.rowCount) {
    const row = worksheet.getRow(rowIndex);
    const rowData = {};
    row.eachCell((cell, colNumber) => {
      rowData[headers[colNumber - 1]] = cell.value;
    });
    if (Object.values(rowData).some(v => v !== null && v !== undefined)) {
      sampleRows.push(rowData);
    }
    rowIndex++;
  }

  // Create relational tables
  const createTablesSQL = `
    IF OBJECT_ID('dbo.Declaraciones_New', 'U') IS NOT NULL DROP TABLE dbo.Declaraciones_New;
    IF OBJECT_ID('dbo.Productos_New', 'U') IS NOT NULL DROP TABLE dbo.Productos_New;
    IF OBJECT_ID('dbo.Paises_New', 'U') IS NOT NULL DROP TABLE dbo.Paises_New;

    CREATE TABLE dbo.Paises_New (
      id INT IDENTITY(1,1) PRIMARY KEY,
      nombre NVARCHAR(100) UNIQUE NOT NULL
    );

    CREATE TABLE dbo.Productos_New (
      id INT IDENTITY(1,1) PRIMARY KEY,
      codigo_a6 NVARCHAR(50) UNIQUE NOT NULL,
      descripcion NVARCHAR(MAX)
    );

    CREATE TABLE dbo.Declaraciones_New (
      id INT IDENTITY(1,1) PRIMARY KEY,
      fecha_declaracion INT,
      pais_id INT FOREIGN KEY REFERENCES dbo.Paises_New(id),
      producto_id INT FOREIGN KEY REFERENCES dbo.Productos_New(id),
      valor_exportacion_fob DECIMAL(18,2),
      valor_importacion_fob DECIMAL(18,2)
    );

    CREATE INDEX IX_Declaraciones_Fecha_New ON dbo.Declaraciones_New(fecha_declaracion);
    CREATE INDEX IX_Declaraciones_Pais_New ON dbo.Declaraciones_New(pais_id);
    CREATE INDEX IX_Declaraciones_Producto_New ON dbo.Declaraciones_New(producto_id);
  `;
  await dataSource.query(createTablesSQL);
  console.log('Relational tables created.');

  // Collect all data
  const allData = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const rowData = {};
    row.eachCell((cell, colNumber) => {
      let value = cell.value;
      const header = headers[colNumber - 1];
      if (value && typeof value === 'object' && 'error' in value) {
        value = null; // Handle Excel errors like #VALUE!
      }
      if (header.toLowerCase().includes('fecha') && typeof value === 'string') {
        const parsed = parseDateRange(value);
        if (parsed) {
          const year = parsed.split('-')[0];
          value = parseInt(year);
        } else if (!isNaN(Number(value))) {
          value = parseInt(value);
        }
      }
      if (value === 'n/d' || value === 'N/D') {
        value = null;
      }
      if (value instanceof Date) {
        value = value.getFullYear();
      }
      rowData[header] = value;
    });
    allData.push(rowData);
  });

  console.log(`Processing ${allData.length} rows.`);

  // Extract uniques
  const paisesSet = new Set<string>();
  const productosMap = new Map<string, { codigo: string; descripcion: string }>();
  allData.forEach(row => {
    if (row.Pa_s && typeof row.Pa_s === 'string') paisesSet.add(row.Pa_s);
    if (row.c_digo_a6 && typeof row.c_digo_a6 === 'string' && row.Descripci_n && typeof row.Descripci_n === 'string') {
      productosMap.set(row.c_digo_a6, { codigo: row.c_digo_a6, descripcion: row.Descripci_n });
    }
  });

  // Insert Paises
  const paisesArray = Array.from(paisesSet);
  for (const pais of paisesArray) {
    await dataSource.query('INSERT INTO dbo.Paises_New (nombre) VALUES (@0)', [pais]);
  }
  console.log(`Inserted ${paisesArray.length} paises.`);

  // Get pais ids
  const paisesResult = await dataSource.query('SELECT id, nombre FROM dbo.Paises_New');
  const paisIdMap = new Map(paisesResult.map((p: any) => [p.nombre, p.id]));

  // Insert Productos
  const productosArray = Array.from(productosMap.values());
  for (const prod of productosArray) {
    await dataSource.query('INSERT INTO dbo.Productos_New (codigo_a6, descripcion) VALUES (@0, @1)', [prod.codigo, prod.descripcion]);
  }
  console.log(`Inserted ${productosArray.length} productos.`);

  // Get producto ids
  const productosResult = await dataSource.query('SELECT id, codigo_a6 FROM dbo.Productos_New');
  const productoIdMap = new Map(productosResult.map((p: any) => [p.codigo_a6, p.id]));

  // Insert Declaraciones in batches
  const batchSize = 300;
  for (let i = 0; i < allData.length; i += batchSize) {
    const batch = allData.slice(i, i + batchSize);
    const values = batch.map(row => [
      row.A_o_de_Fecha_Declaraci_n,
      paisIdMap.get(row.Pa_s),
      productoIdMap.get(row.c_digo_a6),
      row.Valor_de_exportaci_n_en_US__FOB,
      row.Valor_de_importaci_n_en_US__FOB
    ]);
    const placeholders = values.map((_, idx) => `(@${idx * 5}, @${idx * 5 + 1}, @${idx * 5 + 2}, @${idx * 5 + 3}, @${idx * 5 + 4})`).join(', ');
    const flatValues = values.flat();
    await dataSource.query(`INSERT INTO dbo.Declaraciones_New (fecha_declaracion, pais_id, producto_id, valor_exportacion_fob, valor_importacion_fob) VALUES ${placeholders}`, flatValues);
  }
  console.log(`Inserted ${allData.length} declaraciones.`);

  console.log('Database creation and import completed.');
  await dataSource.destroy();
}

createDatabaseFromExcel().catch(console.error);