import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductUseCases } from 'src/use-cases/product/product.use-case';
import { GetProductDTO } from 'src/dto/get-product.dto';
import { Product } from 'src/frameworks/data-services/mongo/entities/product.model';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDTO } from 'src/dto/create-product.dto';

@ApiTags('Products')
@Controller('/products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private productUseCases: ProductUseCases) { }

  @Post()
  async createProduct(@Body() ProductDTO: CreateProductDTO): Promise<Product> {
    this.logger.log(`createProduct(CreateProductDTO) - Start`);
    return this.productUseCases.createProduct(ProductDTO);
  }

  @Get()
  async getAllProducts() {
    this.logger.log(`getAllProducts() - Start`);
    return this.productUseCases.getAllProducts();
  }

  @Get('/id/:productId')
  async getProductById(@Param('productId') productId: string): Promise<Product> {
    this.logger.log(`getProductById(string) - Start`);
    return await this.productUseCases.getProductById(productId);
  }

  @Get('/sku/:productSku')
  getProductBySKU(@Param('productSku') productSku: string): Promise<Product> {
    this.logger.log(`getProductBySKU(string) - Start`);
    return this.productUseCases.getProductBySku(productSku);
  }

  @Get('/category/:category')
  async getProductByCategory(
    @Param('category') category: string,
  ): Promise<Product[]> {
    this.logger.log(`getProductByCategory(string) - Start`);
    return this.productUseCases.getProductByCategory(category);
  }

  @Put('/:productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() productDTO: CreateProductDTO,
  ): Promise<Product> {
    this.logger.log(`updateProduct(string, ProductDTO) - Start`);
    return this.productUseCases.updateProduct(productId, productDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: string): Promise<void> {
    this.logger.log(`deleteProduct(String) - Start`);
    return await this.productUseCases.deleteProduct(productId);
  }
}
