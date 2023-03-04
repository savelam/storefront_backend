"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedProductStore = void 0;
const database_1 = __importDefault(require("../database"));
class OrderedProductStore {
    // save ordered products
    async saveOrderedProduct(quantity, orderId, productId) {
        try {
            const sql = 'INSERT INTO order_products(quantity, order_id, product_id) VALUES($1, $2, $3)';
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [quantity, orderId, productId]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Ordered Product could not be added ${err}`);
        }
    }
    // find ordered products by order id
    static async findOrderedProductById(orderId) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT id, order_id, quantity, product_id  FROM order_products WHERE order_id = ($1)';
            const result = await conn.query(sql, [orderId]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`);
        }
    }
}
exports.OrderedProductStore = OrderedProductStore;
