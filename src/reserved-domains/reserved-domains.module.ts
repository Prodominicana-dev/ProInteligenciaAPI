import { Module } from '@nestjs/common';
import { ReservedDomainsController } from './reserved-domains.controller';
import { ReservedDomainsService } from './reserved-domains.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ReservedDomainsController],
  providers: [ReservedDomainsService, PrismaService],
})
export class ReservedDomainsModule {}
