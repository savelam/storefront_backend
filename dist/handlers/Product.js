"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield store.index();
        res.status(http_status_codes_1.StatusCodes.OK).json(products);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const product = {
        name: req.body.name,
        available_quantity: req.body.available_quantity,
        price: req.body.price,
    };
    try {
        const newProduct = yield store.create(product);
        res.json(newProduct);
    }
    catch (err) {
        res.status(400);
        res.json(`Product could not be created.${err}`);
    }
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield store.show(req.params.id);
        res.json(product);
    }
    catch (error) {
        res.json(`Product error.${error}`);
    }
});
const destroy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield store.delete(req.body.id);
        res.json(deleted);
    }
    catch (error) {
        res.json(`Error deleting Product.${error}`);
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
const product_routes = (app) => {
    app.get('/api/products', index);
    app.get('/api/products/:id', show);
    app.post('/api/products', Authentication_1.AuthenticationService.authenticate, create);
    app.put('/api/products/:id', Authentication_1.AuthenticationService.authenticate, update);
    app.delete('/api/products/:id', Authentication_1.AuthenticationService.authenticate, destroy);
};
exports.default = product_routes;
