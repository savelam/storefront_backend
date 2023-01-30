import supertest = require('supertest')
import dotenv from 'dotenv'
import { describe, expect, it, test } from '@jest/globals'

import app from '../../server'

const req = supertest(app)

dotenv.config()

describe('Test for api endpoints', () => {
  it('This should be a home route', async () => {
    const response = await req.get('/')
    expect(response.status).toBe(200)
  })

  it('should get users route', async () => {
    const response = await req.get('/api/users')
    expect(response.status).toBe(200)
  })
})

describe('Product endpoint Responses', () => {
  it('should Index Products route ', async () => {
    const response = await req.get('/api/products')
    expect(response.status).toBe(200)
  })

  it('Test for product show route', async () => {
    const response = await req.get('/api/products/1')
    expect(response.status).toBe(200)
  })
})

describe('Orders Route Test', () => {
  it('Should Index Orders route', async () => {
    const response = await req.get('/api/orders')
    expect(response.status).toBe(200)
  })

  it('Get order by status', async () => {
    const response = await req.get('/api/orders/completed/order-status')
    expect(response.status).toBe(200)
  })
})
