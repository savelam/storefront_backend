"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_TEST_DB, ENV, } = process.env;
let client;
console.log(ENV);
if (ENV === 'test') {
    client = new pg_1.Pool({
        host: DATABASE_HOST,
        database: DATABASE_TEST_DB,
        user: DATABASE_USER,
        password: DATABASE_PASSWORD,
    });
}
if (ENV === 'dev') {
    client = new pg_1.Pool({
        host: DATABASE_HOST,
        database: DATABASE_NAME,
        user: DATABASE_USER,
        password: DATABASE_PASSWORD,
    });
}
exports.default = client;
