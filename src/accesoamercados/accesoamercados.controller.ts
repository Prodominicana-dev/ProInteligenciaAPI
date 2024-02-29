import { Controller } from '@nestjs/common';
import { AccesoaMercadosService } from './accesoamercados.service';
import { Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

@Controller('apiv2/accesoamercado')
export class AccesoaMercadosController {
  constructor(private accesoamercadoService: AccesoaMercadosService) {}

  @Get()
  async getAllaccesoaMercados() {
    return this.accesoamercadoService.getAllaccesoaMercados();
  }

  @Get('settings')
  async getAllSettingsaccesoaMercados() {
    return this.accesoamercadoService.getAllSettingsaccesoaMercados();
  }

  @Get('product/:productId/country/:countryId')
  async getaccesoaMercadosByProductIdAndCountryId(
    @Param('productId') productId: string,
    @Param('countryId') countryId: number,
  ) {
    return this.accesoamercadoService.getaccesoaMercadosByProductIdAndCountryId(
      productId,
      countryId,
    );
  }

  @Get(':id')
  async getaccesoaMercadosById(@Param('id') id: string) {
    return this.accesoamercadoService.getaccesoaMercadosById(id);
  }

  @Post()
  async createaccesoaMercados(@Body() data: any) {
    return this.accesoamercadoService.createaccesoaMercados(data);
  }

  @Put(':id')
  async editaccesoaMercados(@Param('id') id: string, @Body() data: any) {
    return this.accesoamercadoService.editaccesoaMercados(id, data);
  }

  @Delete(':id')
  async deleteAccesoaMercadoById(@Param('id') id: string) {
    return this.accesoamercadoService.deleteAccesoaMercadoById(id);
  }
}
