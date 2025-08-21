// src/db/knex.ts
import knex, { Knex } from "knex";
import * as dotenv from "dotenv";
dotenv.config();

export const db: Knex = knex({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    },
    pool: { min: 2, max: 10 },
});
