"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
// @ts-ignore
const database_1 = __importDefault(require("../database"));
class ProductStore {
    // index to list all products
    async index() {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }
    // create Product
    async create(p) {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'INSERT INTO products (name,available_quantity, price) VALUES($1, $2,$3) RETURNING *';
            const result = await conn.query(sql, [
                p.name,
                p.available_quantity,
                p.price,
            ]);
            const product = result.rows[0];
            conn.release();
            return product;
        }
        catch (error) {
            throw new Error(`Unable to create product (${p.name}): ${error}`);
        }
    }
    // display product details
    async show(id) {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`);
        }
    }
    // delete product
    async delete(id) {
        try {
            const sql = 'DELETE FROM products WHERE id=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const prooduct = result.rows[0];
            conn.release();
            return prooduct;
        }
        catch (err) {
            throw new Error(`Could not delete prooduct ${id}. Error: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
