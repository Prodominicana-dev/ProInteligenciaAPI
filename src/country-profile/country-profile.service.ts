import { Injectable } from '@nestjs/common';
import { CountryProfile, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CountryProfileService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo perfil de país
  async createCountryProfile(data: any): Promise<CountryProfile> {
    return this.prisma.countryProfile.create({
      data: {
        countryId: +data.countryId,
        pdf: data.pdf,
        status: data.status ?? 'active',
      },
    });
  }

  // Obtener todos los perfiles junto a las regiones disponibles.
  // Se ordenan por el nombre del país para que las banderas salgan
  // en orden alfabético.
  async getAll(): Promise<any> {
    const countryProfiles = await this.prisma.countryProfile.findMany({
      include: {
        country: {
          include: {
            region: true,
          },
        },
      },
      orderBy: [
        {
          country: {
            name: 'asc',
          },
        },
      ],
    });

    // Regiones presentes en los perfiles existentes, sin repetir
    const regions = countryProfiles
      .map((countryProfile) => countryProfile.country?.region)
      .filter((region) => region !== null && region !== undefined)
      .filter(
        (region, index, list) =>
          list.findIndex((r) => r.id === region.id) === index,
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    return { regions, countryProfiles };
  }

  // Obtener solo los perfiles activos
  async getActive(): Promise<any> {
    const data = await this.getAll();
    const countryProfiles = data.countryProfiles.filter(
      (countryProfile: any) => countryProfile.status === 'active',
    );

    const regions = countryProfiles
      .map((countryProfile: any) => countryProfile.country?.region)
      .filter((region: any) => region !== null && region !== undefined)
      .filter(
        (region: any, index: number, list: any[]) =>
          list.findIndex((r) => r.id === region.id) === index,
      )
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    return { regions, countryProfiles };
  }

  // Obtener un perfil por id
  async getCountryProfileById(id: string): Promise<any> {
    return this.prisma.countryProfile.findUnique({
      where: { id },
      include: {
        country: {
          include: {
            region: true,
          },
        },
      },
    });
  }

  // Obtener los perfiles de una región
  async getCountryProfilesByRegion(regionId: number): Promise<any> {
    return this.prisma.countryProfile.findMany({
      where: {
        country: {
          regionId: +regionId,
        },
      },
      include: {
        country: {
          include: {
            region: true,
          },
        },
      },
      orderBy: [
        {
          country: {
            name: 'asc',
          },
        },
      ],
    });
  }

  // Actualizar un perfil
  async updateCountryProfile(
    id: string,
    data: Prisma.CountryProfileUpdateInput | any,
  ): Promise<CountryProfile> {
    const { countryId, ...rest } = data;
    return this.prisma.countryProfile.update({
      where: { id },
      data: {
        ...rest,
        ...(countryId ? { countryId: +countryId } : {}),
      },
    });
  }

  // Eliminar un perfil
  async deleteCountryProfile(id: string): Promise<CountryProfile> {
    return this.prisma.countryProfile.delete({
      where: { id },
    });
  }
}
