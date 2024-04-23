import { Controller, Patch } from '@nestjs/common';
import { Get, Post, Res, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ReservedDomainsService } from './reserved-domains.service';
import { reservedDomains } from '@prisma/client';

@Controller('apiv2/reserved-domains')
export class ReservedDomainsController {
  constructor(private reservedDomainsService: ReservedDomainsService) {}

  @Get()
  async getAllReservedDomains() {
    return this.reservedDomainsService.getAllReservedDomains();
  }

  @Get('/all')
  async getAllDomains() {
    return this.reservedDomainsService.getAllDomains();
  }

  @Get(':id')
  async getReservedDomainsById(@Param('id') id: string) {
    return this.reservedDomainsService.getReservedDomainsById(id);
  }

  @Get('/platform/:platform')
  async getReservedDomainsByPlatform(@Param('platform') platform: string) {
    return this.reservedDomainsService.getReservedDomainsByPlatform(platform);
  }

  @Post()
  async createReservedDomains(@Body() data: any, @Res() res) {
   try {
    console.log(data)
    const reservedDomains = await this.reservedDomainsService.createReservedDomains(data);
    return res.status(201).json(reservedDomains);
   } catch (error) {
    return res.status(400).json({ message: error.message });
   }
  }

  @Patch(':id')
  async editReservedDomains(@Param('id') id: string, @Body() data: any, @Res() res) {
    try {
      const reservedDomains = await this.reservedDomainsService.editReservedDomains(id, data);
      return res.status(200).json(reservedDomains);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Delete(':id')
  async deleteReservedDomainsById(@Param('id') id: string, @Res() res) {
    try {
      const reservedDomains = await this.reservedDomainsService.deleteReservedDomainsById(id);
      return res.status(200).json(reservedDomains);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
