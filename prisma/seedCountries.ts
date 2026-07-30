/*
 *  Completa la tabla Country con todos los países (ISO 3166-1).
 *
 *  Es idempotente: los países que ya existen (se identifican por su
 *  abreviatura) NO se modifican, solo se insertan los que faltan. Así no
 *  se pierde ninguna relación existente de Acceso a Mercados ni las
 *  regiones ya asignadas.
 *
 *  Uso:  npx ts-node prisma/seedCountries.ts
 */
const { PrismaClient } = require('@prisma/client');
const countries = require('./data/CountriesAll.json');

const prisma = new PrismaClient();

async function seedCountries() {
  const existing = await prisma.country.findMany({
    select: { abbreviation: true },
  });
  const existingAbbrs = new Set(
    existing.map((country) => country.abbreviation.toLowerCase()),
  );

  let created = 0;
  let skipped = 0;

  for (const country of countries) {
    const abbreviation = country.abbreviation.toLowerCase();

    if (existingAbbrs.has(abbreviation)) {
      skipped++;
      continue;
    }

    await prisma.country.create({
      data: {
        name: country.name,
        abbreviation,
        continent: country.continent ?? null,
      },
    });
    created++;
  }

  console.log(`Países agregados: ${created}`);
  console.log(`Países que ya existían (sin cambios): ${skipped}`);
  console.log(`Total en el archivo: ${countries.length}`);
}

seedCountries()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Se declara como módulo para no chocar con el ámbito global de seed.ts
export {};
