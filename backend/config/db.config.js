import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

const db = await mysql.createConnection({
    host:  process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    database: process.env.DATABASE
});

console.log('Connected to MySQL database');

export default db;