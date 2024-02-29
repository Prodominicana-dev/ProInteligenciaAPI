import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAlertacomercialCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      where: {
        platform: 'alertacomercial',
      },
    });
  }

  async getAlertaIEDCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      where: {
        platform: 'alertaIED',
      },
    });
  }

  async getSelectAlertaIEDCategories() {
    // Crear un objeto que tenga value (id) y label (nombre) de las categorias
    const categories = await this.getAlertaIEDCategories();
    const selectCategories = categories.map((category) => {
      return { label: category.name, value: category.id };
    });
    return selectCategories;
  }

  async createCategory(data) {
    return await this.prisma.category.create({
      data,
    });
  }

  async getCategoryById(id: string) {
    return await this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }
}
