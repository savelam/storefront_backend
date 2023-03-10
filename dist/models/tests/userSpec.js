"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest = require("supertest");
//import dotenv from 'dotenv'
const userModel_1 = require("../userModel");
const Authentication_1 = require("../../services/Authentication");
const server_1 = __importDefault(require("../../server"));
const store = new userModel_1.UserModel();
const req = supertest(server_1.default);
const { DEFAULT_PASS } = process.env;
const token = Authentication_1.AuthenticationService.generateToken(DEFAULT_PASS);
describe('User Model Test', () => {
    it('user model should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('user model should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('user model should have a create method', () => {
        expect(store.create).toBeDefined();
    });
});
describe('Test User Creation', () => {
    it('should contain all created users', async () => {
        const user1 = await store.create({
            id: 1,
            first_name: 'Dela',
            last_name: 'Joe',
            username: 'dela',
            password: DEFAULT_PASS,
        });
        const user2 = await store.create({
            id: 2,
            first_name: 'Francis',
            last_name: 'Ama',
            username: 'francis',
            password: DEFAULT_PASS,
        });
        /* expect(await store.index()).toEqual([
          {
            id: 1,
            first_name: 'Dela',
            last_name: 'Joe',
            username: 'dela',
          },
          {
            id: 2,
            first_name: 'Francis',
            last_name: 'Ama',
            username: 'francis',
          },
        ]) */
    });
});
describe('users route should send status code', () => {
    it('200 if all users are returned.', async () => {
        const res = await req
            .get(`/api/users`)
            .set({ authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(200);
    });
    it('Test user creation', async () => {
        const user = await store.create({
            id: 3,
            first_name: 'Francis',
            last_name: 'Ama',
            username: 'francis',
            password: DEFAULT_PASS,
        });
        console.log(user);
        const res = await req
            .get(`/api/users/${user.id}`)
            .set({ authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(200);
    });
});
