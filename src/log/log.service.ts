import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Log, Prisma } from '@prisma/client';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  // Crear un nuevo registro de log
  async createLog(data: Prisma.LogCreateInput): Promise<Log> {
    return this.prisma.log.create({
      data,
    });
  }

  // Obtener todos los registros de log
  async findAll(): Promise<Log[]> {
    return this.prisma.log.findMany();
  }

  // Obtener un registro de log por id
  async findOne(id: string): Promise<Log> {
    return this.prisma.log.findUnique({
      where: {
        id,
      },
    });
  }
}
