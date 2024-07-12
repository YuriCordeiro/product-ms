import { Module } from '@nestjs/common';
import { DataServicesModule } from 'src/services/data-services.module';
import { ProductUseCases } from './product.use-case';
import { ProductFactoryService } from './product-factory.service';

@Module({
  imports: [DataServicesModule],
  providers: [ProductFactoryService, ProductUseCases],
  exports: [ProductFactoryService, ProductUseCases],
})
export class ProductUseCaseModule {}
