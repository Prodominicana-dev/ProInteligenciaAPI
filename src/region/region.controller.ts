import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { Response } from 'express';

@Controller('apiv2/')
export class RegionController {
  constructor(private regionService: RegionService) {}

  // Obtener todas las regiones
  @Get('regions')
  async getRegions() {
    return this.regionService.getRegions();
  }

  // Obtener las regiones activas
  @Get('regions/active')
  async getActiveRegions() {
    return this.regionService.getActiveRegions();
  }

  @Get('region/:id')
  async getRegionById(@Param('id') id: number) {
    return this.regionService.getRegionById(id);
  }

  @Post('region')
  async create(@Body() data, @Res() res: Response) {
    try {
      const region = await this.regionService.create(data);
      return res.status(201).send(region);
    } catch (error) {
      return res.status(500).send({ message: 'Error al crear la región' });
    }
  }

  @Patch('region/:id')
  async update(@Param('id') id: number, @Body() data, @Res() res: Response) {
    try {
      const region = await this.regionService.update(id, data);
      return res.status(200).send(region);
    } catch (error) {
      return res.status(500).send({ message: 'Error al editar la región' });
    }
  }

  @Delete('region/:id')
  async delete(@Param('id') id: number, @Res() res: Response) {
    try {
      const region = await this.regionService.delete(id);
      return res.status(200).send(region);
    } catch (error) {
      return res.status(500).send({ message: 'Error al eliminar la región' });
    }
  }
}
