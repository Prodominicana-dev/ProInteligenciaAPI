import { Controller, Get, Res } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { Response } from 'express';

@Controller('apiv2/chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('ied-by-country')
  async getIedByCountry(@Res() res: Response) {
    try {
      const data = await this.chatbotService.getViewData();
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Error al obtener datos de IED por país' });
    }
  }
}
