import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  Patch,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('apiv2/')
export class ProductController {
  constructor(private productService: ProductService) {}

  // Product list
  @Get('products')
  async getProducts() {
    return this.productService.getActiveProducts();
  }

  @Get('products/all')
  async getAllProducts() {
    return this.productService.getProducts();
  }

  // Find product by id
  @Get('product/:id')
  async getProductById(id: string) {
    return this.productService.findOne(id);
  }

  //Get products with label and value
  @Get('products/select')
  async getProductsLabelValue() {
    return this.productService.getProductsLabelValue();
  }

  // Create product
  @Post('product')
  async createProduct(@Body() data: any) {
    return this.productService.create(data).then((res) => {});
  }

  // Edit product
  @Put('product/:id')
  async editProduct(@Param('id') id: string, @Body() data: any) {
    return this.productService.edit(id, data);
  }

  // Delete product
  @Patch('product/disable/:id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deactivate(id);
  }

  // Activate product
  @Patch('product/enable/:id')
  async activateProduct(@Param('id') id: string) {
    return this.productService.activate(id);
  }
}
