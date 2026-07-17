import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/client.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const router = Router();

const createCircleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  meetingSchedule: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

// Get all circles in user's society
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `SELECT c.*, u.first_name, u.last_name,
        (SELECT COUNT(*) FROM circle_members WHERE circle_id = c.id) as member_count,
        (SELECT COUNT(*) FROM requests WHERE circle_id = c.id AND status = 'open') as open_requests,
        EXISTS(SELECT 1 FROM circle_members WHERE circle_id = c.id AND user_id = $2) as is_member
       FROM circles c
       LEFT JOIN users u ON c.creator_id = u.id
       WHERE c.society_id = $1 AND c.status = 'approved'
       ORDER BY c.created_at DESC`,
      [req.societyId, req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get single circle with members
router.get('/:circleId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const circleResult = await db.query(
      `SELECT c.*, u.first_name, u.last_name,
        (SELECT COUNT(*) FROM circle_members WHERE circle_id = c.id) as member_count
       FROM circles c
       LEFT JOIN users u ON c.creator_id = u.id
       WHERE c.id = $1 AND c.society_id = $2`,
      [req.params.circleId, req.societyId]
    );

    if (circleResult.rows.length === 0) {
      throw new AppError(404, 'Circle not found');
    }

    const membersResult = await db.query(
      `SELECT u.id, u.first_name, u.last_name, cm.joined_at
       FROM circle_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.circle_id = $1`,
      [req.params.circleId]
    );

    res.json({
      ...circleResult.rows[0],
      members: membersResult.rows,
    });
  } catch (error) {
    next(error);
  }
});

// Create circle
router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createCircleSchema.parse(req.body);

    const result = await db.query(
      `INSERT INTO circles (society_id, creator_id, name, description, category, meeting_schedule, image_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [
        req.societyId,
        req.userId,
        data.name,
        data.description,
        data.category,
        data.meetingSchedule,
        data.imageUrl,
      ]
    );

    const circle = result.rows[0];

    // Auto-add creator to circle
    await db.query(
      'INSERT INTO circle_members (circle_id, user_id) VALUES ($1, $2)',
      [circle.id, req.userId]
    );

    res.status(201).json(circle);
  } catch (error) {
    next(error);
  }
});

// Join circle
router.post('/:circleId/join', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const circleResult = await db.query(
      'SELECT id, status FROM circles WHERE id = $1 AND society_id = $2',
      [req.params.circleId, req.societyId]
    );

    if (circleResult.rows.length === 0) {
      throw new AppError(404, 'Circle not found');
    }

    if (circleResult.rows[0].status !== 'approved') {
      throw new AppError(403, 'Circle is not yet approved');
    }

    await db.query(
      'INSERT INTO circle_members (circle_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.params.circleId, req.userId]
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Leave circle
router.post('/:circleId/leave', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.query(
      'DELETE FROM circle_members WHERE circle_id = $1 AND user_id = $2',
      [req.params.circleId, req.userId]
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
