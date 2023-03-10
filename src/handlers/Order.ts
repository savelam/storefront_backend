import express, { NextFunction, Request, Response } from 'express'
import { Order, OrderStore } from '../models/orderModel'
import { StatusCodes } from 'http-status-codes'
import dotenv from 'dotenv'
import { AuthenticationService } from '../services/Authentication'

// load the env
dotenv.config()

const store = new OrderStore()

// display all orders
const index = async (
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<Order | void> => {
  try {
    const orders = await store.index()
    res.status(StatusCodes.OK).json(orders)
  } catch (error) {
    res.json(`Order error.${error}`)
  }
}

const create = async (req: Request, res: Response) => {
  // @ts-ignore
  const order: Order = {
    product_id: req.body.product_id,
    user_id: req.body.user_id,
    status: req.body.status,
  }
  try {
    const newOrder = await store.create(order)
    //res.json(newOrder)
    res.status(StatusCodes.CREATED).json(newOrder)
  } catch (err) {
    res.status(400)
    res.json(`Order could not be created.${err}`)
  }
}

const showOrderStatus = async (
  req: Request,
  res: Response
): Promise<Order | void> => {
  try {
    const orders = await store.showOrderStatus(req.params.status)
    res.status(StatusCodes.OK).json(orders)
    //res.json(orders)
  } catch (error) {
    res.json(`Order error.${error}`)
  }
}

// show orders by a user and status
const findByUserAndStatus = async (req: Request, res: Response) => {
  try {
    const deleted = await store.findByUserAndStatus(
      req.body.status,
      req.body.user_id
    )
    res.json(deleted)
  } catch (error) {
    res.json(`Error displaying Orders by user and statuss.${error}`)
  }
}

const orders_routes = (app: express.Application) => {
  app.get('/api/orders', AuthenticationService.authenticate, index)
  app.get(
    '/api/orders/:status/order-status',
    AuthenticationService.authenticate,
    showOrderStatus
  )
  app.post('/api/orders/product', AuthenticationService.authenticate, create)
  app.get(
    '/api/orders/:status/:user_id',
    AuthenticationService.authenticate,
    findByUserAndStatus
  )
}

export default orders_routes
