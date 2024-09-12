import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { ProductFactoryService } from './product-factory.service';
import { GetProductDTO } from 'src/dto/get-product.dto';
import { Product } from 'src/frameworks/data-services/mongo/entities/product.model';
import { InventoryUseCase } from '../inventory/inventory.use-case';
import { CreateProductDTO } from 'src/dto/create-product.dto';

@Injectable()
export class ProductUseCases {

  constructor(
    private dataServices: IDataServices,
    private productFactoryService: ProductFactoryService,
    private inventoryUseCase: InventoryUseCase
  ) { }

  getAllProducts(): Promise<Product[]> {
    return this.dataServices.products.getAll();
  }

  private isProductValid(foundProduct: Product, id: string) {
    if (foundProduct != null) {
      return foundProduct;
    } else {
      throw new NotFoundException(
        `Product with id: ${id} not found at database.`,
      );
    }
  }

  async getProductById(id: string): Promise<Product> {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const foundProduct = await this.dataServices.products.get(id);
      return this.isProductValid(foundProduct, id);
    } else {
      throw new BadRequestException(`'${id}' is not a valid ObjectID`);
    }
  }

  getProductByCategory(category: string): Promise<Product[]> {
    return this.dataServices.products.getProductByCategory(category);
  }

  getProductBySku(productSku: string): Promise<Product> {
    return this.dataServices.products.getBySku(productSku);
  }

  async createProduct(productDTO: CreateProductDTO): Promise<Product> {
    const productSKU = productDTO.sku;
    const foundProduct = await this.getProductBySku(productSKU);
    if (foundProduct != null) {
      throw new ConflictException(`There was another product with SKU: ${productSKU}. Try to change it and try again.`);
    }
    const newProduct = this.productFactoryService.createNewProduct(productDTO);
    this.inventoryUseCase.createProductInventory(productDTO); // Validar uso de fila para processar itens em estoque (faz sentido para o mesmo MS? Acho que não)
    return this.dataServices.products.create(newProduct);
  }

  updateProduct(productId: string, productDTO: CreateProductDTO): Promise<Product> {
    const newProduct = this.productFactoryService.updateProduct(productDTO);
    return this.dataServices.products.update(productId, newProduct);
  }

  async deleteProduct(productId: string) {
    const foundProduct = await this.getProductById(productId);
    this.isProductValid(foundProduct, productId);
    this.dataServices.products.delete(productId);
  }
}
