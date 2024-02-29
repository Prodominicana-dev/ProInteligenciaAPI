import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [LogController],
  providers: [LogService, PrismaService]
})
export class LogModule {}
