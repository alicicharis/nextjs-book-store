import {
  ColumnType,
  Insertable,
  Selectable,
  Updateable,
  Generated,
} from "kysely";

export interface Database {
  authors: AuthorsTable;
  books: BooksTable;
  customers: CustomersTable;
  orders: OrdersTable;
  order_items: OrderItemsTable;
  genres: GenresTable;
}

export interface BooksTable {
  id: Generated<number>;
  title: ColumnType<string>;
  author_id: ColumnType<number>;
  genre_id: ColumnType<number>;
  price: ColumnType<number>;
  stock: ColumnType<number>;
  year: ColumnType<number>;
  created_at: ColumnType<Date>;
  updated_at: ColumnType<Date>;
}

export interface AuthorsTable {
  id: Generated<number>;
  name: ColumnType<string>;
  bio: ColumnType<string>;
  created_at: ColumnType<Date>;
  updated_at: ColumnType<Date>;
}

export interface GenresTable {
  id: Generated<number>;
  name: ColumnType<string>;
  created_at: ColumnType<Date>;
  updated_at: ColumnType<Date>;
}

export interface CustomersTable {
  id: Generated<number>;
  name: ColumnType<string>;
  email: ColumnType<string>;
  created_at: ColumnType<Date>;
  updated_at: ColumnType<Date>;
}

export interface OrdersTable {
  id: Generated<number>;
  customer_id: ColumnType<number>;
  total_price: ColumnType<number>;
  created_at: ColumnType<Date>;
  updated_at: ColumnType<Date>;
}

export interface OrderItemsTable {
  id: Generated<number>;
  order_id: ColumnType<number>;
  book_id: ColumnType<number>;
  quantity: ColumnType<number>;
  price: ColumnType<number>;
  created_at: ColumnType<Date>;
  updated_at: ColumnType<Date>;
}

export type Book = Selectable<BooksTable>;
export type NewBook = Insertable<BooksTable>;
export type CreateBookPayload = Insertable<BooksTable>;
export type UpdateBookPayload = Updateable<BooksTable>;
export type Author = Selectable<AuthorsTable>;
export type NewAuthor = Insertable<AuthorsTable>;
export type UpdateAuthor = Updateable<AuthorsTable>;
export type Order = Selectable<OrdersTable>;
export type NewOrder = Insertable<OrdersTable>;
export type UpdateOrder = Updateable<OrdersTable>;
export type OrderItem = Selectable<OrderItemsTable>;
export type NewOrderItem = Insertable<OrderItemsTable>;
export type UpdateOrderItem = Updateable<OrderItemsTable>;
export type Customer = Selectable<CustomersTable>;
export type NewCustomer = Insertable<CustomersTable>;
export type UpdateCustomer = Updateable<CustomersTable>;
export type Genre = Selectable<GenresTable>;
export type NewGenre = Insertable<GenresTable>;
export type UpdateGenre = Updateable<GenresTable>;

export type BookWithAuthor = {
  id: number;
  title: string;
  price: number;
  name: string;
  created_at: Date;
  updated_at: Date;
};

export type BookExtended = Selectable<BooksTable> & {
  authorName: string;
  genreName: string;
};
