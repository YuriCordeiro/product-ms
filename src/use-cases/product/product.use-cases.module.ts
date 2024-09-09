import { Module } from '@nestjs/common';
import { DataServicesModule } from 'src/services/data-services.module';
import { ProductUseCases } from './product.use-case';
import { ProductFactoryService } from './product-factory.service';
import { InventoryUseCase } from '../inventory/inventory.use-case';
import { ConfigModule } from '@nestjs/config';
import { InventoryFactoryService } from '../inventory/inventory-factory.service';
import { SQSConsumerService } from 'src/frameworks/messaging-services/sqs-messaging-services.service';

@Module({
  imports: [DataServicesModule, ConfigModule.forRoot()],
  providers: [ProductFactoryService, ProductUseCases, InventoryUseCase, InventoryFactoryService, SQSConsumerService],
  exports: [ProductFactoryService, ProductUseCases, InventoryUseCase, InventoryFactoryService, SQSConsumerService],
})
export class ProductUseCaseModule {}
