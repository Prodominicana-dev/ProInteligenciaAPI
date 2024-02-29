import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('apiv2/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('alertacomercial')
  async getAlertacomercialCategories() {
    return await this.categoryService.getAlertacomercialCategories();
  }

  @Get('alertaIED')
  async getAlertaIEDCategories() {
    return await this.categoryService.getAlertaIEDCategories();
  }

  @Post()
  async createCategory(@Body() data) {
    return await this.categoryService.createCategory(data);
  }

  @Get('select/alertaIED')
  async getSelectAlertaIEDCategories() {
    return await this.categoryService.getSelectAlertaIEDCategories();
  }
}
