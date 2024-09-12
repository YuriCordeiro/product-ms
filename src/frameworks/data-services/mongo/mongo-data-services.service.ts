import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './entities/product.model';
import { ProductRepositoryImpl } from './gateways/product.repository';
import { MongoGenericRepository } from './external/mongo-generic-repository';
import { Inventory, InventoryDocument } from './entities/inventory.model';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap {
  products: ProductRepositoryImpl;
  inventories: MongoGenericRepository<Inventory>;

  constructor(
    @InjectModel(Product.name)
    private ProductRepository: Model<ProductDocument>,
    @InjectModel(Inventory.name)
    private InventoryRepository: Model<InventoryDocument>
  ) { }

  onApplicationBootstrap() {
    this.products = new ProductRepositoryImpl(this.ProductRepository);
    this.inventories = new MongoGenericRepository(this.InventoryRepository);
  }
}
