"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { DEFAULT_PASS, TOKEN_SECRET } = process.env;
class AuthenticationService {
    /**
     * @param default password to authenticate user
     */
    static generateToken(password) {
        console.log(password);
        if (password !== DEFAULT_PASS) {
            throw new Error('Password not correct.');
        }
        return jsonwebtoken_1.default.sign({}, TOKEN_SECRET, {
            expiresIn: '2h', // let it expire in 2 hours
        });
    }
    static async authenticate(req, _res, next) {
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new Error('Please provide token'));
        }
        const token = authHeader.split(' ')[1];
        console.log(token);
        console.log(TOKEN_SECRET);
        try {
            const verify = jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
            console.log(verify);
            return next();
        }
        catch (error) {
            return next(new Error('You are not authorized user'));
        }
    }
}
exports.AuthenticationService = AuthenticationService;
