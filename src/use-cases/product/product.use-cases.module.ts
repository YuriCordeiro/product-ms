import { Module } from '@nestjs/common';
import { DataServicesModule } from 'src/services/data-services.module';
import { ProductUseCases } from './product.use-case';
import { ProductFactoryService } from './product-factory.service';
import { InventoryUseCase } from '../inventory/inventory.use-case';
import { InventoryFactoryService } from '../inventory/inventory-factory.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DataServicesModule, ConfigModule.forRoot()],
  providers: [ProductFactoryService, ProductUseCases, InventoryUseCase, InventoryFactoryService],
  exports: [ProductFactoryService, ProductUseCases, InventoryUseCase, InventoryFactoryService],
})
export class ProductUseCaseModule {}
