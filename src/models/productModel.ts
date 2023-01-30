import bycrypt from 'bcrypt'
import { connect } from 'http2'
import jwt from 'jsonwebtoken'
// @ts-ignore
import client from '../database'

export type Product = {
  id: number
  name: string
  available_quantity: number
  price: number
}

export class ProductStore {
  // index to list all products
  async index(): Promise<Product[]> {
    try {
      // @ts-ignore
      const conn = await client.connect()
      const sql = 'SELECT * FROM products'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`)
    }
  }

  // create Product
  async create(p: Product): Promise<Product> {
    try {
      // @ts-ignore
      const conn = await client.connect()

      const sql =
        'INSERT INTO products (name,available_quantity, price) VALUES($1, $2,$3) RETURNING *'

      const result = await conn.query(sql, [
        p.name,
        p.available_quantity,
        p.price,
      ])

      const product = result.rows[0]

      conn.release()

      return product
    } catch (error) {
      throw new Error(`Unable to create product (${p.name}): ${error}`)
    }
  }

  // display product details
  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      conn.release()

      return result.rows[0]
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`)
    }
  }

  // delete product
  async delete(id: string): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)'
      // @ts-ignore
      const conn = await client.connect()

      const result = await conn.query(sql, [id])

      const prooduct = result.rows[0]

      conn.release()

      return prooduct
    } catch (err) {
      throw new Error(`Could not delete prooduct ${id}. Error: ${err}`)
    }
  }
}
