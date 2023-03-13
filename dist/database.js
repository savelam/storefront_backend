"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { DEV_DB_HOST, DEV_DB, DEV_DB_USER, DEV_DB_PASS, DEV_DB_PORT, TEST_DB_HOST, TEST_DB, TEST_DB_USER, TEST_DB_PASS, TEST_DB_PORT, NODE_ENV } = process.env;
let client;
if (NODE_ENV === 'dev') {
    client = new pg_1.Pool({
        host: DEV_DB_HOST,
        user: DEV_DB_USER,
        database: DEV_DB,
        password: DEV_DB_PASS,
        port: Number(DEV_DB_PORT)
    });
}
else {
    client = new pg_1.Pool({
        host: TEST_DB_HOST,
        user: TEST_DB_USER,
        database: TEST_DB,
        password: TEST_DB_PASS,
        port: Number(TEST_DB_PORT)
    });
}
const createDbIfNotExists = async (database) => {
    const conn = await client.connect();
    const db = await conn.query(`SELECT FROM pg_database WHERE datname = '${database}'`);
    if (db.rowCount <= 0) {
        await conn.query(`CREATE DATABASE ${database}`);
    }
};
const initDb = async () => {
    const DEV_DB = process.env.DEV_DB || 'postgres';
    const { TEST_DB } = process.env;
    createDbIfNotExists(DEV_DB);
    const conn = await client.connect();
    const migrationsPath = path_1.default.join(__dirname, '../migrations/sqls');
    const migrations = fs_1.default.readdirSync(migrationsPath);
    for (const migration of migrations) {
        const filePath = `${migrationsPath}/${migration}`;
        if (path_1.default.basename(filePath).split('-').includes('up.sql')) {
            const sql = fs_1.default.readFileSync(filePath).toString();
            await client.query(sql);
        }
    }
    conn.release();
    createDbIfNotExists(TEST_DB);
};
exports.initDb = initDb;
exports.default = client;
