import express from 'express';
import 'dotenv/config';
import { query } from './db/db-utility';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('ciao');
});

app.get('/createTable', async (req, res) => {
  const insertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`;
  const values = ['Wolf', "monnimarco90@gmail.com", "pippo"];
  try {
    await query(insertQuery, values);
  } catch (e) {
    console.log(e);
  }
  res.send('Please check');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
