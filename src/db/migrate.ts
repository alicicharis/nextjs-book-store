import { Kysely, sql } from "kysely";
import { db } from ".";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("authors")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("bio", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("genres")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
  await db.schema

    .createTable("books")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("author_id", "integer", (col) =>
      col.references("authors.id").notNull()
    )

    .addColumn("genre_id", "integer", (col) =>
      col.references("genres.id").notNull()
    )
    .addColumn("price", "integer", (col) => col.notNull())
    .addColumn("stock", "integer", (col) => col.notNull())
    .addColumn("year", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("customers")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("email", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("orders")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("customer_id", "integer", (col) =>
      col.references("customers.id").notNull()
    )
    .addColumn("total_price", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();

  await db.schema
    .createTable("order_items")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("order_id", "integer", (col) =>
      col.references("orders.id").notNull()
    )
    .addColumn("book_id", "integer", (col) =>
      col.references("books.id").notNull()
    )
    .addColumn("quantity", "integer", (col) => col.notNull())
    .addColumn("price", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("authors").execute();
  await db.schema.dropTable("books").execute();
  await db.schema.dropTable("customers").execute();
  await db.schema.dropTable("orders").execute();
  await db.schema.dropTable("order_items").execute();
  await db.schema.dropTable("genres").execute();
}

(async () => {
  await up(db);
  //   await down(db);
  process.exit(0);
})();
