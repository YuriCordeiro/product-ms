import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from 'src/dto/create-product.dto';
import { Product } from 'src/frameworks/data-services/mongo/entities/product.model';

@Injectable()
export class ProductFactoryService {

  createNewProduct(productDTO: CreateProductDTO): Product {
    const product = new Product();
    product.name = productDTO.name;
    product.sku = productDTO.sku;
    product.value = productDTO.value;
    product.category = productDTO.category;
    product.description = productDTO.description;
    return product;
  }

  updateProduct(productDTO: CreateProductDTO): Product {
    const updatedProduct = new Product();

    Object.entries(productDTO).forEach(([key, value]) => {
      if (key === 'id') return;
      updatedProduct[key] = value;
    });
    return updatedProduct;
  }
}
