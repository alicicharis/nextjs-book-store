"use client";

import { useRef, useState, useCallback } from "react";
import { Plus } from "lucide-react";
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
import { Author, BookWithAuthor, CreateBookPayload, Genre } from "@/db/types";
import {
  createBook,
  deleteBook,
  getAuthorsByName,
  getGenresByName,
  searchBook,
  updateBook,
} from "@/app/actions";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { createBookSchema, CreateBookSchema } from "@/app/validation";

export function BookList({ initialBooks }: { initialBooks: BookWithAuthor[] }) {
  const router = useRouter();

  const form = useForm<CreateBookSchema>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      author: {
        id: 0,
        name: "",
      },
      genre: {
        id: 0,
        name: "",
      },
      price: 1,
      stock: 1,
      year: 2025,
    },
  });

  const searchRef = useRef<HTMLInputElement>(null);

  const [books, setBooks] = useState<BookWithAuthor[]>(initialBooks);
  const [editingBook, setEditingBook] = useState<BookWithAuthor | null>(null);
  const [authorSuggestions, setAuthorSuggestions] = useState<Partial<Author>[]>(
    []
  );
  const [genreSuggestions, setGenreSuggestions] = useState<Partial<Genre>[]>(
    []
  );
  const [isAuthorInputFocused, setIsAuthorInputFocused] =
    useState<boolean>(false);
  const [isGenreInputFocused, setIsGenreInputFocused] =
    useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const debouncedAuthorSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length < 3) {
        setAuthorSuggestions([]);
        return;
      }

      const authors = await getAuthorsByName(searchTerm);

      if (authors.length > 0) {
        setAuthorSuggestions(authors);
      }
    }, 500),
    []
  );

  const debouncedGenreSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length < 3) {
        setGenreSuggestions([]);
        return;
      }

      const genres = await getGenresByName(searchTerm);

      if (genres.length > 0) {
        setGenreSuggestions(genres);
      }
    }, 500),
    []
  );

  const handleAddBook = async (data: CreateBookSchema) => {
    const createdAt = new Date();
    const updatedAt = new Date();

    const createBookPayload: CreateBookPayload = {
      title: data.title,
      author_id: data.author.id,
      genre_id: data.genre.id,
      price: data.price,
      stock: data.stock,
      year: data.year,
      created_at: createdAt,
      updated_at: updatedAt,
    };

    const id = await createBook(createBookPayload);
    if (id) {
      setBooks((prevState) => [
        {
          id: id,
          title: data.title,
          name: data.author.name,
          price: data.price,
          stock: data.stock,
          year: data.year,
          created_at: createdAt,
          updated_at: updatedAt,
        },
        ...prevState,
      ]);
      router.refresh();
    }
  };

  const handleUpdateBook = async () => {
    const res = await updateBook({
      id: editingBook?.id,
      title: editingBook?.title,
      price: editingBook?.price,
      updated_at: new Date(),
    });

    if (res) {
      setEditingBook(null);
      setBooks(
        books.map((book) => (book.id === editingBook?.id ? editingBook : book))
      );
      router.refresh();
    }
  };

  const handleDeleteBook = async (id: number) => {
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

    console.log("Res here", res);

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
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset()}>
              <Plus className="mr-1 h-5 w-5" /> Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>
                Enter the details of the new book here. Click save when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddBook)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Title" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value.name}
                            placeholder="Author name"
                            onFocus={() => setIsAuthorInputFocused(true)}
                            onBlur={() => setIsAuthorInputFocused(false)}
                            onChange={(e) => {
                              field.onChange({
                                name: e.target.value,
                              });
                              debouncedAuthorSearch(e.target.value);
                            }}
                          />
                        </FormControl>
                        {isAuthorInputFocused &&
                          authorSuggestions.length > 0 && (
                            <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10">
                              {authorSuggestions.map((author) => (
                                <div
                                  key={author.id}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                  onMouseDown={() => {
                                    if (!author.id || !author.name) return;
                                    field.onChange({
                                      id: author.id,
                                      name: author.name,
                                      length: author.name.length,
                                    });
                                    setAuthorSuggestions([]);
                                  }}
                                >
                                  <p className="text-sm">{author.name}</p>
                                </div>
                              ))}
                            </div>
                          )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <FormLabel>Genre</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value.name}
                            placeholder="Genre name"
                            onFocus={() => setIsGenreInputFocused(true)}
                            onBlur={() => setIsGenreInputFocused(false)}
                            onChange={(e) => {
                              field.onChange({ name: e.target.value });
                              debouncedGenreSearch(e.target.value);
                            }}
                          />
                        </FormControl>
                        {isGenreInputFocused && genreSuggestions.length > 0 && (
                          <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10">
                            {genreSuggestions.map((genre) => (
                              <div
                                key={genre.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onMouseDown={() => {
                                  if (!genre.id || !genre.name) return;
                                  field.onChange({
                                    id: genre.id,
                                    name: genre.name,
                                  });
                                  setGenreSuggestions([]);
                                }}
                              >
                                <p className="text-sm">{genre.name}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Book price"
                            type="number"
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Book stock"
                            type="number"
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Book year"
                            type="number"
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onMouseDown={form.handleSubmit(handleAddBook)}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            books.map((book: BookWithAuthor) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.name}</TableCell>
                <TableCell>{new Date(book.created_at).getFullYear()}</TableCell>
                <TableCell>${book.price}</TableCell>
                <TableCell>
                  <Dialog>
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
                          {/* <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-author" className="text-right">
                            Author
                          </Label>
                          <Input
                            id="edit-author"
                            value={editingBook.author}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                author: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-year" className="text-right">
                            Year
                          </Label>
                          <Input
                            id="edit-year"
                            value={editingBook.year}
                            onChange={(e) =>
                              setEditingBook({
                                ...editingBook,
                                year: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div> */}
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
                  </Dialog>
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
