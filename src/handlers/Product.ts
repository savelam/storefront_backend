import express, { NextFunction, Request, Response } from 'express'
import { Product, ProductStore } from '../models/productModel'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
import { AuthenticationService } from '../services/Authentication'

// load the env
dotenv.config()

const store = new ProductStore()

const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Product | void> => {
  try {
    const products = await store.index()
    res.status(StatusCodes.OK).json(products)
  } catch (error) {
    next(error)
  }
}

const create = async (req: Request, res: Response) => {
  // @ts-ignore
  const product: Product = {
    name: req.body.name,
    available_quantity: req.body.available_quantity,
    price: req.body.price,
  }
  try {
    const newProduct = await store.create(product)
    res.json(newProduct)
  } catch (err) {
    res.status(400)
    res.json(`Product could not be created.${err}`)
  }
}

const show = async (req: Request, res: Response): Promise<Product | void> => {
  try {
    const product = await store.show(req.params.id)
    res.json(product)
  } catch (error) {
    res.json(`Product error.${error}`)
  }
}

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.body.id)
    res.json(deleted)
  } catch (error) {
    res.json(`Error deleting Product.${error}`)
  }
}

const update = async (req: Request, res: Response) => {}

const product_routes = (app: express.Application) => {
  app.get('/api/products', index)
  app.get('/api/products/:id', show)
  app.post('/api/products', AuthenticationService.authenticate, create)
  app.put('/api/products/:id', AuthenticationService.authenticate, update)
  app.delete('/api/products/:id', AuthenticationService.authenticate, destroy)
}

export default product_routes
