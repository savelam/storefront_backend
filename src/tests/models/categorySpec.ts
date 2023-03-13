import supertest = require('supertest');

import { ValidationError } from 'joi';

import { CategoryStore } from '../../models/Category';
import app from '../../server';
import { getCategoryError } from '../../utils/get-errors';
import { CustomError } from '../../errors';
import { API_BASE_URL } from '../../utils/constants';
import { truncateTable } from '../../utils/dbUtils';

const req = supertest(app);

describe('Category store', () => {
  it('should contain an index method', () => {
    expect(CategoryStore.index).toBeDefined();
  });
  it('should contain a create method', () => {
    expect(CategoryStore.create).toBeDefined();
  });
});

describe('Category store create method', () => {
  it('should create category given a valid name', async () => {
    await truncateTable('categories');
    const category = await CategoryStore.create('Continental Fruits');
    expect(category).toEqual({
      id: category.id,
      name: category.name
    });
  });
  it('should throw ValidationError given an invalid name', async () => {
    const customError = await getCategoryError(
      CategoryStore.create,
      'Continental Fruits_'
    );
    expect(customError).toBeInstanceOf(ValidationError);
  });
});

describe('Create category route should send status code', () => {
  it('200 when all categories routes is accessed', async () => {
    const res = await req.get(`${API_BASE_URL}/categories`);
    expect(res.statusCode).toBe(200);
  });
});
