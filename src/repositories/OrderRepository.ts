import { QueryResult } from 'pg';
import client from '../database';
import {
  CompletOrderDetails,
  Order,
  OrderDetails,
  SaveInfo
} from '../types/order';
import { OrderProductsRepository } from './OrderProductsRepository';

export class OrderRepository {
  static getSaveInfo(details: OrderDetails): SaveInfo {
    const fields = details.status ? 'user_id, status' : 'user_id';

    if (!details.status) {
      delete details.status;
    }

    const values = details.status
      ? [details.userId, details.status]
      : [details.userId];

    const sql =
      `INSERT INTO orders(${fields}) VALUES ${
        details.status ? '($1, $2)' : '($1)'
      } ` +
      'RETURNING id, user_id AS "userId", ' +
      'status, created_at AS "createdAt", completed_at AS "completedAt"';

    return { values, sql };
  }

  static async save(details: OrderDetails): Promise<Order> {
    const conn = await client.connect();
    const saveInfo = OrderRepository.getSaveInfo(details);
    const result: QueryResult<Order> = await conn.query(
      saveInfo.sql,
      saveInfo.values
    );
    result.rows[0].products = await OrderProductsRepository.saveAll(
      result.rows[0].id,
      details.products
    );
    conn.release();
    return result.rows[0];
  }

  static async saveAll(details: OrderDetails[]): Promise<Order[]> {
    const savedOrders: Order[] = [];

    const conn = await client.connect();

    for (const detail of details) {
      const saveInfo = OrderRepository.getSaveInfo(detail);
      const result: QueryResult<Order> = await conn.query(
        saveInfo.sql,
        saveInfo.values
      );
      savedOrders.push(result.rows[0]);
    }
    conn.release();
    return savedOrders;
  }

  static async findByStatus(status: string, id: string): Promise<Order[]> {
    const conn = await client.connect();

    const ordersQuery =
      'SELECT id, ' +
      'user_id AS "userId", status, created_at AS "createdAt", ' +
      'completed_at AS "completedAt" FROM orders WHERE status = ' +
      `'${status}'` +
      ' AND user_id = ($1)';

    const result: QueryResult<Order> = await conn.query(ordersQuery, [id]);

    for (const order of result.rows) {
      order.products = await OrderProductsRepository.findByOrderId(order.id);
    }

    conn.release();
    return result.rows;
  }

  static async findByCurrentUserOrders(id: string): Promise<Order[]> {
    return await OrderRepository.findByStatus('active', id);
  }

  static async findByCompletedUserOrders(id: string): Promise<Order[]> {
    return await OrderRepository.findByStatus('completed', id);
  }

  static async complete(details: CompletOrderDetails): Promise<Order> {
    const conn = await client.connect();
    const updateOrderQuery =
      "UPDATE orders SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ($1) " +
      'AND user_id = ($2) ' +
      'RETURNING id, user_id AS "userId", ' +
      'status, created_at AS "createdAt", completed_at AS "completedAt"';

    const result: QueryResult<Order> = await conn.query(updateOrderQuery, [
      details.orderId,
      details.userId
    ]);
    result.rows[0].products = await OrderProductsRepository.findByOrderId(
      result.rows[0].id
    );
    conn.release();
    return result.rows[0];
  }

  static async completeAll(details: CompletOrderDetails[]): Promise<Order[]> {
    const completed: Order[] = [];

    for (const detail of details) {
      completed.push(await OrderRepository.complete(detail));
    }

    return completed;
  }
}
