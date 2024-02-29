import {
  Controller,
  Get,
  Param,
  Res,
  Post,
  Body,
  Put,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  Delete,
  Patch,
} from '@nestjs/common';

import { mkdirp } from 'mkdirp';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as mime from 'mime-types';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlertaIEDService } from './alertaIED.service';

const fs = require('fs');
const path = require('path');
const imageBase64 = require('image-base64');

@Controller('apiv2/alertaIED')
export class AlertaIEDController {
  constructor(
    private readonly alertaIEDService: AlertaIEDService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async getActiveAlertaIED() {
    return this.alertaIEDService.getActiveAlertaIED();
  }

  @Get('page/:id')
  async getActivePaginatedAlertaIED(@Param('id') page: number) {
    return this.alertaIEDService.getActivePaginatedAlertaIED({ page });
  }

  @Get('page/public/:id')
  async getPublicPaginated(@Param('id') page: number) {
    return this.alertaIEDService.getPublicPaginated({ page });
  }

  @Get('all')
  async getAlertaIED() {
    return this.alertaIEDService.getAlertaIED();
  }

  @Get('page/all/:id')
  async getPaginatedAlertaIED(@Param('id') page: number) {
    return this.alertaIEDService.getPaginatedAlertaIED({ page });
  }

  @Get(':id')
  async getAlertaIEDById(@Param('id') id: string) {
    return this.alertaIEDService.getAlertaIEDById(id);
  }

  // Update AlertaIED
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateAlertaIED(
    @Param('id') id: string,
    @Body() data,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    data.categoryId = Number(data.categoryId);
    data.published = Boolean(data.published);
    data.isPublic = data.isPublic === 'true';

    if (file === undefined) {
      const alertaIED = await this.alertaIEDService.updateAlertaIED(id, data);
      if (res.statusCode === 500) {
        return res.status(500).json({ message: 'Error' });
      }
      return res.status(200).json({ message: alertaIED });
    }

    const folderPath = path.join(
      process.cwd(),
      `public/data/alertaIED/images/${id}`,
    );
    if (fs.existsSync(folderPath)) {
      await fs.promises.rm(folderPath, { recursive: true }); // Utilizar fs.promises.rmdir para eliminar el directorio de forma asincrónica
    }
    await mkdirp(folderPath);
    const imageName = `${new Date().getTime()}.${file.originalname
      .split('.')
      .pop()}`;
    fs.writeFile(path.join(folderPath, imageName), file.buffer, async (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      data.image = imageName;
      await this.alertaIEDService.updateAlertaIED(id, data);
      res.status(200).json({ message: data });
    });
  }

  // Create AlertaComercial
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createAlertaIED(
    @Body() data,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    data.categoryId = Number(data.categoryId);
    data.published = Boolean(data.published);
    data.isPublic = data.isPublic === 'true';
    // Crear el AlertaComercial
    const alertacomercial =
      await this.alertaIEDService.createAlertaComercial(data);

    const folderPath = path.join(
      process.cwd(),
      `public/data/alertaIED/images/${alertacomercial.id}`,
    );
    await mkdirp(folderPath);
    const imageName = `${new Date().getTime()}.${file.originalname
      .split('.')
      .pop()}`;
    fs.writeFile(path.join(folderPath, imageName), file.buffer, async (err) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        alertacomercial.image = imageName;
        this.alertaIEDService.updateAlertaIED(
          alertacomercial.id,
          alertacomercial,
        );
        if (alertacomercial.published) {
          await this.alertaIEDService.publishAlertaIED(alertacomercial.id);
        }
        res.status(200).json({ message: alertacomercial });
      }
    });
  }

  // Delete definitive AlertaComercial
  @Delete('d/:id')
  async deleteDefinitiveAlertaIED(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    // Borrar la carpeta con las fotos del alertacomercial y luego borrarlo de la base de datos
    const folderPath = path.join(
      process.cwd(),
      `public/data/alertaIED/images/${id}`,
    );
    if (fs.existsSync(folderPath)) {
      await fs.promises.rm(folderPath, { recursive: true }); // Utilizar fs.promises.rmdir para eliminar el directorio de forma asincrónica
    }
    const alertaIED = await this.alertaIEDService.deleteDefinitiveAlertaIED(id);
    if (!alertaIED) {
      return res.status(404).json({ message: 'No encontrado' });
    }
    return res.status(200).json({ message: alertaIED });
  }

  // Publish AlertaComercial
  @Patch('publish/:id')
  async publishAlertaIED(@Param('id') id: string, @Res() res: Response) {
    const published = await this.alertaIEDService.publishAlertaIED(id);
    if (!published) {
      return res
        .status(500)
        .json({ message: 'Error al publicar el AlertaComercial' });
    }
    return res.status(200).json({ message: published });
  }

  @Patch('enable/:id')
  async enable(@Param('id') id: string, @Res() res: Response) {
    const enabled = await this.alertaIEDService.enable(id);
    if (!enabled) {
      return res
        .status(500)
        .json({ message: 'Error al activar el AlertaComercial' });
    }
    return res.status(200).json({ message: enabled });
  }

  @Patch('disable/:id')
  async disable(@Param('id') id: string, @Res() res: Response) {
    const disabled = await this.alertaIEDService.disable(id);
    if (!disabled) {
      return res
        .status(500)
        .json({ message: 'Error al desactivar el AlertaComercial' });
    }
    return res.status(200).json({ message: disabled });
  }

  // Get all alertacomerciales but in a group by
  @Get('t/1')
  async getAlertaComercialTest() {
    return await this.prisma.alertaComercial.groupBy({
      by: ['platform'],
      _count: {
        platform: true,
      },
    });
  }
}
