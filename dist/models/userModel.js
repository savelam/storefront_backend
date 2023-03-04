"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../database"));
const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;
class UserModel {
    // all users
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Unable to read users: ${err}`);
        }
    }
    // show user based on user id
    async show(id) {
        const conn = await database_1.default.connect();
        const sql = 'SELECT id, first_name , last_name FROM users WHERE id=($1)';
        const result = await conn.query(sql, [id]);
        conn.release();
        return result.rows[0];
    }
    async create(u) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'INSERT INTO users(first_name,last_name,username,password)  VALUES($1, $2,$3,$4) RETURNING id, first_name,last_name,username';
            const hash = bcrypt_1.default.hashSync(u.password + BCRYPT_PASSWORD, parseInt(SALT_ROUNDS));
            const result = await conn.query(sql, [
                u.first_name,
                u.last_name,
                u.username,
                hash,
            ]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Unable to create user (${u.username}): ${err}`);
        }
    }
    async authenticate(username, password) {
        const conn = await database_1.default.connect();
        const sql = 'SELECT password_digest FROM users WHERE username=($1)';
        const result = await conn.query(sql, [username]);
        console.log(password + BCRYPT_PASSWORD);
        if (result.rows.length) {
            const user = result.rows[0];
            console.log(user);
            if (bcrypt_1.default.compareSync(password + BCRYPT_PASSWORD, user.password_digest)) {
                return user;
            }
        }
        return null;
    }
}
exports.UserModel = UserModel;
