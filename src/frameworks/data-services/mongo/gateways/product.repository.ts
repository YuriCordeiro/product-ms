import { Product } from '../entities/product.model';
import { MongoGenericRepository } from '../external/mongo-generic-repository';

export class ProductRepositoryImpl extends MongoGenericRepository<Product> {

  getBySku(productSku: string) {
    return this._repository
      .findOne({ sku: productSku })
      .exec();
  }
  getProductByCategory(category: string) {
    return this._repository
      .find({ category: category })
      .exec();
  }
}
