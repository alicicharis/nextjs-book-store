import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.object({
    id: z.number().min(1, { message: "Author is required" }),
    name: z.string().min(1, { message: "Author is required" }),
  }),
  genre: z.object({
    id: z.number().min(1, { message: "Genre is required" }),
    name: z.string().min(1, { message: "Genre is required" }),
  }),
  price: z.number().min(1, { message: "Price is required" }),
  stock: z.number().min(1, { message: "Stock is required" }),
  year: z.number().min(1950, { message: "Year is required" }),
});

export type CreateBookSchema = z.infer<typeof createBookSchema>;

export const updateBookSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.object({
    id: z.number().min(1, { message: "Author is required" }),
    name: z.string().min(1, { message: "Author is required" }),
  }),
  genre: z.object({
    id: z.number().min(1, { message: "Genre is required" }),
    name: z.string().min(1, { message: "Genre is required" }),
  }),
  price: z.number().min(1, { message: "Price is required" }),
  stock: z.number().min(1, { message: "Stock is required" }),
  year: z.number().min(1950, { message: "Year is required" }),
});

export type UpdateBookSchema = z.infer<typeof updateBookSchema>;
