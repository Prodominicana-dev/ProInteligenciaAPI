import {
  Controller,
  Get,
  Param,
  Res,
  Post,
  Body,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AlertacomercialService } from 'src/alertacomercial/alertacomercial.service';
import { mkdirp } from 'mkdirp';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as mime from 'mime-types';

const fs = require('fs');
const path = require('path');
const imageBase64 = require('image-base64');
@Controller('apiv2/data')
export class DataController {
  constructor(
    private readonly alertacomercialService: AlertacomercialService,
  ) {}

  /*
   *   Obtener las imagenes de los AlertaComercial por su id y nombre de imagen.
   */
  @Get('alertacomercial/:id/img/:imageName')
  getImage(
    @Param('id') id: string,
    @Param('imageName') imageName: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    res.set({ 'Content-Type': 'image/jpeg' });
    const imagePath = path.join(
      process.cwd(),
      `public/data/alertacomercial/images/${id}`,
      imageName,
    );
    //   const mimeType = mime.lookup(imageName);
    //   if (!mimeType) {
    //     return undefined;
    //   }
    const fileStream = fs.createReadStream(imagePath);
    const streamableFile = new StreamableFile(fileStream);
    //   streamableFile.options.type = mimeType
    return streamableFile;
  }

  @Get('alertaIED/:id/img/:imageName')
  getAlertaIEDImage(
    @Param('id') id: string,
    @Param('imageName') imageName: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    res.set({ 'Content-Type': 'image/jpeg' });
    const imagePath = path.join(
      process.cwd(),
      `public/data/alertaIED/images/${id}`,
      imageName,
    );
    //   const mimeType = mime.lookup(imageName);
    //   if (!mimeType) {
    //     return undefined;
    //   }
    const fileStream = fs.createReadStream(imagePath);
    const streamableFile = new StreamableFile(fileStream);
    //   streamableFile.options.type = mimeType
    return streamableFile;
  }

  @Get('partner/:id/img/:imageName')
  getPartnerImage(
    @Param('id') id: string,
    @Param('imageName') imageName: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    res.set({ 'Content-Type': 'image/jpeg' });
    const imagePath = path.join(
      process.cwd(),
      `public/data/partner/images/${id}`,
      imageName,
    );
    const fileStream = fs.createReadStream(imagePath);
    const streamableFile = new StreamableFile(fileStream);
    //   streamableFile.options.type = mimeType
    return streamableFile;
  }

  @Get('post/:id')
  async getPostImage(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    res.set({ 'Content-Type': 'image/jpeg' });
    const imagePath = path.join(process.cwd(), `public/data/post/images/${id}`);

    return new Promise((resolve, reject) => {
      fs.readdir(imagePath, (err, files) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          const fileStreams = files.map((file) => {
            const fileStream = fs.createReadStream(path.join(imagePath, file));
            return new StreamableFile(fileStream);
          });
          resolve(fileStreams[0]); // En este ejemplo, retornamos solo el primer archivo encontrado
        }
      });
    });
  }

  @Get('post/:id/pdf/:pdfName')
  getPostPdf(
    @Param('id') id: string,
    @Param('pdfName') pdfName: string,
    @Res({ passthrough: true }) res: Response,
  ): StreamableFile {
    res.set({ 'Content-Type': 'application/pdf' });
    const pdfPath = path.join(
      process.cwd(),
      `public/data/post/pdf/${id}`,
      pdfName,
    );
    const fileStream = fs.createReadStream(pdfPath);
    const streamableFile = new StreamableFile(fileStream);
    return streamableFile;
  }

  /*
   *   Subir imagenes de los AlertaComercial por su id.
   */
  @Post('alertacomercial/:id/img')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Res() res,
  ) {
    const alertacomercial =
      await this.alertacomercialService.getAlertaComercialById(id);
    const folderPath = path.join(
      process.cwd(),
      `public/data/alertacomercial/images/${id}`,
    );
    await mkdirp(folderPath);
    const imageName = `${new Date().getTime()}.${file.originalname
      .split('.')
      .pop()}`;
    fs.writeFile(path.join(folderPath, imageName), file.buffer, (err) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        alertacomercial.image = imageName;
        this.alertacomercialService.updateAlertaComercial(
          alertacomercial.id,
          alertacomercial,
        );
        res.status(200).json({ message: alertacomercial });
      }
    });
  }

  @Get('newImages')
  async setNewAlertaComercialages(@Res() res): Promise<void> {
    const alertacomercial =
      await this.alertacomercialService.getAlertaComercial();
    for await (const s of alertacomercial) {
      const alertacomercialImg64 = await imageBase64.local(
        path.join(process.cwd(), '/public/data/images', s.image),
      );
      const base64Data = alertacomercialImg64.replace(
        /^data:image\/([\w+/]+);base64,/,
        '',
      );
      const fileExtension = alertacomercialImg64.substring(
        'data:image/'.length,
        alertacomercialImg64.indexOf(';base64'),
      );
      const imageName = `${new Date().getTime()}.${fileExtension}`;

      const folderPath = path.join(
        process.cwd(),
        `public/data/alertacomercial/images/${s.id}`,
      );
      await mkdirp(folderPath);

      await fs.writeFile(
        path.join(folderPath, imageName),
        base64Data,
        'base64',
        (err) => {
          if (err) {
            res.status(500).json({ error: err });
          }
          const _alertacomercial = {
            description: s.description,
            title: s.title,
            categoryId: s.categoryId,
            date: s.date,
            oldID: s.oldID,
            products: s.products,
            countries: s.countries,
            status: s.status,
            published: s.published,
            platform: s.platform,
            image: imageName,
          };
          this.alertacomercialService.updateAlertaComercial(
            s.id,
            _alertacomercial,
          );
        },
      );
    }
    res.status(200).json({ message: 'ok' });
  }

  @Get('deleteImages')
  async deleteAllImages(@Res() res): Promise<void> {
    const folderPathAlertacomercial = path.join(
      process.cwd(),
      `public/data/alertacomercial`,
    );
    if (fs.existsSync(folderPathAlertacomercial)) {
      await fs.promises.rm(folderPathAlertacomercial, { recursive: true }); // Utilizar fs.promises.rmdir para eliminar el directorio de forma asincrónica
    }

    const folderPathAlertaIED = path.join(
      process.cwd(),
      `public/data/alertaIED`,
    );
    if (fs.existsSync(folderPathAlertaIED)) {
      await fs.promises.rm(folderPathAlertaIED, { recursive: true }); // Utilizar fs.promises.rmdir para eliminar el directorio de forma asincrónica
    }

    return res.status(200).json({ message: 'ok' });
  }
}
