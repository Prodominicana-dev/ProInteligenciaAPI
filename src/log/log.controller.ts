import { Controller, Get, Param, Post } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('apiv2/log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  // Obtener todos los registros de log
  @Get()
  findAll() {
    return this.logService.findAll();
  }

  // Obtener un registro de log por id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logService.findOne(id);
  }
}
