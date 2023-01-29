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
exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// @ts-ignore
const database_1 = __importDefault(require("../database"));
const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;
class UserModel {
    // all users
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const conn = yield database_1.default.connect();
            const sql = 'SELECT id, first_name, last_name  FROM users';
            const result = yield conn.query(sql);
            conn.release();
            return result.rows;
        });
    }
    // show user based on user id
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const conn = yield database_1.default.connect();
            const sql = 'SELECT id, first_name , last_name FROM users WHERE id=($1)';
            const result = yield conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        });
    }
    create(u) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // @ts-ignore
                const conn = yield database_1.default.connect();
                const sql = 'INSERT INTO users(first_name,last_name,username,password)  VALUES($1, $2,$3,$4) RETURNING id, first_name,last_name,username';
                const hash = bcrypt_1.default.hashSync(u.password + BCRYPT_PASSWORD, parseInt(SALT_ROUNDS));
                const result = yield conn.query(sql, [
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
        });
    }
    authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const conn = yield database_1.default.connect();
            const sql = 'SELECT password_digest FROM users WHERE username=($1)';
            const result = yield conn.query(sql, [username]);
            console.log(password + BCRYPT_PASSWORD);
            if (result.rows.length) {
                const user = result.rows[0];
                console.log(user);
                if (bcrypt_1.default.compareSync(password + BCRYPT_PASSWORD, user.password_digest)) {
                    return user;
                }
            }
            return null;
        });
    }
}
exports.UserModel = UserModel;
