import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, AlertaIED } from '@prisma/client';
import { paginator } from '@nodeteam/nestjs-prisma-pagination';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { SuscriberService } from 'src/suscriber/suscriber.service';
import { QueueService } from 'src/queue/queue.service';

const paginate: PaginatorTypes.PaginateFunction = paginator({
  page: 1,
  perPage: 8,
});

@Injectable()
export class AlertaIEDService {
  constructor(
    private prisma: PrismaService,
    private suscriberService: SuscriberService,
    private queueService: QueueService,
  ) {}
  async getActiveAlertaIED(): Promise<AlertaIED[]> {
    return this.prisma.alertaIED.findMany({
      where: {
        status: 'active',
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        category: true,
      },
    });
  }

  async getActivePaginatedAlertaIED({
    page,
    perPage,
    where,
    orderBy,
  }: {
    page?: number;
    perPage?: number;
    where?: Prisma.AlertaComercialWhereInput;
    orderBy?: Prisma.AlertaComercialOrderByWithRelationInput;
  }): Promise<PaginatorTypes.PaginatedResult<AlertaIED>> {
    return paginate(
      this.prisma.alertaIED,
      {
        where: {
          status: 'active',
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
  }): Promise<PaginatorTypes.PaginatedResult<AlertaIED>> {
    return paginate(
      this.prisma.alertaIED,
      {
        where: {
          status: 'active',
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

  async getAlertaIED(): Promise<AlertaIED[]> {
    return this.prisma.alertaIED.findMany({
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

  async getPaginatedAlertaIED({
    page,
    perPage,
    where,
    orderBy,
  }: {
    page?: number;
    perPage?: number;
    where?: Prisma.AlertaComercialWhereInput;
    orderBy?: Prisma.AlertaComercialOrderByWithRelationInput;
  }): Promise<PaginatorTypes.PaginatedResult<AlertaIED>> {
    return paginate(
      this.prisma.alertaIED,
      {
        orderBy: [
          {
            status: 'desc',
          },
          {
            id: 'asc',
          },
        ],
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

  async getAlertaIEDById(id: string): Promise<AlertaIED> {
    return this.prisma.alertaIED.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  }

  // Update AlertaComercial data
  async updateAlertaIED(
    id: string,
    data: Prisma.AlertaIEDUpdateInput,
  ): Promise<AlertaIED> {
    const alertaIED = await this.getAlertaIEDById(id);
    data.published = Boolean(data.published);
    if (!alertaIED.published && data.published) {
      await this.publishAlertaIED(id);
    }
    return this.prisma.alertaIED.update({
      where: {
        id: id,
      },
      data,
    });
  }

  async createAlertaComercial(
    data: Prisma.AlertaIEDCreateInput,
  ): Promise<AlertaIED> {
    data.published = Boolean(data.published);
    const alertacomercial = await this.prisma.alertaIED.create({
      data,
    });

    return alertacomercial;
  }

  async publishAlertaIED(id: string): Promise<any> {
    let alertaIEDCategories = [];
    const alertaIED = await this.getAlertaIEDById(id);
    alertaIEDCategories.push(alertaIED.categoryId);
    const suscribers =
      await this.suscriberService.getAllSuscribersEmailsByCategory(
        alertaIEDCategories,
      );
    const job = {
      alertaIED,
      subscribers: suscribers,
    };
    console.log(suscribers);

    //Usa el método addJob en lugar de llamar directamente a la cola.
    await this.queueService.alertaIEDJob(job);

    return this.prisma.alertaIED.update({
      where: {
        id,
      },
      data: {
        published: true,
      },
    });
  }

  async deleteDefinitiveAlertaIED(id: string): Promise<AlertaIED> {
    return this.prisma.alertaIED.delete({
      where: {
        id,
      },
    });
  }

  async enable(id: string): Promise<AlertaIED> {
    return this.prisma.alertaIED.update({
      where: {
        id,
      },
      data: {
        status: 'active',
      },
    });
  }

  async disable(id: string): Promise<AlertaIED> {
    return this.prisma.alertaIED.update({
      where: {
        id,
      },
      data: {
        status: 'inactive',
      },
    });
  }
}
