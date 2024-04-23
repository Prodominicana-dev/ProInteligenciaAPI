import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, reservedDomains } from '@prisma/client';

@Injectable()
export class ReservedDomainsService {
  constructor(private prisma: PrismaService) {}

  async createReservedDomains(
    data: Prisma.reservedDomainsCreateInput,
  ): Promise<reservedDomains> {
   try {
    return this.prisma.reservedDomains.create({
      data: {
        ...data,
      },
    });
   } catch (error) {
    console.log(error)
   }
  }

  async getReservedDomainsById(id: string): Promise<reservedDomains | null> {
    return this.prisma.reservedDomains.findUnique({
      where: { id },
    });
  }

  async getReservedDomainsByPlatform(
    platform: string,
  ): Promise<reservedDomains[] | null> {
    return this.prisma.reservedDomains.findMany({
      where: { platform },
    });
  }

  async getAllDomains(){
    try {
      return this.prisma.reservedDomains.findMany({orderBy: [{platform: 'asc'}, {name: 'asc'}] })
    } catch (error) {
      throw new Error(error);
    }
  }

  async editReservedDomains(
    id: string,
    data: Prisma.reservedDomainsUpdateInput,
  ): Promise<reservedDomains> {
    try {
      return this.prisma.reservedDomains.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
  }

  async getAllReservedDomains(): Promise<any> {
    // Hacer un arreglo de strings con los dominios reservados de AlertaComercial y SIED
    const alertacomercialDomains =
      await this.getReservedDomainsByPlatform('alertacomercial');
    const alertaIEDDomains =
      await this.getReservedDomainsByPlatform('alertaIED');
    const alertacomercialDomainsArray = alertacomercialDomains.map(
      (domain) => domain.name,
    );
    const alertaIEDDomainsArray = alertaIEDDomains.map((domain) => domain.name);
    const data = {
      alertacomercial: alertacomercialDomainsArray,
      alertaIED: alertaIEDDomainsArray,
    };
    return data;
  }

  async deleteReservedDomainsById(id: string): Promise<reservedDomains> {
    return this.prisma.reservedDomains.delete({
      where: { id },
    });
  }
}
