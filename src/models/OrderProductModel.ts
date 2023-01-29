import bycrypt from 'bcrypt'
import { connect } from 'http2'

import client from '../database'

export type OrderedProduct = {
  id: number
  quantity: number
  orderId: number
  productId: number
}

export class OrderedProductStore {
  // save ordered products
  async saveOrderedProduct(
    quantity: number,
    orderId: string,
    productId: string
  ): Promise<OrderedProduct> {
    try {
      const sql =
        'INSERT INTO order_products(quantity, order_id, product_id) VALUES($1, $2, $3)'

      const conn = await client.connect()
      const result = await conn.query(sql, [quantity, orderId, productId])
      const order = result.rows[0]
      conn.release()
      return order
    } catch (err) {
      throw new Error(`Ordered Product could not be added ${err}`)
    }
  }
  // find ordered products by order id
  static async findOrderedProductById(
    orderId: string
  ): Promise<OrderedProduct[]> {
    try {
      const conn = await client.connect()
      const sql =
        'SELECT id, order_id, quantity, product_id  FROM order_products WHERE order_id = ($1)'

      const result = await conn.query(sql, [orderId])
      conn.release()
      return result.rows
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`)
    }
  }
}
