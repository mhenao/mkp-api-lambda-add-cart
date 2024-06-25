import dotenv from "dotenv";

dotenv.config();

const host = process.env.DB_HOST || "";
const user = process.env.DB_USER || "";
const password = process.env.DB_PASSWORD || "";
const database = process.env.DB_NAME || "";
const logLevel = process.env.LOG_LEVEL || "info";

export default {
  host,
  user,
  password,
  database,
  logLevel,
};

