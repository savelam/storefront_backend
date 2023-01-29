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
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const Authentication_1 = require("../services/Authentication");
// route to handle authentication
const generateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = Authentication_1.AuthenticationService.generateToken(req.query.password /// get the password as string
        );
        res.status(http_status_codes_1.StatusCodes.OK).json(token);
    }
    catch (error) {
        next(error);
    }
});
const authenticatitonRoutes = (app) => {
    app.get('/api/auth', generateToken);
};
exports.default = authenticatitonRoutes;
