import { Controller, Get, Post, Patch, Put, Body, Param, Res } from '@nestjs/common';
import { SuscriberService } from './suscriber.service';

@Controller('apiv2/suscriber')
export class SuscriberController {
  constructor(private readonly suscriberService: SuscriberService) {}

  @Post()
  async createSuscriber(@Body() data, @Res() res) {
    try {
      const sub = await this.suscriberService.createSubscriber(data);
    return res.status(201).send(sub);

    } catch (error) {
      return res.status(500).send({message: 'Error al crear el suscriptor'})
    }
  }

  @Get(':email/:platform')
  async getSuscriberByEmailAndPlatform(
    @Param('email') email: string,
    @Param('platform') platform: string,
    @Res() res
  ) {
    try {
      const sub = await this.suscriberService.getSuscriberByEmailAndPlatform(
        email,
        platform,
      );
      return res.status(200).send(sub);
    } catch (error) {
      return res.status(500).send({message: 'Error al obtener el suscriptor'})
    }
  }

  // Update suscriber by email and platform
  @Patch('/alertacomercial')
  async updateSuscriberAlertacomercial(@Body() data, @Res() res) {
    try {
      const sub = await this.suscriberService.updateAlertacomercialSubscriber(data);
      return res.status(200).send(sub);
    } catch (error) {
      return res.status(500).send({message: 'Error al actualizar el suscriptor'})
    }
  }

  @Patch('/alertaIED')
  async updateSuscriberAlertaIED(@Body() data, @Res() res) {
    try {
      const sub = await this.suscriberService.updateAlertaIEDSubscriber(data);
      return res.status(200).send(sub);
    } catch (error) {
      return res.status(500).send({message: 'Error al actualizar el suscriptor'})
    }
  }

  @Get(':email')
  async getSuscriberByEmail(@Param('email') email: string, @Res() res) {
    try {
      const sub = await this.suscriberService.getSubscriberByEmail(email);
      return res.status(200).send(sub);
    } catch (error) {
      return res.status(500).send({message: 'Error al obtener el suscriptor'})
    }
  }

  @Get()
  async getAllSuscribers(@Res() res) {
    try {
      const subs = await this.suscriberService.getAllSuscribers();
      return res.status(200).send(subs);
    } catch (error) {
      return res.status(500).send({message: 'Error al obtener los suscriptores'})
    }
  }
}
