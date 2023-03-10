import supertest = require('supertest')
import dotenv from 'dotenv'
import { Product, ProductStore } from '../productModel'

import app from '../../server'

const store = new ProductStore()
const req = supertest(app)

describe('Product model ', () => {
  /*  it('Test for show', async () => {
    const result = await store.show('1')
    expect(result).toBe(1)
  }) */
  it('test creation of product', async () => {
    const p: Product = {
      id: 1,
      name: 'Orange',
      available_quantity: 4,
      price: 100,
    }
    await store.create(p)
    const products = await store.index()
    expect(products.length).toBeGreaterThan(0)
  })

  /* it('should be able to delete product', async () => {
    const result = await store.delete('1')
    expect(result).toEqual(0)
  }) */
})
