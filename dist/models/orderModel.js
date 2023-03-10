"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
// @ts-ignore
const database_1 = __importDefault(require("../database"));
const OrderProductModel_1 = require("./OrderProductModel");
class OrderStore {
    // index to list all orders
    async index() {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`);
        }
    }
    // show all orders by state: {pending,processing, completed}
    async showOrderStatus(status) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM orders WHERE status=$1';
            const result = await conn.query(sql, [status]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not show orders ${err}`);
        }
    }
    // function to find ordered product by user and status
    async findByUserAndStatus(status, user_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT id,user_id , status  FROM orders WHERE status = ' +
                `'${status}'` +
                ' AND user_id = ($1)';
            const result = await conn.query(sql, [user_id]);
            for (const order of result.rows) {
                order.products = await OrderProductModel_1.OrderedProductStore.findOrderedProductById(order.id);
            }
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Error Finding Order by status and user ${err}`);
        }
    }
    // create Order
    async create(o) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'INSERT INTO orders (product_id,user_id, status) VALUES($1, $2,$3) RETURNING *';
            const result = await conn.query(sql, [o.product_id, o.user_id, o.status]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (error) {
            throw new Error(`Unable to create orders (${o.status}): ${error} ${o.product_id}`);
        }
    }
}
exports.OrderStore = OrderStore;
