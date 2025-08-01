import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { accesoaMercadosModule } from './accesoamercados/accesoamercados.module';
import { ReservedDomainsModule } from './reserved-domains/reserved-domains.module';
import { DatamarketModule } from './datamarket/datamarket.module';
import { CountryModule } from './country/country.module';
import { ProductModule } from './product/product.module';
import { AlertacomercialController } from './alertacomercial/alertacomercial.controller';
import { AlertacomercialModule } from './alertacomercial/alertacomercial.module';
import { DataModule } from './data/data.module';
import { MailModule } from './mail/mail.module';
import { SuscriberModule } from './suscriber/suscriber.module';
import { QueueModule } from './queue/queue.module';
import { AlertaIEDModule } from './alertaIED/alertaIED.module';
import { CategoryModule } from './category/category.module';
import { PartnerModule } from './partner/partner.module';
import { PostModule } from './post/post.module';
import { LogModule } from './log/log.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService],
  imports: [
    accesoaMercadosModule,
    DatamarketModule,
    ReservedDomainsModule,
    CountryModule,
    ProductModule,
    AlertacomercialModule,
    DataModule,
    MailModule,
    SuscriberModule,
    QueueModule,
    AlertaIEDModule,
    CategoryModule,
    PartnerModule,
    PostModule,
    LogModule,
    ChatbotModule,
  ],
})
export class AppModule {}
