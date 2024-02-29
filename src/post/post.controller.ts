import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdirp } from 'mkdirp';
const fs = require('fs');
const path = require('path');
const { Poppler } = require('node-poppler');
const poppler = new Poppler(process.env.POPPLER_PATH);

@Controller('apiv2/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // Obtener todos los posts
  @Get()
  async findAll() {
    return this.postService.getAll();
  }

  // Obtener post por id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  // Obtener posts por idioma
  @Get('language/:language')
  async findByType(@Param('language') language: string) {
    return this.postService.getPostsByLanguage(language);
  }

  // Editar post
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    if (file === undefined) {
      const post = await this.postService.updatePost(id, data);
      if (res.statusCode === 500) {
        return res.status(500).json({ message: 'Error' });
      }
      return res.status(200).json({ message: post });
    }
    const folderPath = path.join(process.cwd(), `public/data/post/pdf/${id}`);
    const imagePath = path.join(process.cwd(), `public/data/post/images/${id}`);
    try {
      if (fs.existsSync(folderPath)) {
        await fs.promises.rm(folderPath, { recursive: true });
      }
      if (fs.existsSync(imagePath)) {
        await fs.promises.rm(imagePath, { recursive: true });
      }
      await mkdirp(folderPath);
      await mkdirp(imagePath);
      const options = {
        firstPageToConvert: 1,
        lastPageToConvert: 1,
        pngFile: true,
      };

      const pdfPath = path.join(folderPath, file.originalname);
      await fs.promises.writeFile(pdfPath, file.buffer);

      data.pdf = file.originalname;

      const firstPageName = `${imagePath}/${file.originalname.split('.')[0]}`;
      await poppler.pdfToCairo(
        `${folderPath}/${data.pdf}`,
        firstPageName,
        options,
      );
      await this.postService.updatePost(id, data);

      res.status(200).json({ message: data });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  // Borrar post
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const folderPath = path.join(process.cwd(), `public/data/post/pdf/${id}`);
    if (fs.existsSync(folderPath)) {
      await fs.promises.rm(folderPath, { recursive: true }); // Utilizar fs.promises.rmdir para eliminar el directorio de forma asincrónica
    }
    return this.postService.deletePost(id);
  }

  // Crear post
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() data: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    const post = await this.postService.createPost(data);
    const folderPath = path.join(
      process.cwd(),
      `public/data/post/pdf/${post.id}`,
    );
    const imagePath = path.join(
      process.cwd(),
      `public/data/post/images/${post.id}`,
    );
    await mkdirp(folderPath);
    await mkdirp(imagePath);
    const pdfName = `${file.originalname}`;

    fs.writeFile(path.join(folderPath, pdfName), file.buffer, async (err) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        const options = {
          firstPageToConvert: 1,
          lastPageToConvert: 1,
          pngFile: true,
        };
        post.pdf = pdfName;
        const firstPageName = `${imagePath}/${file.originalname.split('.')[0]}`;
        await poppler.pdfToCairo(
          `${folderPath}/${pdfName}`,
          firstPageName,
          options,
        );
        this.postService.updatePost(post.id, post).then((post) => {
          if (res.statusCode === 500) {
            return res.status(500).json({ message: 'Error' });
          }
          return res.status(200).json({ message: post });
        });
      }
    });
  }
}
