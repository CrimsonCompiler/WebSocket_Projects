import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DBNAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});

pool.on("connect", () => {
  console.log("Database is connected... ✨");
});

pool.on("error", () => {
  console.log("Database connection error... ⚠️");
});

export default pool;
