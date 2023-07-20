import express from 'express';
import 'dotenv/config';
import { query } from './db/db-utility';
import auth from './routes/auth';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", auth);

app.get('/', (_req, res) => {
  res.send('ciao');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
