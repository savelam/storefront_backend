import express, { Request, Response, NextFunction } from 'express'

import { StatusCodes } from 'http-status-codes'

import { AuthenticationService } from '../services/Authentication'

// route to handle authentication
const generateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const token = AuthenticationService.generateToken(
      req.query.password as string /// get the password as string
    )
    res.status(StatusCodes.OK).json(token)
  } catch (error) {
    next(error)
  }
}

const authenticatitonRoutes = (app: express.Application) => {
  app.get('/api/auth', generateToken)
}

export default authenticatitonRoutes
