const { exec } = require('child_process');
const util = require('util');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const products = require('../public/data/Products.json');
const countries = require('../public/data/Countries.json');
const domains = require('../public/data/Domains.json');
const tools = require('../public/data/Tools.json');

//RAMI
const tradeAgreement = require('../public/data/AcuerdoComercial.json');
const tariffs = require('../public/data/ArancelesImpuestos.json');
const webResource = require('../public/data/RecursoWeb.json');
const technicalRequirements = require('../public/data/RegulacionesTecnicas.json');
const outputRequirement = require('../public/data/RequisitoSalida.json');
const importRequirement = require('../public/data/RequisitosImportacion.json');
//AlertaComercial
const alertacomerciales = require('../public/data/SAIM.json');
const axios = require('axios');
// DATAMARKET
const datamarket = require('../public/data/Datamarket.json');

//Links
const productURL = 'http://127.0.0.1:3001/apiv2/products';
const countryURL = 'http://127.0.0.1:3001/apiv2/countries';
const accesoamercadosURL = 'http://127.0.0.1:3001/apiv2/accesoamercado';

async function seedDatabase() {
  console.log('empezo el mambo');
  // Dominios reservados

  for (const domain of domains) {
    await prisma.reservedDomains.create({
      data: {
        name: domain.name,
        platform: domain.platform,
      },
    });
  }

  //Crear categorias por plataforma
  const categories = [
    {
      name: 'Oportunidades',
      platform: 'alertacomercial',
    },
    {
      name: 'Actualizaciones',
      platform: 'alertacomercial',
    },
    {
      name: 'Amenazas',
      platform: 'alertacomercial',
    },
    {
      name: 'Obstáculos',
      platform: 'alertacomercial',
    },
    {
      name: 'Oportunidades',
      platform: 'alertaIED',
    },
    {
      name: 'Tendencias',
      platform: 'alertaIED',
    },
    {
      name: 'Normativas',
      platform: 'alertaIED',
    },
    {
      name: 'Amenazas',
      platform: 'alertaIED',
    },
  ];

  // crear categorias
  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        platform: category.platform,
      },
    });
  }

  const categoriesAlertacomercial = await prisma.category.findMany({});

  // Crear productos
  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.Producto,
        code: product.SubPartida,
        oldID: product.Id,
      },
    });
  }

  for (const country of countries) {
    await prisma.country.create({
      data: {
        name: country.name,
        abbreviation: country.abbreviation,
        continent: country.continent,
        group: country.group,
      },
    });
  }

  // Acuerdo comercial en accesoamercado
  let productsAccesoaMercado;
  await axios.get(productURL).then((response) => {
    productsAccesoaMercado = response.data;
  });

  const getProductId = async (id) => {
    for (const product of productsAccesoaMercado) {
      if (product.oldID == id) {
        return product.id;
      }
    }
  };

  for (const trade of tradeAgreement) {
    const productID = await getProductId(trade.Id_Producto);
    await prisma.accesoaMercados.create({
      data: {
        productId: productID,
        countryId: trade.IdPais,
        tradeAgreement: trade.AcuerdoComercial,
      },
    });
  }

  let accesoaMercados;
  await axios.get(accesoamercadosURL).then((response) => {
    accesoaMercados = response.data;
  });
  const getRAMIId = async (pid, cid) => {
    for (const accesoamercado of accesoaMercados) {
      if (accesoamercado.productId == pid && accesoamercado.countryId == cid) {
        return accesoamercado.id;
      }
    }
  };

  // Agregar Aranceles Impuestos a cada RAMI
  for (const tariff of tariffs) {
    const productId = await getProductId(tariff.Id_Producto);
    const accesoamercadoID = await getRAMIId(productId, tariff.IdPais);
    if (accesoamercadoID == undefined) {
      continue;
    }
    await prisma.accesoaMercados.update({
      where: {
        id: accesoamercadoID,
      },
      data: {
        tariffsImposed: tariff.ArancelesImpuesto,
      },
    });
  }

  // Agregar Recursos Web a cada RAMI
  for (const web of webResource) {
    const productId = await getProductId(web.Id_Producto);
    const accesoamercadoID = await getRAMIId(productId, web.IdPais);
    if (accesoamercadoID == undefined) {
      continue;
    }
    await prisma.accesoaMercados.update({
      where: {
        id: accesoamercadoID,
      },
      data: {
        webResource: web.Recurso,
      },
    });
  }

  // Agregar Regulaciones Tecnicas a cada RAMI
  for (const tech of technicalRequirements) {
    const productId = await getProductId(tech.Id_Producto);
    const accesoamercadoID = await getRAMIId(productId, tech.IdPais);
    if (accesoamercadoID == undefined) {
      continue;
    }
    await prisma.accesoaMercados.update({
      where: {
        id: accesoamercadoID,
      },
      data: {
        technicalRequirements: tech.RequisitosTecnicos,
        permitsCertifications: tech.PermisosCertificaciones,
        labelingCertifications: tech.EtiquetadoCertificado,
      },
    });
  }

  // Agregar Requisitos de Salida a cada RAMI
  for (const output of outputRequirement) {
    const productId = await getProductId(output.Id_Producto);
    const accesoamercadoID = await getRAMIId(productId, output.IdPais);
    if (accesoamercadoID == undefined) {
      continue;
    }
    await prisma.accesoaMercados.update({
      where: {
        id: accesoamercadoID,
      },
      data: {
        outputRequirement: output.ResquisitoSalida,
      },
    });
  }

  // Agregar Requisitos de Importacion a cada RAMI
  for (const input of importRequirement) {
    const productId = await getProductId(input.Id_Producto);
    const accesoamercadoID = await getRAMIId(productId, input.IdPais);
    if (accesoamercadoID == undefined) {
      continue;
    }
    await prisma.accesoaMercados.update({
      where: {
        id: accesoamercadoID,
      },
      data: {
        importRequirement: input.RequisitoImportacion,
      },
    });
  }

  // AlertaComercial
  // Agregar AlertaComercial's
  for (const s of alertacomerciales) {
    let id;
    for (const category of categoriesAlertacomercial) {
      if (
        category.name == s.Clasificacion &&
        category.platform == 'alertacomercial'
      ) {
        id = category.id;
        continue;
      }
    }
    // Separar productos para crear un JSON con todos los productos y codigo arancelario de c/u
    const products = s.Productos.split(',');
    const productsJSON = [];
    for (const product of products) {
      const productID = await prisma.product.findFirst({
        where: {
          name: product,
        },
      });
      if (productID == null) {
        continue;
      }
      productsJSON.push({
        ...productID,
      });
    }
    // Separar paises y crear JSON con todos sus datos
    const countries = s.Pais.split(',');
    const countriesJSON = [];
    for (const country of countries) {
      const countryID = await prisma.country.findFirst({
        where: {
          name: country,
        },
      });
      if (countryID == null) {
        continue;
      }
      countriesJSON.push({
        ...countryID,
      });
    }
    await prisma.alertaComercial.create({
      data: {
        title: s.Titular,
        description: s.Contenido,
        categoryId: id,
        image: s.Imagen,
        products: productsJSON,
        countries: countriesJSON,
        platform: 'alertacomercial',
        oldID: s.Id,
      },
    });
  }

  // Datamarket

  for (const data of datamarket) {
    await prisma.datamarket.create({
      data: {
        title: data.Seccion,
        category: data.Cat ? data.Cat : data.Seccion,
        url: data.Url,
      },
    });
  }
}

function executeCommandAsync(
  command: string,
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function main() {
  // await axios.get('http://127.0.0.1:3001/apiv2/data/deleteImages');
  await prisma.$connect();
  // try {
  //   const { stdout, stderr } = await executeCommandAsync('npx prisma db push');
  //   console.log(`Salida: ${stdout}`);
  //   if (stderr) {
  //     console.error(`Error: ${stderr}`);
  //   }
  // } catch (error) {
  //   console.error(`Error: ${error.message}`);
  // }
  await seedDatabase();
  await axios.get('http://127.0.0.1:3001/apiv2/data/newImages');
  await prisma.$disconnect();
  // }
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
