import { Module } from '@nestjs/common';
import { DatamarketService } from './datamarket.service';
import { DatamarketController } from './datamarket.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [DatamarketService, PrismaService],
  controllers: [DatamarketController]

})
export class DatamarketModule {}
