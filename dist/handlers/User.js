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
const userModel_1 = require("../models/userModel");
const dotenv_1 = __importDefault(require("dotenv"));
const http_status_codes_1 = require("http-status-codes");
const Authentication_1 = require("../services/Authentication");
// load the env
dotenv_1.default.config();
const store = new userModel_1.UserModel();
const index = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield store.index();
        return res.status(http_status_codes_1.StatusCodes.OK).json(users);
    }
    catch (error) {
        next(error);
    }
});
const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield store.show(req.params.id);
        return res.status(http_status_codes_1.StatusCodes.OK).json(user);
    }
    catch (error) {
        next(error);
    }
});
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield store.create(req.body);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(user);
    }
    catch (error) {
        next(error);
    }
});
const user_routes = (app) => {
    app.get('/api/users', Authentication_1.AuthenticationService.authenticate, index);
    app.get('/api/users/:id', Authentication_1.AuthenticationService.authenticate, show);
    app.post('/api/users', Authentication_1.AuthenticationService.authenticate, create);
};
exports.default = user_routes;
