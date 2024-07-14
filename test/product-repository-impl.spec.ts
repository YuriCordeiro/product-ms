import { Product } from 'src/frameworks/data-services/mongo/entities/product.model';
import { ProductRepositoryImpl } from 'src/frameworks/data-services/mongo/gateways/product.repository';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';

const mockProductModel = () => ({
  find: jest.fn().mockReturnValue({
    populate: jest.fn().mockReturnValue({
      exec: jest.fn(),
    }),
    exec: jest.fn(),
  }),
  findById: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn(),
  }),
});

describe('ProductRepositoryImpl', () => {
  let repository: ProductRepositoryImpl;
  let productModel: ReturnType<typeof mockProductModel>;

  beforeEach(async () => {
    productModel = mockProductModel() as any;

    repository = new ProductRepositoryImpl(productModel as any);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getProductByCategory', () => {
    it('should return an array of products with the given category', async () => {
      const category = 'Food';
      const products = [
        { category: 'Food', name: 'Mczinho', value: 15.2, quantity: 2, description: 'Test description' } as Product,
        { category: 'Drink', name: 'Fries', value: 20.2, quantity: 2, description: 'Test description' } as Product,
      ];
      const filteredProducts = products.filter(product => product.category === category);
      productModel.find.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(filteredProducts),
      });

      const result = await repository.getProductByCategory(category);
      expect(result).toEqual(filteredProducts);
      expect(productModel.find).toHaveBeenCalledWith({ category });
    });
  });

  describe('getAll', () => {
    it('should return an array of products', async () => {
      const products = [
        { category: 'Food', name: 'Mczinho', value: 15.2, quantity: 2, description: 'Test description' } as Product,
        { category: 'Food', name: 'Fries', value: 20.2, quantity: 2, description: 'Test description' } as Product,
      ];
      productModel.find().populate().exec.mockResolvedValue(products);
      const result = await repository.getAll();
      expect(result).toEqual(products);
      expect(productModel.find).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return a product by ID', async () => {
      const productId = '123456789012345678901234';
      const product = { _id: productId, category: 'Food', name: 'Hamburger', value: 15.2, quantity: 2, description: 'Test description' } as unknown as Product;
      productModel.findById().exec.mockResolvedValue(product);
      const result = await repository.get(productId);
      expect(result).toEqual(product);
      expect(productModel.findById).toHaveBeenCalledWith(productId);
    });
  });

  describe('create', () => {
    it('should create and return a new product', async () => {
      const product = { category: 'Food', name: 'Hamburger', value: 15.2, quantity: 2, description: 'Test description' } as Product;
      productModel.create.mockResolvedValue(product);

      const result = await repository.create(product);
      expect(result).toEqual(product);
      expect(productModel.create).toHaveBeenCalledWith(product);
    });
  });

  describe('update', () => {
    it('should update and return the product', async () => {
      const productId = '123';
      const product = { _id: productId, category: 'Food', name: 'Mczinho', value: 15.2, quantity: 2, description: 'Test description' } as unknown as Product;
      productModel.findByIdAndUpdate.mockResolvedValue(product);

      const result = await repository.update(productId, product);
      expect(result).toEqual(product);
      expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(productId, product, { new: true });
    });
  });

  describe('delete', () => {
    it('should delete the product', async () => {
      const productId = '123456789012345678901234';
      productModel.findByIdAndDelete().exec.mockResolvedValue({ _id: productId } as unknown as Product);

      await repository.delete(productId);
      expect(productModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
    });
  });
});