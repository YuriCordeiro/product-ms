import { Test, TestingModule } from '@nestjs/testing';
import { ProductUseCases } from 'src/use-cases/product/product.use-case';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { ProductFactoryService } from 'src/use-cases/product/product-factory.service';
import { GetProductDTO } from 'src/dto/get-product.dto';
import { Product } from 'src/frameworks/data-services/mongo/entities/product.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockDataServices = () => ({
  products: {
    getAll: jest.fn(),
    get: jest.fn(),
    getProductByCategory: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getBySku: jest.fn(),
  },
});

const mockProductFactoryService = () => ({
  createNewProduct: jest.fn(),
  updateProduct: jest.fn(),
});

describe('ProductUseCases', () => {
  let productUseCases: ProductUseCases;
  let dataServices;
  let productFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductUseCases,
        { provide: IDataServices, useFactory: mockDataServices },
        { provide: ProductFactoryService, useFactory: mockProductFactoryService },
      ],
    }).compile();

    productUseCases = module.get<ProductUseCases>(ProductUseCases);
    dataServices = module.get<IDataServices>(IDataServices);
    productFactoryService = module.get<ProductFactoryService>(ProductFactoryService);
  });

  it('should be defined', () => {
    expect(productUseCases).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const products = [{ name: 'Hamburger' } as Product, { name: 'Fries' } as Product];
      dataServices.products.getAll.mockResolvedValue(products);

      const result = await productUseCases.getAllProducts();
      expect(result).toEqual(products);
      expect(dataServices.products.getAll).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should return a product when found by ID', async () => {
      const productId = '123456789012345678901234';
      const product = { _id: productId, name: 'Mczin' } as unknown as Product;
      dataServices.products.get.mockResolvedValue(product);

      const result = await productUseCases.getProductById(productId);
      expect(result).toEqual(product);
      expect(dataServices.products.get).toHaveBeenCalledWith(productId);
    });

    it('should throw NotFoundException when product is not found', async () => {
      const productId = '123456789012345678901234';
      dataServices.products.get.mockResolvedValue(null);

      await expect(productUseCases.getProductById(productId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid id format', async () => {
      const invalidId = 'invalid-id';

      await expect(productUseCases.getProductById(invalidId)).rejects.toThrow(BadRequestException);
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
      dataServices.products.getProductByCategory.mockResolvedValue(filteredProducts);

      const result = await productUseCases.getProductByCategory(category);
      expect(result).toEqual(filteredProducts);
      expect(dataServices.products.getProductByCategory).toHaveBeenCalledWith(category);
    });
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const productDTO: GetProductDTO = {
        name: 'Hamburger',
        sku: '123',
        value: 30,
        category: 'Food',
        description: 'Delicious burger',
        quantity: 0
      };
      const product = { _id: 'product123', ...productDTO } as Product;
      productFactoryService.createNewProduct.mockReturnValue(product);
      dataServices.products.create.mockResolvedValue(product);
      dataServices.products.getBySku.mockResolvedValue(null);

      const result = await productUseCases.createProduct(productDTO);
      expect(result).toEqual(product);
      expect(productFactoryService.createNewProduct).toHaveBeenCalledWith(productDTO);
      expect(dataServices.products.create).toHaveBeenCalledWith(product);
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product', async () => {
      const productId = '123';
      const productDTO: GetProductDTO = {
        name: 'Hamburger',
        sku: '123',
        value: 100,
        category: 'Food',
        description: 'Delicious burger',
        quantity: 0
      };
      const product = { _id: productId, ...productDTO } as Product;
      productFactoryService.updateProduct.mockReturnValue(product);
      dataServices.products.update.mockResolvedValue(product);

      const result = await productUseCases.updateProduct(productId, productDTO);
      expect(result).toEqual(product);
      expect(productFactoryService.updateProduct).toHaveBeenCalledWith(productDTO);
      expect(dataServices.products.update).toHaveBeenCalledWith(productId, product);
    });
  });

  describe('deleteProduct', () => {
    it('should delete the product', async () => {
      const productId = '123456789012345678901234';
      const product = { _id: productId, name: 'Product 1' } as unknown as Product;
      dataServices.products.get.mockResolvedValue(product);
      dataServices.products.delete.mockResolvedValue(undefined);

      await productUseCases.deleteProduct(productId);

      expect(dataServices.products.get).toHaveBeenCalledWith(productId);
      expect(dataServices.products.delete).toHaveBeenCalledWith(productId);
    });

    it('should throw NotFoundException when product is not found for deletion', async () => {
      const productId = '123456789012345678901234';
      dataServices.products.get.mockResolvedValue(null);

      await expect(productUseCases.deleteProduct(productId)).rejects.toThrow(NotFoundException);
    });
  });
});