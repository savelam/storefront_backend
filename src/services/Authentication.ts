import jwt from 'jsonwebtoken'
const { DEFAULT_PASS, TOKEN_SECRET } = process.env

import { Request, Response, NextFunction } from 'express'

export class AuthenticationService {
  /**
   * @param default password to authenticate user
   */
  static generateToken(password: string): string {
    console.log(password)
    if (password !== DEFAULT_PASS) {
      throw new Error('Password not correct.')
    }
    return jwt.sign({}, TOKEN_SECRET as string, {
      expiresIn: '2h', // let it expire in 2 hours
    })
  }

  static async authenticate(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    const authHeader = req.headers.authorization

    console.log(authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new Error('Please provide token'))
    }

    const token = authHeader.split(' ')[1]
    console.log(token)
    console.log(TOKEN_SECRET)
    try {
      const verify = jwt.verify(token, TOKEN_SECRET as string)
      console.log(verify)

      return next()
    } catch (error) {
      return next(new Error('You are not authorized user'))
    }
  }
}
