import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CountryController],
  providers: [CountryService, PrismaService],
  exports: [CountryService],
})
export class CountryModule {}
