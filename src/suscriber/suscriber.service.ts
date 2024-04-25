import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';
import { CategoryService } from 'src/category/category.service';

interface Suscriber {
  email: string;
  platform: string;
  name: string;
  countryId: number[];
  productId: number[];
  status?: string;
}

@Injectable()
export class SuscriberService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly categoryService: CategoryService,
  ) {}

  async createSubscriber(data) {
    const { products, countries, ...subscriberData } = data;
    console.log(products, countries, subscriberData);
    return await this.prismaService.suscriber.create({
      data: {
        ...subscriberData,
        suscriber_countries: {
          create: countries.map((countryId) => ({
            countryId,
          })),
        },
        suscriber_products: {
          create: products.map((productId) => ({
            productId,
          })),
        },
      },
    });
  }

  async createAlertaIEDSubscriber(data) {
    const { categories, ...subscriberData } = data;

    return await this.prismaService.suscriber.create({
      data: {
        ...subscriberData,
        suscriber_category: {
          create: categories.map((categoryId) => ({
            categoryId,
          })),
        },
      },
    });
  }

  // Get suscriber by email and platform
  async getSuscriberByEmailAndPlatform(email: string, platform: string) {
    return await this.prismaService.suscriber.findFirst({
      where: {
        email,
        platform,
      },
      include: {
        suscriber_countries: {
          include: {
            country: true,
          },
        },
        suscriber_products: {
          include: {
            product: true,
          },
        },
        suscriber_category: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  // Get suscriber by email
  async getSubscriberByEmail(email) {
    return await this.prismaService.suscriber.findFirst({
      where: {
        email,
      },
      include: {
        suscriber_countries: {
          include: {
            country: true,
          },
        },
        suscriber_products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Get suscriber by id
  async getSuscriberById(id: string) {
    return await this.prismaService.suscriber.findUnique({
      where: {
        id,
      },
    });
  }

  // Get all suscribers by platform
  async getAllSuscribersByPlatform(platform: string) {
    return await this.prismaService.suscriber.findMany({
      where: {
        platform,
      },
    });
  }

  // // Update suscriber by email and platform
  async updateAlertacomercialSubscriber(data) {
    const { products, countries, email, platform, ...subscriberData } = data;

    // Primero, busca el suscriptor a actualizar
    const subscriber = await this.prismaService.suscriber.findFirst({
      where: {
        email: email,
        platform: platform,
      },
    });
    console.log(subscriber);

    if (!subscriber) {
      // crearlo si no existe
      const sub = await this.createSubscriber(data);
      const suscriptor = await this.getSuscriberByEmailAndPlatform(
        sub.email,
        sub.platform,
      );
      const countries = suscriptor.suscriber_countries.map((country) => ({
        name: country.country.name,
      }));
      const products = suscriptor.suscriber_products.map((product) => ({
        name: product.product.name,
      }));
      const title = 'Suscripción a las Alertas Comerciales';
      return await this.mailService
        .alertaComercialMail(title, sub.email, sub.name, products, countries)
        .then(async () => {
          const title = 'Nueva Suscripción a las Alertas Comerciales';
          console.log(title, sub.name, products, countries);
          return await this.mailService.alertaComercialNotifyMail(
            title,
            ['emilioconde@prodominicana.gob.do', 'rosaabreu@prodominicana.gob.do', 'andydelrosario@prodominicana.gob.do' ],
            sub.name,
            products,
            countries,
          );
        });
      
    }

    // Luego, actualiza el suscriptor y sus relaciones
    return await this.prismaService.suscriber
      .update({
        where: { id: subscriber.id },
        data: {
          ...subscriberData,
          suscriber_countries: {
            deleteMany: {}, // Borrará todas las relaciones existentes
            create: countries.map((countryId) => ({ countryId })),
          },
          suscriber_products: {
            deleteMany: {}, // Borrará todas las relaciones existentes
            create: products.map((productId) => ({ productId })),
          },
        },
        include: {
          suscriber_countries: {
            include: {
              country: true,
            },
          },
          suscriber_products: {
            include: {
              product: true,
            },
          },
        },
      })
      .then(async (sub) => {
        const countries = sub.suscriber_countries.map((country) => ({
          name: country.country.name,
        }));
        const products = sub.suscriber_products.map((product) => ({
          name: product.product.name,
        }));
        const title =
          'Actualización de la suscripción a las Alertas Comerciales';
        console.log(title, sub.name, products, countries);
       try {
        return await this.mailService.alertaComercialMail(
          title,
          sub.email,
          sub.name,
          products,
          countries,
        );
       } catch (error) {
        console.log(error)
       }
        
      });
  }

  async updateAlertaIEDSubscriber(data) {
    const { email, platform, categories, ...subscriberData } = data;

    // Primero, busca el suscriptor a actualizar
    const subscriber = await this.prismaService.suscriber.findFirst({
      where: {
        email: email,
        platform: platform,
      },
    });

    if (!subscriber) {
      // crearlo si no existe
      const sub = await this.createAlertaIEDSubscriber(data);
      const suscriptor = await this.getSuscriberByEmailAndPlatform(
        sub.email,
        sub.platform,
      );

      const categories = suscriptor.suscriber_category.map((category) => ({
        name: category.category.name,
      }));
      const title = 'Suscripción a las Alertas de IED';
      return await this.mailService
        .alertaIEDMail(title, sub.email, sub.name, categories)
        .then(async () => {
          const title = 'Nueva Suscripción a las Alertas de IED';
          return await this.mailService.alertaIEDNotifyMail(
            title,
            ['temistoclesvalera@prodominicana.gob.do'],
            sub.name,
            categories,
          );
        });
      return
    }
    // Luego, actualiza el suscriptor y sus relaciones
    return await this.prismaService.suscriber
      .update({
        where: { id: subscriber.id },
        data: {
          ...subscriberData,
          suscriber_category: {
            deleteMany: {}, // Borrará todas las relaciones existentes
            create: categories.map((categoryId) => ({ categoryId })),
          },
        },
        include: {
          suscriber_category: {
            include: {
              category: true,
            },
          },
        },
      })
      .then(async (sub) => {
        const categories = sub.suscriber_category.map((category) => ({
          name: category.category.name,
        }));
        const title = 'Actualización de la suscripción a las Alertas de IED';
        return await this.mailService.alertaIEDMail(
          title,
          sub.email,
          sub.name,
          categories,
        );
        
      });
  }

  // Get all suscribers emails (no repeat) of a products or countries
  async getAllSuscribersEmailsByProductsOrCountries(
    products: string[],
    countries: number[],
  ) {
    return await this.prismaService.suscriber.findMany({
      where: {
        OR: [
          {
            suscriber_products: {
              some: {
                productId: {
                  in: products,
                },
              },
            },
          },
          {
            suscriber_countries: {
              some: {
                countryId: {
                  in: countries,
                },
              },
            },
          },
        ],
        platform: 'alertacomercial',
      },
      select: {
        email: true,
      },
    });
  }

  // Get all suscribers
  async getAllSuscribers() {
    return await this.prismaService.suscriber.findMany({
      include: {
        suscriber_countries: {
          include: {
            country: true,
          },
        },
        suscriber_products: {
          include: {
            product: true,
          },
        },
        suscriber_category: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  // Get all suscribers emails (no repeat) of a categories
  async getAllSuscribersEmailsByCategory(categories: string | string[]) {
    console.log(categories);
    if (!Array.isArray(categories)) {
      categories = [categories]; // convierte categories a un array si no lo es
    }
    return await this.prismaService.suscriber.findMany({
      where: {
        suscriber_category: {
          some: {
            categoryId: {
              in: categories,
            },
          },
        },
        platform: 'alertaIED',
      },
      select: {
        email: true,
      },
    });
  }
}
