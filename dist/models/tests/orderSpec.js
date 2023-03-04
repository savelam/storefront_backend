"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest = require("supertest");
/* import { describe, expect, it, test } from '@jest/globals' */
const orderModel_1 = require("../orderModel");
const Authentication_1 = require("../../services/Authentication");
const server_1 = __importDefault(require("../../server"));
const store = new orderModel_1.OrderStore();
const req = supertest(server_1.default);
const { DEFAULT_PASS } = process.env;
const token = Authentication_1.AuthenticationService.generateToken(DEFAULT_PASS);
describe('Order  Tests', () => {
    it('order model should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('order should have showOrderStatus method', () => {
        expect(store.showOrderStatus).toBeDefined();
    });
    it('order model should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('order model should have a findByUserAndStatus method', () => {
        expect(store.findByUserAndStatus).toBeDefined();
    });
});
describe('Order Creation', () => {
    it('should create an order for a user orders', async () => {
        const order1 = await store.create({
            id: 1,
            product_id: 1,
            user_id: 1,
            status: 'Completed',
        });
        const order2 = await store.create({
            id: 2,
            product_id: 1,
            user_id: 1,
            status: 'Pending',
        });
        expect(await store.index()).toEqual([
            {
                id: 1,
                product_id: 1,
                user_id: 1,
                status: 'Completed',
            },
            {
                id: 2,
                product_id: 1,
                user_id: 1,
                status: 'Pending',
            },
        ]);
    });
});
describe('orders route should send status code', () => {
    it('200 if all orders route is accessed', async () => {
        const res = await req
            .get(`/api/orders`)
            .set({ authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(200);
    });
    it('Test order creation', async () => {
        const user = await store.create({
            id: 3,
            product_id: 1,
            user_id: 1,
            status: 'Pending',
        });
        const res = await req
            .get(`/api/order/product`)
            .set({ authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(200);
    });
    it('200 if all orders searched by status route is accessed', async () => {
        const res = await req
            .get(`/api/orders/completed/order-status`)
            .set({ authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(200);
    });
    it('200 if all orders searched by status route and user is accessed', async () => {
        const res = await req
            .get(`/api/orders/pending/1`)
            .set({ authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(200);
    });
});
