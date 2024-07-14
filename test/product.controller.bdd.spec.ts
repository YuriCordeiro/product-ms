import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from 'src/controllers/product.controller';
import { ProductUseCases } from 'src/use-cases/product/product.use-case';
import { ProductDTO } from 'src/dto/product.dto';
import { Product } from 'src/frameworks/data-services/mongo/entities/product.model';

const feature = loadFeature('./test/product.feature');

const mockProductUseCases = () => ({
  createProduct: jest.fn(),
  getAllProducts: jest.fn(),
  getProductById: jest.fn(),
  getProductByCategory: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
});

defineFeature(feature, test => {
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

  test('Create a new product', ({ given, when, then }) => {
    let productDTO: ProductDTO;
    let product: Product;

    given('I have a product', () => {
      productDTO = { name: 'Hamburger', description: 'Delicious Burger', price: 30 } as unknown as ProductDTO;
    });

    when('I create the product', async () => {
      product = { _id: 'productId', ...productDTO } as Product;
      productUseCases.createProduct.mockResolvedValue(product);
      product = await productController.createProduct(productDTO);
    });

    then('I should receive the created product', () => {
      expect(product).toEqual({ _id: 'productId', ...productDTO });
      expect(productUseCases.createProduct).toHaveBeenCalledWith(productDTO);
    });
  });

  test('Get all products', ({ given, when, then }) => {
    let products: Product[];

    given('there are products in the system', () => {
      products = [
        { _id: 'productId1', name: 'Hamburger', description: 'Delicious Burger', price: 30 } as unknown as Product,
        { _id: 'productId2', name: 'Coke', description: 'Delicious Coke', price: 10 } as unknown as Product,
      ];
      productUseCases.getAllProducts.mockResolvedValue(products);
    });

    when('I get all products', async () => {
      products = await productController.getAllProducts();
    });

    then('I should receive a list of products', () => {
      expect(products).toEqual([
        { _id: 'productId1', name: 'Hamburger', description: 'Delicious Burger', price: 30 },
        { _id: 'productId2', name: 'Coke', description: 'Delicious Coke', price: 10 },
      ]);
      expect(productUseCases.getAllProducts).toHaveBeenCalled();
    });
  });
});