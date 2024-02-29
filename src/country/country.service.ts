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
}
