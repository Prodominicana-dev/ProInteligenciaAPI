import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async alertaComercialMail(title, email, name, products, countries) {
    await this.mailerService.sendMail({
      to: email,
      subject: `SINIM - ${title}`,
      template: './suscription',
      context: {
        name,
        products,
        countries,
      },
    });
  }

  async alertaComercialNotifyMail(title, email, name, products, countries) {
    await this.mailerService.sendMail({
      to: email,
      subject: `SINIM - ${title}`,
      template: './suscriptionAlert',
      context: {
        name,
        products,
        countries,
      },
    });
  }

  async alertaIEDMail(title, email, name, categories) {
    await this.mailerService.sendMail({
      to: email,
      subject: `SINIM - ${title}`,
      template: './subscriptionAlertaIED',
      context: {
        name,
        categories,
      },
    });
  }

  async alertaIEDNotifyMail(title, email, name, categories) {
    await this.mailerService.sendMail({
      to: email,
      subject: `SINIM - ${title}`,
      template: './subscriptionAlertaIEDAlert',
      context: {
        name,
        categories,
      },
    });
  }

  async newAlertaComercialMail(title, type, description, image, email) {
    await this.mailerService.sendMail({
      to: email,
      subject: `SINIM - Nueva alerta comercial`,
      template: './alertacomercial',
      context: {
        title,
        type,
        description,
        imageUrl: image,
      },
    });
  }

  async newAlertaIEDMail(title, type, description, image, email) {
    await this.mailerService.sendMail({
      to: email,
      subject: `SINIM - Nueva alerta de IED`,
      template: './alertaIED',
      context: {
        title,
        type,
        description,
        imageUrl: image,
      },
    });
  }
}
