import { Module } from '@nestjs/common';
import { AlertaIEDService } from './alertaIED.service';
import { AlertaIEDController } from './alertaIED.controller';
import { MailModule } from 'src/mail/mail.module';
import { SuscriberModule } from 'src/suscriber/suscriber.module';
import { QueueModule } from 'src/queue/queue.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AlertaIEDService, PrismaService],
  controllers: [AlertaIEDController],
  imports: [MailModule, SuscriberModule, QueueModule],
})
export class AlertaIEDModule {}
