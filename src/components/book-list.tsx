"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { BookExtended } from "@/db/types";
import { deleteBook, getMissingBooks, searchBook } from "@/app/actions";
import { useRouter } from "next/navigation";
import CreateBookForm from "./create-book-form";
import EditBookForm from "./edit-book-form";
import { Trash2 } from "lucide-react";

export function BookList({ initialBooks }: { initialBooks: BookExtended[] }) {
  const router = useRouter();

  const searchRef = useRef<HTMLInputElement>(null);

  const [books, setBooks] = useState<BookExtended[]>(initialBooks);

  const handleDeleteBook = async (id: number) => {
    const res = await deleteBook(id);

    if (res) {
      const remainingBooks = books.filter((book) => book.id !== id);
      const missingBooks = await getMissingBooks(
        remainingBooks.map((book) => book.id)
      );

      setBooks((prevState) => {
        const newState = prevState.filter((book) => book.id !== id);
        if (missingBooks) {
          newState.push(missingBooks);
        }
        return newState;
      });

      router.refresh();
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchValue = searchRef.current?.value;

    if (!searchValue) {
      setBooks(initialBooks);
      return;
    }

    const res = await searchBook(searchValue);

    setBooks(res);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Book List</h2>
          <form className="flex items-center gap-2" onSubmit={handleSearch}>
            <Input
              ref={searchRef}
              type="text"
              placeholder="Search"
              className="w-[450px]"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
        <CreateBookForm setBooks={setBooks} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books?.length &&
            books.map((book: BookExtended) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.authorName}</TableCell>
                <TableCell>{new Date(book.created_at).getFullYear()}</TableCell>
                <TableCell>${book.price}</TableCell>
                <TableCell>
                  <EditBookForm book={book} setBooks={setBooks} />
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
