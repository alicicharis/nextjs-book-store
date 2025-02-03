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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookExtended } from "@/db/types";
import { deleteBook, searchBook } from "@/app/actions";
import { useRouter } from "next/navigation";
import CreateBookForm from "./create-book-form";
import EditBookForm from "./edit-book-form";

export function BookList({ initialBooks }: { initialBooks: BookExtended[] }) {
  const router = useRouter();

  const searchRef = useRef<HTMLInputElement>(null);

  const [books, setBooks] = useState<BookExtended[]>(initialBooks);
  const [editingBook, setEditingBook] = useState<BookExtended | null>(null);

  const handleUpdateBook = async () => {
    // const res = await updateBook({
    //   id: editingBook?.id,
    //   title: editingBook?.title,
    //   price: editingBook?.price,
    //   updated_at: new Date(),
    // });
    // if (res) {
    //   setEditingBook(null);
    //   setBooks(
    //     books.map((book) => (book.id === editingBook?.id ? editingBook : book))
    //   );
    //   router.refresh();
    // }
  };

  const handleDeleteBook = async (id: number) => {
    // add fetch to fill removed books place in the table
    const res = await deleteBook(id);

    if (res) {
      setBooks(books.filter((book) => book.id !== id));
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
                  <EditBookForm book={book} />
                  {/* <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => setEditingBook(book)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Book</DialogTitle>
                        <DialogDescription>
                          Make changes to the book here. Click save when you're
                          done.
                        </DialogDescription>
                      </DialogHeader>
                      {editingBook && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-title" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="edit-title"
                              value={editingBook.title}
                              onChange={(e) =>
                                setEditingBook({
                                  ...editingBook,
                                  title: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-price" className="text-right">
                              Price
                            </Label>
                            <Input
                              id="edit-price"
                              value={editingBook.price}
                              onChange={(e) =>
                                setEditingBook({
                                  ...editingBook,
                                  price: Number(e.target.value),
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button type="submit" onClick={handleUpdateBook}>
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog> */}
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteBook(book.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
