import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailController } from './mail.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: 'alertaelectronica@prodominicana.gob.do',
          pass: `#czU/1HHY~<Gr@\\x02u-K-C/K(U`,
        },
      },
      defaults: {
        from: '"SINIM - NoReply" <alertaelectronica@prodominicana.gob.do>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController], // 👈 export for DI
})
export class MailModule {}
