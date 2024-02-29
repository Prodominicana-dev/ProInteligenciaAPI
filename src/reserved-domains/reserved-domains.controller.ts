import { Controller } from '@nestjs/common';
import { Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ReservedDomainsService } from './reserved-domains.service';
import { reservedDomains } from '@prisma/client';

@Controller('apiv2/reserved-domains')
export class ReservedDomainsController {
  constructor(private reservedDomainsService: ReservedDomainsService) {}

  @Get()
  async getAllReservedDomains() {
    return this.reservedDomainsService.getAllReservedDomains();
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
  async createReservedDomains(@Body() data: any) {
    return this.reservedDomainsService.createReservedDomains(data);
  }

  @Put(':id')
  async editReservedDomains(@Param('id') id: string, @Body() data: any) {
    return this.reservedDomainsService.editReservedDomains(id, data);
  }

  @Delete(':id')
  async deleteReservedDomainsById(@Param('id') id: string) {
    return this.reservedDomainsService.deleteReservedDomainsById(id);
  }
}
