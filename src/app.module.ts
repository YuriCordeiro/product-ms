import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductUseCaseModule } from './use-cases/product/product.use-cases.module';
import { InventoryController } from './controllers/inventory.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}), ProductUseCaseModule],
  controllers: [ProductController, InventoryController],
  providers: [],
})
export class AppModule { }
