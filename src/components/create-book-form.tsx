"use client";

import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { createBookSchema, CreateBookSchema } from "@/app/validation";
import { Author, BookExtended, CreateBookPayload, Genre } from "@/db/types";
import { createBook, getAuthorsByName, getGenresByName } from "@/app/actions";
import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateBookForm({
  setBooks,
}: {
  setBooks: (books: any) => any;
}) {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
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
      setBooks((prevState: BookExtended[]) => [
        {
          id: id,
          title: data.title,
          authorName: data.author.name,
          genreName: data.genre.name,
          price: data.price,
          stock: data.stock,
          year: data.year,
          created_at: createdAt,
          updated_at: updatedAt,
        },
        ...prevState,
      ]);
      setCreateModalOpen(false);
    }
  };

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

  return (
    <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => form.reset()}>
          <Plus className="mr-1 h-5 w-5" /> Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new book</DialogTitle>
          <DialogDescription>
            Enter the details of the new book here. Click save when you're done.
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
                    {isAuthorInputFocused && authorSuggestions.length > 0 && (
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
          <Button type="submit" onMouseDown={form.handleSubmit(handleAddBook)}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
