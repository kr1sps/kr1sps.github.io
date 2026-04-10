import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { CategoriesModule } from '../categories/categories.module';
import { StorageModule } from '../infrastructure/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoriesModule,
    StorageModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
