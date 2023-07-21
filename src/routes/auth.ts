import { Response, NextFunction, Router, Request } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { query } from '../db/db-utility';
import { User } from '../types/types';

const auth = Router();
const secretKey = crypto.randomBytes(32).toString('hex');

// Returns the token
const generateToken = (user: User): string => {
  return jwt.sign({ ...user }, secretKey, { expiresIn: '1h' });
};

const checkPassword = async (
  password: string,
  hashed: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};

// Auth verify middleware
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.cookies['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err: any, _user: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    next();
  });
};

// Route = /auth
auth.get('/', (req, res) => {
  res.json('GET is working');
});

auth.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Getting user
  const queryString = 'SELECT * FROM users WHERE email=$1';
  const queryValues = [email];
  const { rows } = await query(queryString, queryValues);
  const [user] = rows;

  // Existing user check
  if (!user) {
    return res.status(401).json({
      message: 'Problem with authentication. Please check your input',
    });
  }

  // Password check
  const verified = await checkPassword(password, user.password || '');
  if (!verified) {
    return res.status(401).json({
      message: 'Problem with authentication. Please check your password',
    });
  }

  const { password: pw, ...rest } = user;
  const token = generateToken(rest);
  res.cookie('authorization', `Bearer ${token}`);

  res.json({ token: token, data: rest });
});

auth.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Univoque id creation
  const user_id = uuidv4();

  // Password hashing
  const saltRounds = 11;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const queryString = `INSERT INTO users VALUES ($1, $2, $3, $4)`;
  const queryValues = [user_id, username, email, hashedPassword];

  // Registration
  try {
    await query(queryString, queryValues);
    res.json({ message: 'User registered' });
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
});

// Testing route
auth.post('/test', async (req, res) => {
  const { password, hashed } = req.body;
  const verified = await checkPassword(password, hashed);
  res.json({
    passwordVerify: verified,
  });
});

export default auth;
