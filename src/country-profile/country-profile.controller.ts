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
import { CountryProfileService } from './country-profile.service';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdirp } from 'mkdirp';
const fs = require('fs');
const path = require('path');

@Controller('apiv2/country-profile')
export class CountryProfileController {
  constructor(private readonly countryProfileService: CountryProfileService) {}

  // Obtener todos los perfiles de países
  @Get()
  async findAll() {
    return this.countryProfileService.getAll();
  }

  // Obtener los perfiles activos
  @Get('active')
  async findActive() {
    return this.countryProfileService.getActive();
  }

  // Obtener los perfiles de una región
  @Get('region/:regionId')
  async findByRegion(@Param('regionId') regionId: number) {
    return this.countryProfileService.getCountryProfilesByRegion(regionId);
  }

  // Obtener perfil por id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.countryProfileService.getCountryProfileById(id);
  }

  // Crear perfil
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() data: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    try {
      const countryProfile =
        await this.countryProfileService.createCountryProfile(data);

      if (file === undefined) {
        return res.status(200).json({ message: countryProfile });
      }

      const folderPath = path.join(
        process.cwd(),
        `public/data/country-profile/pdf/${countryProfile.id}`,
      );
      await mkdirp(folderPath);

      const pdfName = `${file.originalname}`;
      await fs.promises.writeFile(path.join(folderPath, pdfName), file.buffer);

      const updated = await this.countryProfileService.updateCountryProfile(
        countryProfile.id,
        { pdf: pdfName },
      );

      return res.status(200).json({ message: updated });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }

  // Editar perfil
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
  ) {
    try {
      if (file === undefined) {
        const countryProfile =
          await this.countryProfileService.updateCountryProfile(id, data);
        return res.status(200).json({ message: countryProfile });
      }

      const folderPath = path.join(
        process.cwd(),
        `public/data/country-profile/pdf/${id}`,
      );

      // Se reemplaza el PDF anterior por el nuevo
      if (fs.existsSync(folderPath)) {
        await fs.promises.rm(folderPath, { recursive: true });
      }
      await mkdirp(folderPath);

      const pdfName = `${file.originalname}`;
      await fs.promises.writeFile(path.join(folderPath, pdfName), file.buffer);
      data.pdf = pdfName;

      const countryProfile =
        await this.countryProfileService.updateCountryProfile(id, data);

      return res.status(200).json({ message: countryProfile });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }

  // Borrar perfil
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const folderPath = path.join(
      process.cwd(),
      `public/data/country-profile/pdf/${id}`,
    );
    if (fs.existsSync(folderPath)) {
      await fs.promises.rm(folderPath, { recursive: true });
    }
    return this.countryProfileService.deleteCountryProfile(id);
  }
}
