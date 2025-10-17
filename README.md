
# ProInteligenciaAPI

API desarrollada con NestJS para la gestión y consulta de datos de inteligencia comercial, exportaciones, inversión extranjera y otros indicadores relevantes para ProDominicana.

## Funcionalidades principales
- Chatbot con endpoints para consulta de inversión extranjera directa (IED) por país, sector y año.
- Consulta de exportaciones por país y producto, con filtros por año y producto.
- Integración con bases de datos externas (Analytica y Ceird) usando TypeORM.
- Gestión de datos internos con Prisma ORM.
- Endpoints para manejo de imágenes y archivos relacionados a alertas comerciales y posts.

## Dependencias principales
- [NestJS](https://nestjs.com/): Framework principal para la API.
- [TypeORM](https://typeorm.io/): Conexión y consulta a bases de datos externas.
- [Prisma](https://www.prisma.io/): ORM para gestión de datos internos.
- [Express](https://expressjs.com/): Servidor HTTP subyacente.
- [MSSQL](https://www.npmjs.com/package/mssql): Driver para conexión a SQL Server.
- [PostgreSQL](https://www.postgresql.org/): Base de datos principal para Prisma.

## Instalación

```bash
$ npm install
```

## Ejecución

```bash
# desarrollo
$ npm run start

# modo watch
$ npm run start:dev

# producción
$ npm run start:prod
```

## Endpoints principales

### Endpoints de IED (Inversión Extranjera Directa)
- `GET /apiv2/chatbot/ied-by-country` — IED por país
- `GET /apiv2/chatbot/ied-by-sector` — IED por sector
- `GET /apiv2/chatbot/ied-summary-by-year` — Resumen IED por año
- `GET /apiv2/chatbot/last-update-date` — Última fecha de actualización de la data

### Endpoints de Exportaciones
- `GET /apiv2/chatbot/exports-by-country?year=YEAR&country=COUNTRY&page=PAGE&pageSize=SIZE` — Exportaciones por país (con filtros opcionales)  
- `GET /apiv2/chatbot/exports-by-product-country?product=PRODUCT&country=COUNTRY&year=YEAR&page=PAGE&pageSize=SIZE` — Exportaciones por producto y país (con filtros)
- `GET /apiv2/chatbot/products` — Lista de productos disponibles
- `GET /apiv2/chatbot/exports-2020` — Exportaciones para el año 2020
- `GET /apiv2/chatbot/exports-2021` — Exportaciones para el año 2021
- `GET /apiv2/chatbot/exports-2022` — Exportaciones para el año 2022
- `GET /apiv2/chatbot/exports-2023` — Exportaciones para el año 2023
- `GET /apiv2/chatbot/exports-2024` — Exportaciones para el año 2024
- `GET /apiv2/chatbot/exports-2025` — Exportaciones para el año 2025
  
### Notas sobre formato de respuesta

- Los endpoints de IED retornan la información en formato HTML para compatibilidad con agentes de IA.
- Los endpoints de exportaciones y productos retornan datos en formato JSON para mejor integración con aplicaciones modernas.

## Actualizaciones Recientes

### Integración de Base de Datos para Chatbot (Rama: feature/chatbot-db-integration)

- **Nueva Estructura de Base de Datos**: Se crearon nuevas tablas relacionales para datos de exportaciones:
  - `Declaraciones_New`: Contiene declaraciones de exportaciones con referencias a países y productos.
  - `Paises_New`: Lista de países destino.
  - `Productos_New`: Catálogo de productos con códigos A6 y descripciones.
  - Estas tablas reemplazan consultas directas a Excel y mejoran el rendimiento y la integridad de datos.

- **Script de Importación Actualizado** (`src/scripts/create-db-from-excel.ts`):
  - Cambia el tipo de `fecha_declaracion` de NVARCHAR a INT para almacenar años como números enteros.
  - Procesa fechas para extraer años y filtra datos desde 2020 en adelante.
  - Utiliza batch inserts para importar grandes volúmenes de datos (ej. 391k filas).
  - Ejecutar con: `npx ts-node src/scripts/create-db-from-excel.ts`

- **Servicio de Chatbot Actualizado** (`src/chatbot/chatbot.service.ts`):
  - Nuevos métodos: `getProducts()` para listar productos disponibles.
  - Actualizados: `getExportsByCountry()` y `getExportsByProductCountry()` ahora consultan las nuevas tablas con JOINs, agregan filtros por año y país, y soportan paginación.
  - Filtros aplicados: Solo años >= 2020, valores > 0.

- **Controlador de Chatbot Actualizado** (`src/chatbot/chatbot.controller.ts`):
  - Nuevos endpoints dedicados por año: `exports-2020`, `exports-2021`, ..., `exports-2025`.
  - Endpoint `products` para obtener lista de productos.
  - Parámetros de query agregados a `exports-by-country` y `exports-by-product-country` para filtros opcionales.

- **Configuración de Redis**:
  - Puerto cambiado a 6380 en `Redis/redis.windows.conf` para evitar conflictos.
  - Asegurar que Redis esté corriendo en el puerto 6380 antes de iniciar la aplicación.

- **Versionado**:
  - Cambios subidos a la rama `feature/chatbot-db-integration` en GitHub.
  - Para probar: Cambiar a la rama y ejecutar `npm run start:dev` con Redis activo.

## Test

```bash
# pruebas unitarias
$ npm run test

# pruebas e2e
$ npm run test:e2e

# cobertura
$ npm run test:cov
```

## Licencia

MIT

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - Equipo de Desarollo de ProDominicana
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


<p align="center">A progressive Node.js framework for building efficient and scalable server-side applications.</p>

<p align="center">
	<a href="https://www.npmjs.com/package/@nestjs/core"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
	<a href="https://www.npmjs.com/package/@nestjs/core"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
	<a href="https://www.npmjs.com/package/@nestjs/core"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
	<a href="https://circleci.com/gh/nestjs/nest"><img src="https://img.shields.io/circleci/project/github/nestjs/nest/master.svg" alt="CircleCI" /></a>
	<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://img.shields.io/coveralls/github/nestjs/nest/master.svg" alt="Coverage" /></a>
	<a href="https://discord.gg/nestjs"><img src="https://img.shields.io/discord/428938820624256000.svg" alt="Discord" /></a>
	<a href="https://opencollective.com/nest"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
	<a href="https://opencollective.com/nest/sponsors/0/website"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
</p>
