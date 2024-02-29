import { Module } from '@nestjs/common';
import { AlertacomercialService } from './alertacomercial.service';
import { AlertacomercialController } from './alertacomercial.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailModule } from 'src/mail/mail.module';
import { SuscriberModule } from 'src/suscriber/suscriber.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  providers: [AlertacomercialService, PrismaService],
  controllers: [AlertacomercialController],
  exports: [AlertacomercialService],
  imports: [MailModule, SuscriberModule, QueueModule],
})
export class AlertacomercialModule {}
