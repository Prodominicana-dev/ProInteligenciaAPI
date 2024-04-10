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
import { AlertacomercialService } from './alertacomercial.service';
import { mkdirp } from 'mkdirp';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from 'src/prisma/prisma.service';

const fs = require('fs');
const path = require('path');
const imageBase64 = require('image-base64');

@Controller('apiv2/alertacomercial')
export class AlertacomercialController {
  constructor(
    private readonly alertacomercialService: AlertacomercialService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async getActiveAlertaComercial() {
    return this.alertacomercialService.getActiveAlertaComercialAlertaComercial();
  }

  @Get('page/public/:id')
  async getActivePaginatedPublicAlertacomercial(@Param('id') page: number) {
    return this.alertacomercialService.getPublicPaginated({ page });
  }

  @Get('page/:id')
  async getActivePaginatedAlertacomercial(@Param('id') page: number) {
    return this.alertacomercialService.getActivePaginatedAlertacomercial({
      page,
    });
  }

  @Get('all')
  async getAlertaComercial() {
    return this.alertacomercialService.getAlertaComercial();
  }

  @Get('page/all/:id')
  async getPaginatedAlertacomercial(@Param('id') page: number) {
    return this.alertacomercialService.getPaginatedAlertacomercial({ page });
  }

  @Get(':id')
  async getAlertaComercialById(@Param('id') id: string) {
    return this.alertacomercialService.getAlertaComercialById(id);
  }

  // Update SaIM
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updateAlertaComercial(
    @Param('id') id: string,
    @Body() data,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    // Convertir data.products y data.countries a JSON
    data.products = JSON.parse(data.products);
    data.countries = JSON.parse(data.countries);
    data.isPublic = data.isPublic === 'true';
    if (file === undefined) {
      const alertacomercial =
        await this.alertacomercialService.updateAlertaComercial(id, data);
      if (res.statusCode === 500) {
        return res.status(500).json({ message: 'Error' });
      }
      return res.status(200).json({ message: alertacomercial });
    }

    const folderPath = path.join(
      process.cwd(),
      `public/data/alertacomercial/images/${id}`,
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
      await this.alertacomercialService.updateAlertaComercial(id, data);
      res.status(200).json({ message: data });
    });
  }

  // Create AlertaComercial
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createAlertaComercial(
    @Body() data,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    try {
      // Convertir data.products y data.countries a JSON
      data.products = JSON.parse(data.products);
      data.countries = JSON.parse(data.countries);
      data.isPublic = data.isPublic === 'true';
      data.platform = 'alertacomercial';
      // Crear el AlertaComercial
      const alertacomercial =
        await this.alertacomercialService.createAlertaComercial(data);
      const folderPath = path.join(
        process.cwd(),
        `public/data/alertacomercial/images/${alertacomercial.id}`,
      );
      await mkdirp(folderPath);
      const imageName = `${new Date().getTime()}.${file.originalname
        .split('.')
        .pop()}`;
      fs.writeFile(
        path.join(folderPath, imageName),
        file.buffer,
        async (err) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            alertacomercial.image = imageName;
            this.alertacomercialService.updateAlertaComercial(
              alertacomercial.id,
              alertacomercial,
            );
            if (alertacomercial.published) {
              await this.alertacomercialService.publishAlertacomercial(
                alertacomercial.id,
              );
            }
            res.status(200).json({ message: alertacomercial });
          }
        },
      );
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // Delete definitive AlertaComercial
  @Delete('d/:id')
  async deleteDefinitiveAlertacomercial(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    // Borrar la carpeta con las fotos del alertacomercial y luego borrarlo de la base de datos
    const folderPath = path.join(
      process.cwd(),
      `public/data/alertacomercial/images/${id}`,
    );
    if (fs.existsSync(folderPath)) {
      await fs.promises.rm(folderPath, { recursive: true }); // Utilizar fs.promises.rmdir para eliminar el directorio de forma asincrónica
    }
    const alertacomercial =
      await this.alertacomercialService.deleteDefinitiveAlertaComercial(id);
    if (alertacomercial) {
      return res.status(200).json({ message: 'AlertaComercial eliminado' });
    }
    return res.status(500).json({ message: alertacomercial });
  }

  // Publish AlertaComercial
  @Patch('publish/:id')
  async publishAlertacomercial(@Param('id') id: string, @Res() res: Response) {
    const publish =
      await this.alertacomercialService.publishAlertacomercial(id);
    if (!publish) {
      return res
        .status(500)
        .json({ message: 'Error al publicar el AlertaComercial' });
    }
    return res.status(200).json({ message: publish });
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

  @Patch('enable/:id')
  async enable(@Param('id') id: string, @Res() res: Response) {
    const enable = await this.alertacomercialService.enable(id);
    if (!enable) {
      return res
        .status(500)
        .json({ message: 'Error al habilitar el AlertaComercial' });
    }
    return res.status(200).json({ message: enable });
  }

  @Patch('disable/:id')
  async disable(@Param('id') id: string, @Res() res: Response) {
    const disable = await this.alertacomercialService.disable(id);
    if (!disable) {
      return res
        .status(500)
        .json({ message: 'Error al deshabilitar el AlertaComercial' });
    }
    return res.status(200).json({ message: disable });
  }
}
