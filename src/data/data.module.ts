import { Module } from '@nestjs/common';
import { DataController } from './data.controller';
import { AlertacomercialModule } from 'src/alertacomercial/alertacomercial.module';

@Module({
  controllers: [DataController],
  providers: [],
  imports: [AlertacomercialModule],
})
export class DataModule {}
