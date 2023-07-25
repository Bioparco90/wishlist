import Pool from 'pg-pool';
import 'dotenv/config';
import { QueryResult } from 'pg';

const pool = new Pool({
  host: 'localhost',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PW,
  database: process.env.POSTGRES_DB,
});

const checkIfTableExists = async (tableName: string): Promise<boolean> => {
  const client = await pool.connect();
  try {
    const queryResult = await client.query(
      `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = $1
      );
    `,
      [tableName]
    );

    // This query returns an obj with a boolean "exists" key
    return queryResult.rows[0].exists;
  } finally {
    client.release();
  }
};

// Tables creation handler
(async () => {
  const client = await pool.connect();
  try {
    const userTableCheck = await checkIfTableExists('users');
    const wishlistsTableCheck = await checkIfTableExists('wishlists');
    const itemsTableCheck = await checkIfTableExists('items');

    if (!userTableCheck) {
      const userQuery = `CREATE TABLE Users (
        user_id UUID PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(100) NOT NULL
      );`;
      await client.query(userQuery);
    }

    if (!wishlistsTableCheck) {
      const wishlistsQuery = `CREATE TABLE Wishlists (
        wishlist_id UUID PRIMARY KEY',
        user_id UUID NOT NULL REFERENCES Users(user_id),
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );`;
      await client.query(wishlistsQuery);
    }

    if (!itemsTableCheck) {
      const itemsQuery = `CREATE TABLE Items (
        item_id UUID PRIMARY KEY',
        wishlist_id UUID NOT NULL REFERENCES Wishlists(wishlist_id),
        item_name VARCHAR(255) NOT NULL,
        description TEXT,
        added_at TIMESTAMP NOT NULL DEFAULT NOW(),
        is_completed BOOLEAN DEFAULT FALSE
      );`;
      await client.query(itemsQuery);
    }
  } catch (e) {
    console.log(e);
  } finally {
    client.release();
  }
})();

// Database operations handler
export const query = async (text: string, values?: any[]): Promise<QueryResult> => {
  const client = await pool.connect();
  try {
    return await client.query(text, values);
  } finally {
    client.release();
  }
};
