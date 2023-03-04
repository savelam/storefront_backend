"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = require("../models/userModel");
const dotenv_1 = __importDefault(require("dotenv"));
const http_status_codes_1 = require("http-status-codes");
const Authentication_1 = require("../services/Authentication");
// load the env
dotenv_1.default.config();
const store = new userModel_1.UserModel();
const index = async (_req, res, next) => {
    try {
        const users = await store.index();
        return res.status(http_status_codes_1.StatusCodes.OK).json(users);
    }
    catch (error) {
        next(error);
    }
};
const show = async (req, res, next) => {
    try {
        const user = await store.show(req.params.id);
        return res.status(http_status_codes_1.StatusCodes.OK).json(user);
    }
    catch (error) {
        next(error);
    }
};
const create = async (req, res, next) => {
    try {
        const user = await store.create(req.body);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(user);
    }
    catch (error) {
        next(error);
    }
};
const user_routes = (app) => {
    app.get('/api/users', Authentication_1.AuthenticationService.authenticate, index);
    app.get('/api/users/:id', Authentication_1.AuthenticationService.authenticate, show);
    app.post('/api/users', Authentication_1.AuthenticationService.authenticate, create);
};
exports.default = user_routes;
