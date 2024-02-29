import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // Get all products.
  async getActiveProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        status: 'active',
      },
    });
  }

  async getProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({
      orderBy: [
        {
          status: 'desc',
        },
        {
          id: 'asc',
        },
      ],
    });
  }

  // Get product by id
  async findOne(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // Get products with label and value
  async getProductsLabelValue(): Promise<any[]> {
    const products = await this.prisma.product.findMany({
      where: {
        status: 'active',
      },
    });

    const productsLabelValue = products.map((product) => {
      return { label: `${product.name} - ${product.code}`, value: product };
    });

    return productsLabelValue;
  }

  // Create product
  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  // Edit product
  async edit(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  // Delete product
  async deactivate(id: string): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        status: 'inactive',
      },
    });
  }

  // Activate product
  async activate(id: string): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        status: 'active',
      },
    });
  }
}
