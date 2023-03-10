"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderModel_1 = require("../models/orderModel");
const http_status_codes_1 = require("http-status-codes");
const dotenv_1 = __importDefault(require("dotenv"));
const Authentication_1 = require("../services/Authentication");
// load the env
dotenv_1.default.config();
const store = new orderModel_1.OrderStore();
// display all orders
const index = async (_req, res, _next) => {
    try {
        const orders = await store.index();
        res.status(http_status_codes_1.StatusCodes.OK).json(orders);
    }
    catch (error) {
        res.json(`Order error.${error}`);
    }
};
const create = async (req, res) => {
    // @ts-ignore
    const order = {
        product_id: req.body.product_id,
        user_id: req.body.user_id,
        status: req.body.status,
    };
    try {
        const newOrder = await store.create(order);
        //res.json(newOrder)
        res.status(http_status_codes_1.StatusCodes.CREATED).json(newOrder);
    }
    catch (err) {
        res.status(400);
        res.json(`Order could not be created.${err}`);
    }
};
const showOrderStatus = async (req, res) => {
    try {
        const orders = await store.showOrderStatus(req.params.status);
        res.status(http_status_codes_1.StatusCodes.OK).json(orders);
        //res.json(orders)
    }
    catch (error) {
        res.json(`Order error.${error}`);
    }
};
// show orders by a user and status
const findByUserAndStatus = async (req, res) => {
    try {
        const deleted = await store.findByUserAndStatus(req.body.status, req.body.user_id);
        res.json(deleted);
    }
    catch (error) {
        res.json(`Error displaying Orders by user and statuss.${error}`);
    }
};
const orders_routes = (app) => {
    app.get('/api/orders', Authentication_1.AuthenticationService.authenticate, index);
    app.get('/api/orders/:status/order-status', Authentication_1.AuthenticationService.authenticate, showOrderStatus);
    app.post('/api/orders/product', Authentication_1.AuthenticationService.authenticate, create);
    app.get('/api/orders/:status/:user_id', Authentication_1.AuthenticationService.authenticate, findByUserAndStatus);
};
exports.default = orders_routes;
