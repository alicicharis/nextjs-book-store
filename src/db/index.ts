import { Database } from "./types";
import { Pool } from "pg";
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
  sql,
} from "kysely";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "book_store",
    host: "localhost",
    user: "postgres",
    password: "password",
    port: 5432,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
