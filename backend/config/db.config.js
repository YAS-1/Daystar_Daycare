import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let db;

const connectDB = async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      port: process.env.PORT,
      database: process.env.DATABASE,
    });

    console.log("Connected to MySQL database");
  } catch (err) {
    console.log("DB connection failed. Retrying in 5s...");
    setTimeout(connectDB, 5000);
  }
};

await connectDB();

export default db;