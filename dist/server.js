"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./handlers/userRoutes"));
const categoryRoutes_1 = __importDefault(require("./handlers/categoryRoutes"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const productRoutes_1 = __importDefault(require("./handlers/productRoutes"));
const orderRoutes_1 = __importDefault(require("./handlers/orderRoutes"));
const authRoutes_1 = __importDefault(require("./handlers/authRoutes"));
const database_1 = require("./database");
const not_found_1 = __importDefault(require("./middleware/not-found"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
let PORT;
if (process.env.NODE_ENV == 'dev') {
    PORT = process.env.DEV_SERVER_PORT;
}
else if (process.env.PORT == 'test') {
    PORT = process.env.TEST_SERVER_PORT;
}
else {
    PORT = '5000';
}
const start = async () => {
    try {
        (0, database_1.initDb)();
        app.listen(PORT, async function () {
            console.log(`starting app on: ${PORT}`);
        });
    }
    catch (error) {
        console.log('Failed to start server: ' + error);
    }
};
start();
(0, userRoutes_1.default)(app);
(0, categoryRoutes_1.default)(app);
(0, productRoutes_1.default)(app);
(0, orderRoutes_1.default)(app);
(0, authRoutes_1.default)(app);
app.use(error_handler_1.default);
app.use(not_found_1.default);
exports.default = app;
