import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PartnerController],
  providers: [PartnerService, PrismaService]
})
export class PartnerModule {}
