import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { Queue, QueueOptions, Worker, Job } from 'bullmq';
import { MailService } from 'src/mail/mail.service';
import IORedis from 'ioredis';

const connection = new IORedis({
  port: 6379,
  maxRetriesPerRequest: null,
});

// Crear constantes para la inyección de dependencias
export const EMAIL_QUEUE = 'EMAIL_QUEUE';
export const SIED_QUEUE = 'SIED_QUEUE';
export const EMAIL_QUEUE_OPTIONS = {
  connection,
  defaultJobOptions: { removeOnComplete: true },
};
export const EMAIL_WORKER = 'EMAIL_WORKER';

@Injectable()
export class QueueService implements OnModuleInit {
  constructor(
    @Inject(EMAIL_QUEUE) private emailQueue: Queue,
    @Inject(SIED_QUEUE) private alertaIEDQueue: Queue,
    private mailService: MailService,
  ) {}

  async onModuleInit(): Promise<void> {
    const sendEmail = async (job: Job) => {
      const { alertacomercial, subscribers } = job.data;
      for (const suscriber of subscribers) {
        console.log(suscriber)
        await this.mailService.newAlertaComercialMail(
          alertacomercial.title,
          alertacomercial.category.name,
          alertacomercial.description,
          `https://prointeligencia.prodominicana.gob.do/apiv2/data/alertacomercial/${alertacomercial.id}/img/${alertacomercial.image}`,
          suscriber.email,
        );
      }
    };

    const worker = new Worker('emails', sendEmail, EMAIL_QUEUE_OPTIONS);
    worker.on('completed', (job) => {
      console.log(`Job with id ${job.id} has been completed`);
    });

    const sendAlertaIEDEmail = async (job: Job) => {
      const { alertaIED, subscribers } = job.data;
      for (const suscriber of subscribers) {
        await this.mailService.newAlertaIEDMail(
          alertaIED.title,
          alertaIED.category.name,
          alertaIED.description,
          `https://sinim.prodominicana.gob.do/apiv2/data/alertaIED/${alertaIED.id}/img/${alertaIED.image}`,
          suscriber.email,
        );
      }
    };

    const alertaIEDWorker = new Worker(
      'alertaIED',
      sendAlertaIEDEmail,
      EMAIL_QUEUE_OPTIONS,
    );
    alertaIEDWorker.on('completed', (job) => {
      console.log(`Job with id ${job.id} has been completed`);
    });
  }

  async addJob(jobData: any): Promise<void> {
    // Usar el método add de la cola directamente
    await this.emailQueue.add('emails', jobData);
  }

  async alertaIEDJob(jobData: any): Promise<void> {
    // Usar el método add de la cola directamente
    await this.alertaIEDQueue.add('alertaIED', jobData);
  }
}
