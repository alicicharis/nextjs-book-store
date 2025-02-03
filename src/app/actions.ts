"use server";

import { db } from "@/db";
import {
  Author,
  BookExtended,
  BookWithAuthor,
  CreateBookPayload,
  Genre,
  UpdateBook,
} from "@/db/types";
import { sql } from "kysely";

export const updateBook = async (book: UpdateBook) => {
  await db.updateTable("books").set(book).where("id", "=", book.id!).execute();

  return true;
};

export const deleteBook = async (id: number) => {
  await db.deleteFrom("books").where("id", "=", id).execute();

  return true;
};

export const createBook = async (book: CreateBookPayload) => {
  const res = await db
    .insertInto("books")
    .values(book)
    .returning("id")
    .execute();

  return res?.[0]?.id;
};

export const searchBook = async (search: string): Promise<BookExtended[]> => {
  const books = await db
    .selectFrom("books")
    .innerJoin("authors", "authors.id", "books.author_id")
    .innerJoin("genres", "genres.id", "books.genre_id")
    .where(sql`LOWER(books.title)`, "like", `%${search.toLowerCase()}%`)
    .select([
      "books.id",
      "books.title",
      "books.price",
      "books.created_at",
      "books.updated_at",
      "books.stock",
      "books.year",
      "books.author_id",
      "books.genre_id",
      "authors.name as authorName",
      "genres.name as genreName",
    ])
    .limit(10)
    .orderBy("books.created_at", "desc")
    .execute();

  if (books.length === 0) return [];

  return books;
};

export const getAuthorsByName = async (
  name: string
): Promise<Partial<Author>[]> => {
  const authors = await db
    .selectFrom("authors")
    .where(sql`LOWER(name)`, "like", `%${name}%`)
    .select(["id", "name", "bio"])
    .execute();

  return authors;
};

export const getGenresByName = async (
  name: string
): Promise<Partial<Genre>[]> => {
  const genres = await db
    .selectFrom("genres")
    .where(sql`LOWER(name)`, "like", `%${name}%`)
    .select(["id", "name"])
    .execute();

  return genres;
};
