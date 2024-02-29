import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, AccesoaMercados } from '@prisma/client';
import { CountryService } from 'src/country/country.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class AccesoaMercadosService {
  constructor(
    private prisma: PrismaService,
    private countryService: CountryService,
    private productService: ProductService,
  ) {}

  async createaccesoaMercados(
    data: Prisma.AccesoaMercadosCreateInput,
  ): Promise<AccesoaMercados> {
    return this.prisma.accesoaMercados.create({
      data: {
        ...data,
      },
    });
  }

  async getaccesoaMercadosById(id: string): Promise<any> {
    return this.prisma.accesoaMercados.findUnique({
      where: { id },
      include: {
        country: true,
        product: true,
      },
    });
  }

  // Get AccesoaMercado by productId and CountryId
  async getaccesoaMercadosByProductIdAndCountryId(
    productId: string,
    countryId: number,
  ): Promise<AccesoaMercados | null> {
    return this.prisma.accesoaMercados.findFirst({
      where: {
        productId,
        countryId: Number(countryId),
      },
    });
  }

  async editaccesoaMercados(
    id: string,
    data: Prisma.AccesoaMercadosUpdateInput,
  ): Promise<AccesoaMercados> {
    return this.prisma.accesoaMercados.update({
      where: { id },
      data,
    });
  }

  async getAllaccesoaMercados(): Promise<any[]> {
    return this.prisma.accesoaMercados.findMany({
      where: {
        status: 'active',
      },
      select: {
        id: true,
        countryId: true,
        productId: true,
      },
    });
  }

  async getAllSettingsaccesoaMercados(): Promise<any[]> {
    return this.prisma.accesoaMercados.findMany({
      where: {
        status: 'active',
      },
      select: {
        id: true,
        country: {
          select: {
            name: true,
          },
        },
        product: {
          select: {
            name: true,
            code: true,
          },
        },
      },
      orderBy: [
        {
          productId: 'asc',
        },
      ],
    });
  }

  async deleteAccesoaMercadoById(id: string): Promise<AccesoaMercados> {
    return this.prisma.accesoaMercados.delete({
      where: { id },
    });
  }
}
