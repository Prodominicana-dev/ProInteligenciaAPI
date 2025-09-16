
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

- `GET /apiv2/chatbot/ied-by-country` — IED por país
- `GET /apiv2/chatbot/ied-by-sector` — IED por sector
- `GET /apiv2/chatbot/ied-summary-by-year` — Resumen IED por año
- `GET /apiv2/chatbot/exports-by-country` — Exportaciones por país
- `GET /apiv2/chatbot/exports-by-product/:startYear/:endYear` — Exportaciones por producto y rango de años
- `GET /apiv2/chatbot/last-update-date` — Última fecha de actualización de la data
- `GET /apiv2/chatbot/ied-by-country-filtered?producto=PRODUCTO&fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD` — IED por país filtrado por producto y fechas


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
