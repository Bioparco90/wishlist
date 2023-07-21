import express from 'express';
import 'dotenv/config';
import auth, { authenticateToken } from './routes/auth';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', auth);

// Test routes
app.get('/', authenticateToken, (req, res) => {
  const filePath = path.join(__dirname, '../lhome.html');
  res.sendFile(filePath);
});

app.get('/login', (_req, res) => {
  const filePath = path.join(__dirname, '../login.html');
  res.sendFile(filePath);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
