"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productModel_1 = require("../models/productModel");
const http_status_codes_1 = require("http-status-codes");
const dotenv_1 = __importDefault(require("dotenv"));
const Authentication_1 = require("../services/Authentication");
// load the env
dotenv_1.default.config();
const store = new productModel_1.ProductStore();
const index = async (_req, res, next) => {
    try {
        const products = await store.index();
        res.status(http_status_codes_1.StatusCodes.OK).json(products);
    }
    catch (error) {
        next(error);
    }
};
const create = async (req, res) => {
    // @ts-ignore
    const product = {
        name: req.body.name,
        available_quantity: req.body.available_quantity,
        price: req.body.price,
    };
    try {
        const newProduct = await store.create(product);
        res.json(newProduct);
    }
    catch (err) {
        res.status(400);
        res.json(`Product could not be created.${err}`);
    }
};
const show = async (req, res) => {
    try {
        const product = await store.show(req.params.id);
        res.json(product);
    }
    catch (error) {
        res.json(`Product error.${error}`);
    }
};
const destroy = async (req, res) => {
    try {
        const deleted = await store.delete(req.body.id);
        res.json(deleted);
    }
    catch (error) {
        res.json(`Error deleting Product.${error}`);
    }
};
const update = async (req, res) => { };
const product_routes = (app) => {
    app.get('/api/products', index);
    app.get('/api/products/:id', show);
    app.post('/api/products', Authentication_1.AuthenticationService.authenticate, create);
    app.put('/api/products/:id', Authentication_1.AuthenticationService.authenticate, update);
    app.delete('/api/products/:id', Authentication_1.AuthenticationService.authenticate, destroy);
};
exports.default = product_routes;
