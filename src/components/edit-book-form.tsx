"use client";

import { updateBookSchema, UpdateBookSchema } from "@/app/validation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Author, BookExtended, Genre, UpdateBookPayload } from "@/db/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";
import { useCallback, useState } from "react";
import { Input } from "./ui/input";
import { getAuthorsByName, getGenresByName, updateBook } from "@/app/actions";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";

const EditBookForm = ({
  book,
  setBooks,
}: {
  book: BookExtended;
  setBooks: (books: any) => void;
}) => {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const {
    suggestions: authorSuggestions,
    setSuggestions: setAuthorSuggestions,
    isInputFocused: isAuthorInputFocused,
    setIsInputFocused: setIsAuthorInputFocused,
    debouncedSearch: debouncedAuthorSearch,
  } = useDebounceSearch(getAuthorsByName);

  const {
    suggestions: genreSuggestions,
    setSuggestions: setGenreSuggestions,
    isInputFocused: isGenreInputFocused,
    setIsInputFocused: setIsGenreInputFocused,
    debouncedSearch: debouncedGenreSearch,
  } = useDebounceSearch(getGenresByName);

  const form = useForm<UpdateBookSchema>({
    resolver: zodResolver(updateBookSchema),
    defaultValues: {
      title: book.title,
      author: {
        id: book.author_id,
        name: book.authorName,
      },
      genre: {
        id: book.genre_id,
        name: book.genreName,
      },
      price: book.price,
      stock: book.stock,
      year: book.year,
    },
  });

  const handleUpdateBook = async (data: UpdateBookSchema) => {
    const updateBookPayload: UpdateBookPayload = {
      id: book.id,
      title: data.title,
      author_id: data.author.id,
      genre_id: data.genre.id,
      price: data.price,
      stock: data.stock,
      year: data.year,
      updated_at: new Date(),
    };

    const res = await updateBook(updateBookPayload);

    if (res) {
      setBooks((prevState: any) => {
        const updatedBooks = prevState.map((prevBook: BookExtended) =>
          prevBook.id === updateBookPayload.id
            ? {
                ...prevBook,
                title: updateBookPayload.title,
                author_id: updateBookPayload.author_id,
                genre_id: updateBookPayload.genre_id,
                price: updateBookPayload.price,
                stock: updateBookPayload.stock,
                year: updateBookPayload.year,
                updated_at: updateBookPayload.updated_at,
                authorName: data.author.name,
                genreName: data.genre.name,
              }
            : prevBook
        );
        return updatedBooks;
      });

      setEditModalOpen(false);
    }
  };

  return (
    <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-2">
          <Pencil className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit book</DialogTitle>
          <DialogDescription>
            Edit the details of the book here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateBook)}>
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
          <Button
            type="submit"
            onMouseDown={form.handleSubmit(handleUpdateBook)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookForm;
