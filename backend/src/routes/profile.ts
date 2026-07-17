import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/client.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const router = Router();

const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  flatNumber: z.string().optional(),
  photoUrl: z.string().url().optional(),
  interests: z.array(z.string()).optional(),
});

// Get user profile
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userResult = await db.query(
      `SELECT id, email, first_name, last_name, society_id, admin_approved, created_at,
        role, trust_score, phone, flat_number, photo_url
       FROM users WHERE id = $1`,
      [req.userId]
    );

    if (userResult.rows.length === 0) {
      throw new AppError(404, 'User not found');
    }

    const interestsResult = await db.query('SELECT tag FROM interests WHERE user_id = $1', [
      req.userId,
    ]);

    const user = userResult.rows[0];
    res.json({
      ...user,
      interests: interestsResult.rows.map((r: { tag: string }) => r.tag),
    });
  } catch (error) {
    next(error);
  }
});

// Get user's circles
router.get('/circles', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `SELECT c.* FROM circles c
       JOIN circle_members cm ON c.id = cm.circle_id
       WHERE cm.user_id = $1
       ORDER BY cm.joined_at DESC`,
      [req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Top trust-score residents in the same society (for the Home page "Top Helpers" widget)
router.get('/top-helpers', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `SELECT id, first_name, last_name, trust_score, photo_url
       FROM users
       WHERE society_id = $1 AND admin_approved = true AND id != $2
       ORDER BY trust_score DESC
       LIMIT 4`,
      [req.societyId, req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Update profile
router.patch('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    if (data.firstName || data.lastName || data.phone || data.flatNumber || data.photoUrl) {
      await db.query(
        `UPDATE users SET
           first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone = COALESCE($3, phone),
           flat_number = COALESCE($4, flat_number),
           photo_url = COALESCE($5, photo_url),
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $6`,
        [data.firstName, data.lastName, data.phone, data.flatNumber, data.photoUrl, req.userId]
      );
    }

    if (data.interests) {
      await db.query('DELETE FROM interests WHERE user_id = $1', [req.userId]);
      for (const interest of data.interests) {
        await db.query('INSERT INTO interests (user_id, tag) VALUES ($1, $2)', [req.userId, interest]);
      }
    }

    const userResult = await db.query(
      `SELECT id, email, first_name, last_name, society_id, role, trust_score, phone, flat_number, photo_url
       FROM users WHERE id = $1`,
      [req.userId]
    );

    res.json(userResult.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
