import express, { Request, Response, NextFunction } from 'express'
import { User, UserModel } from '../models/userModel'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { StatusCodes } from 'http-status-codes'
import { AuthenticationService } from '../services/Authentication'

// load the env
dotenv.config()

const store = new UserModel()

const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const users = await store.index()
    return res.status(StatusCodes.OK).json(users)
  } catch (error) {
    next(error)
  }
}

const show = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const user = await store.show(req.params.id)
    return res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}

const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const user = await store.create(req.body)
    return res.status(StatusCodes.CREATED).json(user)
  } catch (error) {
    next(error)
  }
}

const user_routes = (app: express.Application) => {
  app.get('/api/users', AuthenticationService.authenticate, index)
  app.get('/api/users/:id', AuthenticationService.authenticate, show)
  app.post('/api/users', AuthenticationService.authenticate, create)
}

export default user_routes
