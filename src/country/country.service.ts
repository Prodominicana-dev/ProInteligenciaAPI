import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Country } from '@prisma/client';

@Injectable()
export class CountryService {
  constructor(private prisma: PrismaService) {}

  async getCountries(): Promise<Country[]> {
    return this.prisma.country.findMany();
  }

  async getCountryById(id: number): Promise<Country | null> {
    return this.prisma.country.findUnique({
      where: { id: +id },
    });
  }

  // Get country with label and value
  async getCountriesLabelValue(): Promise<any[]> {
    const countries = await this.prisma.country.findMany({});

    const countriesLabelValue = countries.map((country) => {
      return { label: `${country.name}`, value: country };
    });

    return countriesLabelValue;
  }

  // Crear país
  async create(data: any){
    try {
      return await this.prisma.country.create({
        data
      });
    } catch (error) {
      console.log(error)
      throw new Error(error);
      
    }
  }

  // Editar país
  async update(id: number, data: any){
    try {
      return await this.prisma.country.update({
        where: { id: id },
        data
      });
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
  }

  // Eliminar país
  async delete(id: number){
    try {
      return await this.prisma.country.delete({
        where: { id: id }
      });
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
  }

  // Obtener un país por la abbreviation
  async getCountryByAbbreviation(abbreviation: string): Promise<Country | null> {
    return this.prisma.country.findFirst({
      where: { abbreviation },
    });
  }
}
