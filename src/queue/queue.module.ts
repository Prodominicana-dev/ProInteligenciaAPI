import { Module } from '@nestjs/common';
import {
  EMAIL_QUEUE,
  EMAIL_QUEUE_OPTIONS,
  QueueService,
  SIED_QUEUE,
} from './queue.service';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { Queue } from 'bullmq';

@Module({
  providers: [
    QueueService,
    MailService,
    {
      provide: EMAIL_QUEUE,
      useValue: new Queue('emails', EMAIL_QUEUE_OPTIONS),
    },
    {
      provide: SIED_QUEUE,
      useValue: new Queue('alertaIED', EMAIL_QUEUE_OPTIONS),
    },
  ],
  exports: [QueueService],
  imports: [MailModule],
})
export class QueueModule {}
