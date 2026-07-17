import { Request, Response, NextFunction } from 'express';
import { db } from '../db/client.js';
import { AppError } from './errorHandler.js';

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query('SELECT role FROM users WHERE id = $1', [req.userId]);
    if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
      throw new AppError(403, 'Admin access required');
    }
    next();
  } catch (error) {
    next(error);
  }
};
