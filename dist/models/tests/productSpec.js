"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest = require("supertest");
const productModel_1 = require("../productModel");
const server_1 = __importDefault(require("../../server"));
const store = new productModel_1.ProductStore();
const req = supertest(server_1.default);
describe('Product model ', () => {
    it('should be 1 (index)', async () => {
        const result = await store.index();
        expect(result.length).toBe(1);
    });
    /*  it('Test for show', async () => {
      const result = await store.show('1')
      expect(result).toBe(1)
    }) */
    it('test creation of product', async () => {
        const p = {
            id: 1,
            name: 'Orange',
            available_quantity: 4,
            price: 100,
        };
        await store.create(p);
        const products = await store.index();
        expect(products.length).toBeGreaterThan(0);
    });
    /* it('should be able to delete product', async () => {
      const result = await store.delete('1')
      expect(result).toEqual(0)
    }) */
});
