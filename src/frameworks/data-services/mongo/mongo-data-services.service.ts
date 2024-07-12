import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
// import { Customer, CustomerDocument } from './entities/customer.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './entities/product.model';
import { ProductRepositoryImpl } from './gateways/product.repository';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap {
  products: ProductRepositoryImpl;

  constructor(
    @InjectModel(Product.name)
    private ProductRepository: Model<ProductDocument>,
  ) { }

  onApplicationBootstrap() {
    this.products = new ProductRepositoryImpl(this.ProductRepository);
  }
}
