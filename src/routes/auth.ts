import { Router } from 'express';

const auth = Router();

auth.get('/', (req, res) => {
  res.json('GET is working');
});

auth.post('/login', (req, res) => {
  res.json("Not yet implemented");
});

auth.post("/register", (req, res) => {
    res.json("Not yet implemented");
})

export default auth;
