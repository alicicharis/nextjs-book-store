import type { Metadata } from "next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookList } from "@/components/book-list";
import { db } from "@/db";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Book Store Admin Dashboard",
};

export default async function DashboardPage() {
  const books = await db
    .selectFrom("books")
    .innerJoin("authors", "authors.id", "books.author_id")
    .innerJoin("genres", "genres.id", "books.genre_id")
    .select([
      "books.id",
      "books.title",
      "books.price",
      "books.created_at",
      "books.updated_at",
      "books.stock",
      "books.year",
      "authors.name as authorName",
      "authors.id as author_id",
      "genres.name as genreName",
      "genres.id as genre_id",
    ])
    .orderBy("books.created_at", "desc")
    .limit(10)
    .execute();

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="books" className="space-y-4">
            <TabsList>
              <TabsTrigger value="books">Books</TabsTrigger>
            </TabsList>
            <TabsContent value="books" className="space-y-4">
              <BookList initialBooks={books} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
