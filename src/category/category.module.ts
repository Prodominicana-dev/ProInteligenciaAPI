import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CategoryService, PrismaService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
