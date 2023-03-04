"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Product_1 = __importDefault(require("../src/handlers/Product"));
const User_1 = __importDefault(require("../src/handlers/User"));
const AuthenticationRoute_1 = __importDefault(require("./handlers/AuthenticationRoute"));
// load the env
dotenv_1.default.config();
const app = (0, express_1.default)();
// define the port
const PORT = process.env.PORT || 3000;
//const corsOptions = {
//  origin: 'http://example.com',
//  optionsSuccessStatus: 200,
//}
//console.log(process.env.ENV)
//app.use(cors(corsOptions))
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.send('Hello World!');
});
// load the product route here
(0, User_1.default)(app);
(0, AuthenticationRoute_1.default)(app);
(0, Product_1.default)(app);
app.listen(PORT, function () {
    console.log(`starting app on: ${PORT}`);
});
exports.default = app;
