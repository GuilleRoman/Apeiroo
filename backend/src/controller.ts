import express from 'express';
import { getDuties, addDuty } from './service';
import { Request, Response } from 'express';
import pool from './repository';
const router = express.Router();

router.get('/duties', async (req: Request, res: Response) => {
    try {
      const result = await pool.query('SELECT * FROM duties');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
    }
  });

router.post('/duties', async (req: any, res: any) => {
const { name } = req.body;
if (!name) return res.status(400).json({ error: 'Name is required' });

try {
    const result = await pool.query(
    'INSERT INTO duties (name) VALUES ($1) RETURNING *',
    [name]
    );
    res.status(201).json(result.rows[0]);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
}
});

export default router;