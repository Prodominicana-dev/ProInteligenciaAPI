import { Module } from '@nestjs/common';
import { AccesoaMercadosService } from './accesoamercados.service';
import { AccesoaMercadosController } from './accesoamercados.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CountryModule } from 'src/country/country.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  providers: [AccesoaMercadosService, PrismaService],
  controllers: [AccesoaMercadosController],
  imports: [CountryModule, ProductModule],
})
export class accesoaMercadosModule {}
