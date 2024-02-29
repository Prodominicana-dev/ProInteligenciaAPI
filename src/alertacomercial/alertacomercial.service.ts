import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, AlertaComercial } from '@prisma/client';
import { paginator } from '@nodeteam/nestjs-prisma-pagination';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { SuscriberService } from 'src/suscriber/suscriber.service';
import { QueueService } from 'src/queue/queue.service';

const paginate: PaginatorTypes.PaginateFunction = paginator({
  page: 1,
  perPage: 8,
});

@Injectable()
export class AlertacomercialService {
  constructor(
    private prisma: PrismaService,
    private suscriberService: SuscriberService,
    private queueService: QueueService,
  ) {}

  async getActiveAlertaComercialAlertaComercial(): Promise<AlertaComercial[]> {
    return this.prisma.alertaComercial.findMany({
      where: {
        status: 'active',
        platform: 'alertacomercial',
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  async getActivePaginatedAlertacomercial({
    page,
    perPage,
    where,
    orderBy,
  }: {
    page?: number;
    perPage?: number;
    where?: Prisma.AlertaComercialWhereInput;
    orderBy?: Prisma.AlertaComercialOrderByWithRelationInput;
  }): Promise<PaginatorTypes.PaginatedResult<AlertaComercial>> {
    return paginate(
      this.prisma.alertaComercial,
      {
        where: {
          status: 'active',
          platform: 'alertacomercial',
        },
        orderBy: {
          date: 'desc',
        },
        include: {
          category: true,
        },
      },
      {
        page,
        perPage: 8,
      },
    );
  }

  async getPublicPaginated({
    page,
    perPage,
    where,
    orderBy,
  }: {
    page?: number;
    perPage?: number;
    where?: Prisma.AlertaComercialWhereInput;
    orderBy?: Prisma.AlertaComercialOrderByWithRelationInput;
  }): Promise<PaginatorTypes.PaginatedResult<AlertaComercial>> {
    return paginate(
      this.prisma.alertaComercial,
      {
        where: {
          status: 'active',
          platform: 'alertacomercial',
          isPublic: true,
        },
        orderBy: {
          date: 'desc',
        },
        include: {
          category: true,
        },
      },
      {
        page,
        perPage: 8,
      },
    );
  }

  async getAlertaComercial(): Promise<AlertaComercial[]> {
    return this.prisma.alertaComercial.findMany({
      where: {
        platform: 'alertacomercial',
      },
      orderBy: [
        {
          status: 'desc',
        },
        {
          id: 'desc',
        },
      ],
      include: {
        category: true,
      },
    });
  }

  async getPaginatedAlertacomercial({
    page,
    perPage,
    where,
    orderBy,
  }: {
    page?: number;
    perPage?: number;
    where?: Prisma.AlertaComercialWhereInput;
    orderBy?: Prisma.AlertaComercialOrderByWithRelationInput;
  }): Promise<PaginatorTypes.PaginatedResult<AlertaComercial>> {
    return paginate(
      this.prisma.alertaComercial,
      {
        orderBy: [
          {
            status: 'desc',
          },
          {
            id: 'desc',
          },
        ],
        where: {
          platform: 'alertacomercial',
        },
        include: {
          category: true,
        },
      },
      {
        page,
        perPage: 8,
      },
    );
  }

  async getAlertaComercialById(id: string): Promise<AlertaComercial> {
    return this.prisma.alertaComercial.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  }

  // Update AlertaComercial data
  async updateAlertaComercial(
    id: string,
    data: Prisma.AlertaComercialUpdateInput,
  ): Promise<AlertaComercial> {
    const alertacomercial = await this.getAlertaComercialById(id);
    data.published = Boolean(data.published);
    if (!alertacomercial.published && data.published) {
      await this.publishAlertacomercial(id);
    }
    return this.prisma.alertaComercial.update({
      where: {
        id,
      },
      data,
    });
  }

  async createAlertaComercial(
    data: Prisma.AlertaComercialCreateInput,
  ): Promise<AlertaComercial> {
    data.published = Boolean(data.published);
    const alertacomercial = await this.prisma.alertaComercial.create({
      data,
    });

    return alertacomercial;
  }

  async publishAlertacomercial(id: string): Promise<any> {
    const alertacomercial = await this.getAlertaComercialById(id);
    const products = alertacomercial.products.map((p: any) => p.id);
    console.log(alertacomercial);
    const countries = alertacomercial.countries.map((c: any) => c.id);
    console.log(countries);
    const suscribers =
      await this.suscriberService.getAllSuscribersEmailsByProductsOrCountries(
        products,
        countries,
      );
    const job = {
      alertacomercial,
      subscribers: suscribers,
    };
    // Usa el método addJob en lugar de llamar directamente a la cola.
    await this.queueService.addJob(job);

    return this.prisma.alertaComercial.update({
      where: {
        id,
      },
      data: {
        published: true,
      },
    });
  }

  async enable(id: string): Promise<AlertaComercial> {
    return this.prisma.alertaComercial.update({
      where: {
        id,
      },
      data: {
        status: 'active',
      },
    });
  }

  async disable(id: string): Promise<AlertaComercial> {
    return this.prisma.alertaComercial.update({
      where: {
        id,
      },
      data: {
        status: 'inactive',
      },
    });
  }

  async deleteDefinitiveAlertaComercial(id: string): Promise<AlertaComercial> {
    return this.prisma.alertaComercial.delete({
      where: {
        id,
      },
    });
  }

  async getTest(): Promise<any> {
    return await this.prisma.alertaComercial.groupBy({
      by: ['platform'],
      _count: {
        platform: true,
      },
    });
  }
}
