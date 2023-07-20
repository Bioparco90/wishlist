import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { query } from '../db/db-utility';

const auth = Router();

auth.get('/', (req, res) => {
  res.json('GET is working');
});

auth.post('/login', (req, res) => {
  res.json('Not yet implemented');
});

auth.post('/register', async (req, res) => {
  // Retreiving data
  const user_id = uuidv4();
  const { username, email, password } = req.body;

  //Password hashing
  const saltRounds = 11;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const queryString = `INSERT INTO users VALUES ($1, $2, $3, $4)`;
  const queryValues = [user_id, username, email, hashedPassword];

  try {
    await query(queryString, queryValues);
    res.json({ message: 'User registered' });
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
});

export default auth;
