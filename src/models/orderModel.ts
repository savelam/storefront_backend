import bycrypt from 'bcrypt'
import { connect } from 'http2'
import jwt from 'jsonwebtoken'
// @ts-ignore
import client from '../database'
import { OrderedProductStore } from './OrderProductModel'

export type Order = {
  id: number
  product_id: number
  user_id: number
  status: string
}

export class OrderStore {
  // index to list all orders
  async index(): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders'

      const result = await conn.query(sql)

      conn.release()

      return result.rows
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`)
    }
  }

  // show all orders by state: {pending,processing, completed}
  async showOrderStatus(status: string): Promise<Order[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM orders WHERE status=$1'
      const result = await conn.query(sql, [status])
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Could not show orders ${err}`)
    }
  }

  // function to find ordered product by user and status
  async findByUserAndStatus(status: string, user_id: string): Promise<Order[]> {
    try {
      const conn = await client.connect()
      const sql =
        'SELECT id,user_id , status  FROM orders WHERE status = ' +
        `'${status}'` +
        ' AND user_id = ($1)'
      const result = await conn.query(sql, [user_id])

      for (const order of result.rows) {
        order.products = await OrderedProductStore.findOrderedProductById(
          order.id
        )
      }

      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Error Finding Order by status and user ${err}`)
    }
  }

  // create Order
  async create(o: Order): Promise<Order> {
    try {
      const conn = await client.connect()
      const sql =
        'INSERT INTO orders (product_id,user_id, status) VALUES($1, $2,$3) RETURNING *'

      const result = await conn.query(sql, [o.product_id, o.user_id, o.status])

      const product = result.rows[0]

      conn.release()

      return product
    } catch (error) {
      throw new Error(`Unable to create orders (${o.status}): ${error}`)
    }
  }
}
