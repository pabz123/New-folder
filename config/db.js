import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, // 👈 this must be a string
  {
    host: process.env.DB_HOST,
    dialect: "postgres", // Change to 'postgres' if using PostgreSQL
    logging: false,
  }
);

export { sequelize };
