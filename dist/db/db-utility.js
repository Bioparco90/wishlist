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
exports.query = void 0;
const pg_pool_1 = __importDefault(require("pg-pool"));
require("dotenv/config");
const pool = new pg_pool_1.default({
    host: 'localhost',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PW,
    database: process.env.POSTGRES_DB,
});
const checkIfTableExists = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const queryResult = yield client.query(`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = $1
      );
    `, [tableName]);
        // La query restituirà un oggetto con la chiave 'exists' che sarà un booleano
        return queryResult.rows[0].exists;
    }
    finally {
        client.release();
    }
});
// Creazione Tables
(() => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const userTableCheck = yield checkIfTableExists('users');
        if (!userTableCheck) {
            yield client.query('CREATE TABLE Users (id SERIAL PRIMARY KEY, nickname VARCHAR(50) NOT NULL, password VARCHAR(50) NOT NULL)');
        }
    }
    catch (e) {
        console.log(e);
    }
}))();
const query = (text, values) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        return yield client.query(text, values);
    }
    finally {
        client.release();
    }
});
exports.query = query;
