import { NextFunction, Request, Response, Router } from 'express';
import { authenticateToken } from './auth';
import { query } from '../db/db-utility';
import { v4 as uuidv4 } from 'uuid';

// Utility middleware
const checkList = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.body.userData;
  const { wishlist_id } = req.params;
  const queryString = 'SELECT * FROM wishlists WHERE user_id=$1 AND wishlist_id=$2';
  const queryValues = [user_id, wishlist_id];
  try {
    const { rowCount } = await query(queryString, queryValues);
    if (rowCount === 0) {
      res.status(404);
      throw new Error('List not found');
    }
    next();
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
};

const wishlists = Router();

// ----------------------- WISHLISTS ROUTES ----------------------- //
wishlists.get('/:listId', authenticateToken, async (req, res) => {
  const { listId } = req.params;
  const { user_id } = req.body.userData;
  const getSingleList = listId !== undefined ? ' AND wishlist_id=$2' : '';
  const queryString = 'SELECT * FROM wishlists WHERE user_id=$1' + getSingleList;
  const queryValues = listId !== undefined ? [user_id, listId] : [user_id];
  try {
    const { rows, rowCount } = await query(queryString, queryValues);
    if (rowCount === 0) {
      res.status(404);
      throw new Error('List not found');
    }
    res.json(rows);
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
});

wishlists.post('/', authenticateToken, async (req, res) => {
  const { user_id } = req.body.userData;
  const { name } = req.body;
  const wishlist_id = uuidv4();
  const queryString = 'INSERT INTO wishlists(wishlist_id, user_id, name) VALUES ($1, $2, $3)';
  const queryValues = [wishlist_id, user_id, name];
  try {
    await query(queryString, queryValues);
    res.json({ message: 'Wishlist created' });
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
});

wishlists.put('/:listId', authenticateToken, async (req, res) => {
  const { user_id } = req.body.userData;
  const { name } = req.body;
  const { listId } = req.params;
  const queryString = 'UPDATE wishlists SET name=$1, updated_at=NOW() WHERE user_id=$2 AND wishlist_id=$3';
  const queryValues = [name, user_id, listId];
  try {
    await query(queryString, queryValues);
    res.json({ message: 'Wishlist updated' });
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
});

wishlists.delete('/:listId', authenticateToken, async (req, res) => {
  const { user_id } = req.body.userData;
  const { listId } = req.params;
  const queryString = 'DELETE FROM wishlists WHERE user_id=$1 AND wishlist_id=$2';
  const queryValues = [user_id, listId];
  try {
    const { rowCount } = await query(queryString, queryValues);
    if (rowCount === 0) return res.json({ message: 'Nothing to delete' });
    res.json({ message: 'Wishlist deleted' });
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
});

// ----------------------- ITEMS ROUTES ----------------------- //
// Triggers both "/:wishlist_id/items" and "/:wishlist_id/items/:item_id?"
wishlists.get('/:wishlist_id/items/:item_id?', authenticateToken, async (req, res) => {
  const { wishlist_id, item_id } = req.params;
  const { user_id } = req.body.userData;
  const getSingleItem = item_id !== undefined ? ' AND item_id=$3' : '';
  const queryString = 'SELECT * FROM items WHERE wishlist_id=$1 AND user_id=$2' + getSingleItem;
  const queryValues = item_id !== undefined ? [wishlist_id, user_id, item_id] : [wishlist_id, user_id];
  try {
    const { rows, rowCount } = await query(queryString, queryValues);
    if (rowCount === 0) {
      res.status(404);
      throw new Error('Items not found');
    }
    res.json(rows);
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
});

wishlists.post('/:wishlist_id/items', authenticateToken, checkList, async (req, res) => {
  const { wishlist_id } = req.params;
  const { item_name, description } = req.body;
  const { user_id } = req.body.userData;
  const item_id = uuidv4();
  const queryString =
    'INSERT INTO items(item_id, wishlist_id, user_id, item_name, description) VALUES ($1, $2, $3, $4, $5)';
  const queryValues = [item_id, wishlist_id, user_id, item_name, description];
  try {
    await query(queryString, queryValues);
    res.json({ message: 'Item created' });
  } catch (e) {
    res.json({ error_message: (e as Error).message });
  }
});

export default wishlists;
