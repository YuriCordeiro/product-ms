
import { ProductRepositoryImpl } from 'src/frameworks/data-services/mongo/gateways/product.repository';

export abstract class IDataServices {
  abstract products: ProductRepositoryImpl;
}
