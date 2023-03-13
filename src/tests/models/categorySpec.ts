import supertest = require('supertest');

import { ValidationError } from 'joi';

import { CategoryStore } from '../../models/Category';
import app from '../../server';
import { getCategoryError } from '../../utils/get-errors';
import { CustomError } from '../../errors';
import { API_BASE_URL } from '../../utils/constants';

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
    const category = await CategoryStore.create('Fruits');
    expect(category).toEqual({
      id: category.id,
      name: 'Fruits'
    });
  });
  it('should throw ValidationError given an invalid name', async () => {
    const customError = await getCategoryError(CategoryStore.create, 'Fruits_');
    expect(customError).toBeInstanceOf(ValidationError);
  });
  it('should throw CustomError category exists', async () => {
    await CategoryStore.create('Vegetables');
    const conflictError = await getCategoryError(
      CategoryStore.create,
      'Vegetables'
    );
    expect(conflictError).toEqual(
      new CustomError(`Category 'Vegetables' already exists`, 409)
    );
  });
});

describe('Create category route should send status code', () => {
  it('201 if category created', async () => {
    const res = await req
      .post(`${API_BASE_URL}/categories`)
      .send({ name: 'Fish' });
    expect(res.statusCode).toBe(201);
  });
  it('200 when all categories routes is accessed', async () => {
    const res = await req.get(`${API_BASE_URL}/categories`);
    expect(res.statusCode).toBe(200);
  });
  it('409 when category alreay exists', async () => {
    await req.post(`${API_BASE_URL}/categories`).send({ name: 'Gun' });
    const conflictingRes = await req
      .post(`${API_BASE_URL}/categories`)
      .send({ name: 'gun' });
    expect(conflictingRes.statusCode).toBe(409);
  });
});
