import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductUseCaseModule } from './use-cases/product/product.use-cases.module';

@Module({
  imports: [ProductUseCaseModule],
  controllers: [ProductController],
  providers: [],
})
export class AppModule { }
