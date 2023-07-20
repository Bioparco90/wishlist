import Pool from 'pg-pool';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import { QueryResult } from 'pg';

const pool = new Pool({
  host: 'localhost', // Utilizza il nome del servizio Docker come hostname
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

    // La query restituirà un oggetto con la chiave 'exists' che sarà un booleano
    return queryResult.rows[0].exists;
  } finally {
    client.release();
  }
};

// Creazione Tables
(async () => {
  const client = await pool.connect();
  try {
    const userTableCheck = await checkIfTableExists('users');

    if (!userTableCheck) {
      const userQuery = `CREATE TABLE Users (
        user_id UUID DEFAULT '${uuidv4()}' PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        password VARCHAR(100) NOT NULL
      );`;
      await client.query(userQuery);
    }
  } catch (e) {
    console.log(e);
  }
})();

export const query = async (
  text: string,
  values?: any[]
): Promise<QueryResult> => {
  const client = await pool.connect();
  try {
    return await client.query(text, values);
  } finally {
    client.release();
  }
};
