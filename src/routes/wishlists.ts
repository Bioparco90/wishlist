import { Router } from 'express';
import { authenticateToken } from './auth';
import { query } from '../db/db-utility';
import { v4 as uuidv4 } from 'uuid';

const wishlists = Router();

wishlists.get('/', authenticateToken, async (req, res) => {
  const { user_id } = req.body.userData;
  const queryString = 'SELECT * FROM wishlists WHERE user_id=$1';
  const queryValues = [user_id];
  try {
    const { rows } = await query(queryString, queryValues);
    if (rows.length === 0) {
      res.status(404);
      throw new Error('List not found');
    }
    res.json(rows);
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
});

wishlists.get('/:listId', authenticateToken, async (req, res) => {
  const { listId } = req.params;
  const { user_id } = req.body.userData;
  const queryString =
    'SELECT * FROM wishlists WHERE wishlist_id=$1 AND user_id=$2';
  const queryValues = [listId, user_id];
  try {
    const { rows } = await query(queryString, queryValues);
    if (rows.length === 0) {
      res.status(404);
      throw new Error('List not found');
    }
    const [wishlist] = rows;
    res.json(wishlist);
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
});

wishlists.post('/', authenticateToken, async (req, res) => {
  const { user_id } = req.body.userData;
  const { name } = req.body;
  const wishlist_id = uuidv4();
  const queryString =
    'INSERT INTO wishlists(wishlist_id, user_id, name) VALUES ($1, $2, $3)';
  const queryValues = [wishlist_id, user_id, name];
  try {
    await query(queryString, queryValues);
    res.json({ message: 'Wishlist created' });
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
});

export default wishlists;
