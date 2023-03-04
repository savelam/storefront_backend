"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const Authentication_1 = require("../services/Authentication");
// route to handle authentication
const generateToken = async (req, res, next) => {
    try {
        const token = Authentication_1.AuthenticationService.generateToken(req.query.password /// get the password as string
        );
        res.status(http_status_codes_1.StatusCodes.OK).json(token);
    }
    catch (error) {
        next(error);
    }
};
const authenticatitonRoutes = (app) => {
    app.get('/api/auth', generateToken);
};
exports.default = authenticatitonRoutes;
