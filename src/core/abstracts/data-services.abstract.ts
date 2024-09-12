
import { Inventory } from 'src/frameworks/data-services/mongo/entities/inventory.model';
import { MongoGenericRepository } from 'src/frameworks/data-services/mongo/external/mongo-generic-repository';
import { ProductRepositoryImpl } from 'src/frameworks/data-services/mongo/gateways/product.repository';

export abstract class IDataServices {
  abstract products: ProductRepositoryImpl;
  abstract inventories: MongoGenericRepository<Inventory>;
}
