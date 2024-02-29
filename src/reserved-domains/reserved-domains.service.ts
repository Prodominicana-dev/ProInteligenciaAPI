import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, reservedDomains } from '@prisma/client';

@Injectable()
export class ReservedDomainsService {
  constructor(private prisma: PrismaService) {}

  async createReservedDomains(
    data: Prisma.reservedDomainsCreateInput,
  ): Promise<reservedDomains> {
    return this.prisma.reservedDomains.create({
      data: {
        ...data,
      },
    });
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

  async editReservedDomains(
    id: string,
    data: Prisma.reservedDomainsUpdateInput,
  ): Promise<reservedDomains> {
    return this.prisma.reservedDomains.update({
      where: { id },
      data,
    });
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
