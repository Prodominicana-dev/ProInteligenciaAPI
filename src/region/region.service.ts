import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Region } from '@prisma/client';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  // Obtener todas las regiones ordenadas alfabéticamente
  async getRegions(): Promise<Region[]> {
    return this.prisma.region.findMany({
      orderBy: [{ name: 'asc' }],
    });
  }

  // Obtener solo las regiones activas
  async getActiveRegions(): Promise<Region[]> {
    return this.prisma.region.findMany({
      where: { status: 'active' },
      orderBy: [{ name: 'asc' }],
    });
  }

  async getRegionById(id: number): Promise<Region | null> {
    return this.prisma.region.findUnique({
      where: { id: +id },
    });
  }

  // Crear región
  async create(data: any) {
    try {
      return await this.prisma.region.create({ data });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  // Editar región
  async update(id: number, data: any) {
    try {
      return await this.prisma.region.update({
        where: { id: +id },
        data,
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  // Eliminar región
  async delete(id: number) {
    try {
      return await this.prisma.region.delete({
        where: { id: +id },
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
