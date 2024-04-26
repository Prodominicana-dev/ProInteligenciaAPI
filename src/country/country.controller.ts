import { Controller, Get, Param, Post, Patch, Delete, Body, Res, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CountryService } from './country.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { rimraf } from 'rimraf';
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

@Controller('apiv2/')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Get('countries')
  async getCountry() {
    return this.countryService.getCountries();
  }

  @Get('country/:id')
  async getCountryById(@Param() id: number) {
    return this.countryService.getCountryById(id);
  }

  // Obtener país por abbreviation
  @Get('country/abbreviation/:abbreviation')
  async getCountryByAbbreviation(@Param('abbreviation') abbreviation: string, @Res() res: Response) {
    try {
      const country = await this.countryService.getCountryByAbbreviation(abbreviation);
      return res.status(200).send(country);
    } catch (error) {
      return res.status(404).send({ message: 'País no encontrado' });
    }
  }

  @Get('countries/select')
  async getCountriesLabelValue() {
    return this.countryService.getCountriesLabelValue();
  }

  @Post('country')
  @UseInterceptors(FilesInterceptor('image'))
  async create(@Body() data, @Res() res: Response,
  @UploadedFiles() files?){
try {
  const country = await this.countryService.create(data);
  return res.status(201).send(country);

  // if(files.length === 0) {
  // }
  // await files.forEach(async (file) => {
  //   const pathFolder = path.join(__dirname, '../../public/countries', country.id.toString());
  //   if (!fs.existsSync(pathFolder)) {
  //     fs.mkdirSync(pathFolder, { recursive: true });
  //   }
  //   const filename = `${country.id}.${mime.extension(file.mimetype)}`;
  //   const pathFile = path.join(pathFolder, filename);
  //   await fs.writeFileSync(pathFile, file.buffer);
  //   // Editar el country y colocar el filename
  //   await this.countryService.update(country.id, { image: filename });
  // })
  // return res.status(201).send(country);


} catch (error) {
  console.log(error)
  return res.status(500).send({ message: 'Error al crear el país' });
}

  }

  @Patch('country/:id')
  @UseInterceptors(FilesInterceptor('image'))
  async update(@Param('id') id, @Body() data, @Res() res: Response,
  @UploadedFiles() files?){
try {
  const country = await this.countryService.update(+id, data);
  return res.status(200).send(country);

  // if(files.length === 0) {
  // }
  // await files.forEach(async (file) => {
  //   const pathFolder = path.join(__dirname, '../../public/countries', country.id.toString());
  //   if (!fs.existsSync(pathFolder)) {
  //     fs.mkdirSync(pathFolder, { recursive: true });
  //   }
  //   const filename = `${country.id}.${mime.extension(file.mimetype)}`;
  //   const pathFile = path.join(pathFolder, filename);
  //   await fs.writeFileSync(pathFile, file.buffer);
  //   // Editar el country y colocar el filename
  //   await this.countryService.update(country.id, { image: filename });
  // })
  // return res.status(200).send(country);


} catch (error) {
  console.log(error)
  return res.status(500).send({ message: 'Error al crear el país' });
}

  }

  



}
