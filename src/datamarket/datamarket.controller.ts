import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { DatamarketService } from './datamarket.service';

@Controller('apiv2/datamarket')
export class DatamarketController {
  constructor(private readonly datamarketService: DatamarketService) {}

  @Get()
  async getDatamarket() {
    return this.datamarketService.getDatamarket();
  }

  @Get('active')
  async getActiveDatamarket() {
    return this.datamarketService.getActiveDatamarket();
  }

  @Post()
  async createDatamarket(@Body() data) {
    return this.datamarketService.create(data);
  }

  @Get(':id')
  async getDatamarketById(@Param('id') id: string) {
    return this.datamarketService.getDatamarketById(id);
  }

  @Patch(':id')
  async editDatamarket(@Param('id') id: string, @Body() data) {
    return this.datamarketService.edit(id, data);
  }

  @Patch('deactive/:id')
  async deactiveDatamarket(@Param('id') id: string) {
    return this.datamarketService.deactive(id);
  }

  @Patch('active/:id')
  async activeDatamarket(@Param('id') id: string) {
    return this.datamarketService.activate(id);
  }

  @Get('group/category')
  async getDatamarketByCategory() {
    return this.datamarketService.getDatamarketByCategory();
  }

  @Delete(':id')
  async deleteDatamarket(@Param('id') id: string) {
    return this.datamarketService.dDelete(id);
  }

  @Get('only/category')
  async getCategories() {
    return this.datamarketService.onlyCategories();
  }

  @Patch('update/categories')
  async updateCategories(@Body() data) {
    const dataMarket = {
      categoryPriority: data.categoryPriority,
    };
    const category = data.category;
    return this.datamarketService.updateDatamarketByCategory(
      category,
      dataMarket,
    );
  }
}
