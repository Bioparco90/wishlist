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
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const db_utility_1 = require("./db/db-utility");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.send('ciao');
});
app.get('/createTable', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const insertQuery = `INSERT INTO users VALUES ($1, $2, $3)`;
    const values = [1, 'Wolf', 33];
    try {
        yield (0, db_utility_1.query)(insertQuery, values);
    }
    catch (e) {
        console.log(e);
    }
    res.send('Please check');
}));
app.listen(port, () => console.log(`Server running on port ${port}`));
