import { Controller, Get, Post, Patch, Put, Body, Param } from '@nestjs/common';
import { SuscriberService } from './suscriber.service';

@Controller('apiv2/suscriber')
export class SuscriberController {
  constructor(private readonly suscriberService: SuscriberService) {}

  @Post()
  async createSuscriber(@Body() data) {
    return await this.suscriberService.createSubscriber(data);
  }

  @Get(':email/:platform')
  async getSuscriberByEmailAndPlatform(
    @Param('email') email: string,
    @Param('platform') platform: string,
  ) {
    return await this.suscriberService.getSuscriberByEmailAndPlatform(
      email,
      platform,
    );
  }

  // Update suscriber by email and platform
  @Patch('/alertacomercial')
  async updateSuscriberAlertacomercial(@Body() data) {
    return await this.suscriberService.updateAlertacomercialSubscriber(data);
  }

  @Patch('/alertaIED')
  async updateSuscriberAlertaIED(@Body() data) {
    return await this.suscriberService.updateAlertaIEDSubscriber(data);
  }

  @Get(':email')
  async getSuscriberByEmail(@Param('email') email: string) {
    return await this.suscriberService.getSubscriberByEmail(email);
  }

  @Get()
  async getAllSuscribers() {
    return await this.suscriberService.getAllSuscribers();
  }
}
