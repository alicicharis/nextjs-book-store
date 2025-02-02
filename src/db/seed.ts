import { db } from "./index";
import { faker } from "@faker-js/faker";

async function seed() {
  await db.deleteFrom("order_items").execute();
  await db.deleteFrom("orders").execute();
  await db.deleteFrom("books").execute();
  await db.deleteFrom("authors").execute();
  await db.deleteFrom("genres").execute();
  await db.deleteFrom("customers").execute();

  const authorIds = [];
  for (let i = 0; i < 20; i++) {
    const [author] = await db
      .insertInto("authors")
      .values({
        name: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
      })
      .returning("id")
      .execute();
    authorIds.push(author.id);
  }

  const genreIds = [];
  const genres = [
    "Fiction",
    "Mystery",
    "Science Fiction",
    "Romance",
    "Fantasy",
    "Biography",
    "History",
    "Self-Help",
    "Business",
    "Technology",
  ];
  for (let i = 0; i < genres.length; i++) {
    const [genreRow] = await db
      .insertInto("genres")
      .values({
        name: genres[i],
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
      })
      .returning("id")
      .execute();
    genreIds.push(genreRow.id);
  }

  const bookIds = [];
  for (let i = 0; i < 100; i++) {
    const [book] = await db
      .insertInto("books")
      .values({
        title: faker.commerce.productName(),
        author_id: faker.helpers.arrayElement(authorIds),
        genre_id: faker.helpers.arrayElement(genreIds),
        price: faker.number.int({ min: 10, max: 100 }),
        stock: faker.number.int({ min: 0, max: 100 }),
        year: faker.number.int({ min: 1900, max: 2024 }),
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
      })
      .returning("id")
      .execute();
    bookIds.push(book.id);
  }

  const customerIds = [];
  for (let i = 0; i < 50; i++) {
    const [customer] = await db
      .insertInto("customers")
      .values({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        created_at: new Date(faker.date.past()),
        updated_at: new Date(faker.date.recent()),
      })
      .returning("id")
      .execute();
    customerIds.push(customer.id);
  }

  for (let i = 0; i < 100; i++) {
    const [order] = await db
      .insertInto("orders")
      .values({
        customer_id: faker.helpers.arrayElement(customerIds),
        total_price: 0,
        created_at: new Date(faker.date.recent()),
        updated_at: new Date(faker.date.recent()),
      })
      .returning("id")
      .execute();

    const numberOfItems = faker.number.int({ min: 1, max: 5 });
    let totalPrice = 0;

    for (let j = 0; j < numberOfItems; j++) {
      const quantity = faker.number.int({ min: 1, max: 5 });
      const bookPrice = faker.number.int({ min: 10, max: 100 });
      const itemPrice = quantity * bookPrice;
      totalPrice += itemPrice;

      await db
        .insertInto("order_items")
        .values({
          order_id: order.id,
          book_id: faker.helpers.arrayElement(bookIds),
          quantity: quantity,
          price: itemPrice,
          created_at: new Date(faker.date.past()),
          updated_at: new Date(faker.date.recent()),
        })
        .execute();
    }

    await db
      .updateTable("orders")
      .set({ total_price: totalPrice })
      .where("id", "=", order.id)
      .execute();
  }

  console.log("Seed completed successfully!");
  db.destroy();
}

seed().catch(console.error);
