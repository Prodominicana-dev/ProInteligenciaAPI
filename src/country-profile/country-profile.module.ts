import { Module } from '@nestjs/common';
import { CountryProfileController } from './country-profile.controller';
import { CountryProfileService } from './country-profile.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [CountryProfileController],
  providers: [CountryProfileService, PrismaService],
})
export class CountryProfileModule {}
