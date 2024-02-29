import { Module } from '@nestjs/common';
import { SuscriberService } from './suscriber.service';
import { SuscriberController } from './suscriber.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailModule } from 'src/mail/mail.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  providers: [SuscriberService, PrismaService],
  controllers: [SuscriberController],
  exports: [SuscriberService],
  imports: [MailModule, CategoryModule],
})
export class SuscriberModule {}
