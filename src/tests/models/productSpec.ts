import supertest = require('supertest');

import { CategoryStore } from '../../models/Category';
import { ProductStore } from '../../models/Product';
import { truncateTable } from '../../utils/dbUtils';
import app from '../../server';
import { AuthService } from '../../services/Auth';
import { API_BASE_URL } from '../../utils/constants';

const req = supertest(app);
const { ADMIN_PASSWORD } = process.env;
const token = AuthService.generateToken(ADMIN_PASSWORD as string);

describe('Product Store should have', () => {
  it('an index method', () => {
    expect(ProductStore.index).toBeDefined();
  });

  it('a show method', () => {
    expect(ProductStore.show).toBeDefined();
  });

  it('a create method', () => {
    expect(ProductStore.create).toBeDefined();
  });

  it('a productsByCategory method', () => {
    expect(ProductStore.productsByCategory).toBeDefined();
  });
});

describe('Product Store ', () => {
  it('should create product', async () => {
    await truncateTable('categories');
    const category = await CategoryStore.create('Test Product Category');

    const product = await ProductStore.create({
      name: 'Test Product',
      price: '50.00',
      category: category.name
    });

    expect(product).toEqual({
      id: product.id,
      name: 'Test Product',
      price: '50.00',
      categoryId: +category.id,
      category: category.name
    });
  });

  it('should show requested product', async () => {
    await truncateTable('categories');
    const category = await CategoryStore.create('Tony Stark Category');

    const product = await ProductStore.create({
      name: 'Tony Stark',
      price: '50.43',
      category: category.name
    });

    expect(await ProductStore.show(product.id)).toEqual({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      categoryId: product.categoryId
    });
  });

  it('should show products by category', async () => {
    await truncateTable('categories');
    const categoryOne = await CategoryStore.create('Test Product two');

    const productTwo = await ProductStore.create({
      name: 'Test Product two',
      price: '18.50',
      category: categoryOne.name
    });

    const productThree = await ProductStore.create({
      name: 'Test Product Three',
      price: '56.79',
      category: categoryOne.name
    });

    expect(await ProductStore.productsByCategory(categoryOne.name)).toEqual([
      {
        id: productTwo.id,
        name: productTwo.name,
        price: productTwo.price,
        category: productTwo.category,
        categoryId: productTwo.categoryId
      },
      {
        id: productThree.id,
        name: productThree.name,
        price: productThree.price,
        category: productThree.category,
        categoryId: productThree.categoryId
      }
    ]);
  });
});

describe('products route should send status code', () => {
  it('200 if all products route is accessed', async () => {
    const res = await req.get(`${API_BASE_URL}/products`);
    expect(res.statusCode).toBe(200);
  });
});
