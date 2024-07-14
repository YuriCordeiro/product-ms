import { Test, TestingModule } from '@nestjs/testing';
import { ProductUseCases } from 'src/use-cases/product/product.use-case';
import { ProductDTO } from 'src/dto/product.dto';
import { Product } from 'src/frameworks/data-services/mongo/entities/product.model';
import { ProductController } from 'src/controllers/product.controller';

const mockProductUseCases = () => ({
  createProduct: jest.fn(),
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
  getProductByCategory: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
});

describe('ProductController', () => {
  let productController: ProductController;
  let productUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductUseCases, useFactory: mockProductUseCases },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productUseCases = module.get<ProductUseCases>(ProductUseCases);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const productDTO: ProductDTO = {
        name: 'Hamburger',
        sku: '123',
        value: 30,
        category: 'Food',
        description: 'Delicious burger',
        quantity: 1
      };
      const product = { _id: 'product123', ...productDTO } as Product;
      productUseCases.createProduct.mockResolvedValue(product);

      const result = await productController.createProduct(productDTO);
      expect(result).toEqual(product);
      expect(productUseCases.createProduct).toHaveBeenCalledWith(productDTO);
    });
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const products = [{ name: 'Hamburger' } as Product, { name: 'Coke' } as Product];
      productUseCases.getAllProducts.mockResolvedValue(products);

      const result = await productController.getAllProducts();
      expect(result).toEqual(products);
      expect(productUseCases.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should return a product when found by ID', async () => {
      const productId = '123456789012345678901234';
      const product = { _id: productId, name: 'Coke' } as unknown as Product;
      productUseCases.getProductById.mockResolvedValue(product);

      const result = await productController.getProductById(productId);
      expect(result).toEqual(product);
      expect(productUseCases.getProductById).toHaveBeenCalledWith(productId);
    });
  });

  describe('getProductByCategory', () => {
    it('should return an array of products by category', async () => {
      const category = 'Food';
      const products = [
        { category: 'Food', name: 'Hamburger' } as Product,
        { category: 'Drink', name: 'Coke' } as Product,
      ];

      const filteredProducts = products.filter(product => product.category === category);
      productUseCases.getProductByCategory.mockResolvedValue(filteredProducts);

      const result = await productController.getProductByCategory(category);
      expect(result).toEqual(filteredProducts);
      expect(productUseCases.getProductByCategory).toHaveBeenCalledWith(category);
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product', async () => {
      const productId = '123';
      const productDTO: ProductDTO = {
        name: 'Hamburger',
        sku: '123',
        value: 30,
        category: 'Food',
        description: 'Delicious burger',
        quantity: 0
      };
      const product = { _id: productId, ...productDTO } as Product;
      productUseCases.updateProduct.mockResolvedValue(product);

      const result = await productController.updateProduct(productId, productDTO);
      expect(result).toEqual(product);
      expect(productUseCases.updateProduct).toHaveBeenCalledWith(productId, productDTO);
    });
  });

  describe('deleteProduct', () => {
    it('should delete the product', async () => {
      const productId = '123456789012345678901234';
      productUseCases.deleteProduct.mockResolvedValue(undefined);

      const result = await productController.deleteProduct(productId);
      expect(result).toBeUndefined();
      expect(productUseCases.deleteProduct).toHaveBeenCalledWith(productId);
    });
  });
});