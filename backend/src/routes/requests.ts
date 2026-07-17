import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/client.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const router = Router();

const createRequestSchema = z.object({
  circleId: z.number().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  neededBy: z.string().datetime().optional(),
  category: z.string().optional(),
  urgency: z.enum(['normal', 'high', 'urgent']).optional(),
  photoUrl: z.string().url().optional(),
  location: z.string().optional(),
  duration: z.string().optional(),
});

const respondSchema = z.object({
  message: z.string().optional(),
  confirmed: z.boolean().optional(),
});

async function assertCanAccessRequest(circleId: number | null, societyId: number, userId: number) {
  if (circleId === null) {
    return;
  }
  const memberCheck = await db.query(
    'SELECT id FROM circle_members WHERE circle_id = $1 AND user_id = $2',
    [circleId, userId]
  );
  if (memberCheck.rows.length === 0) {
    throw new AppError(403, 'Not a member of this circle');
  }
}

// Get all requests visible to the user: society-wide (no circle) + requests in circles they've joined
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `SELECT r.*, u.first_name, u.last_name, c.name as circle_name,
        (SELECT COUNT(*) FROM request_responses WHERE request_id = r.id) as response_count
       FROM requests r
       LEFT JOIN users u ON r.creator_id = u.id
       LEFT JOIN circles c ON r.circle_id = c.id
       WHERE r.society_id = $1
         AND (r.circle_id IS NULL OR r.circle_id IN (
           SELECT circle_id FROM circle_members WHERE user_id = $2
         ))
       ORDER BY r.created_at DESC`,
      [req.societyId, req.userId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get requests for a circle (only if user is member)
router.get('/circle/:circleId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memberCheck = await db.query(
      'SELECT id FROM circle_members WHERE circle_id = $1 AND user_id = $2',
      [req.params.circleId, req.userId]
    );

    if (memberCheck.rows.length === 0) {
      throw new AppError(403, 'Not a member of this circle');
    }

    const result = await db.query(
      `SELECT r.*, u.first_name, u.last_name,
        (SELECT COUNT(*) FROM request_responses WHERE request_id = r.id) as response_count
       FROM requests r
       LEFT JOIN users u ON r.creator_id = u.id
       WHERE r.circle_id = $1
       ORDER BY r.needed_by ASC, r.created_at DESC`,
      [req.params.circleId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get single request with creator info and responses
router.get('/:requestId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestResult = await db.query(
      `SELECT r.*, u.first_name, u.last_name, u.phone as creator_phone, u.trust_score as creator_trust_score,
        u.flat_number as creator_flat_number,
        c.name as circle_name,
        (SELECT COUNT(*) FROM requests WHERE creator_id = r.creator_id) as creator_request_count,
        (SELECT COUNT(*) FROM request_responses WHERE responder_id = r.creator_id AND confirmed = true) as creator_helped_count
       FROM requests r
       LEFT JOIN users u ON r.creator_id = u.id
       LEFT JOIN circles c ON r.circle_id = c.id
       WHERE r.id = $1`,
      [req.params.requestId]
    );

    if (requestResult.rows.length === 0) {
      throw new AppError(404, 'Request not found');
    }

    const request = requestResult.rows[0];

    if (request.society_id !== req.societyId) {
      throw new AppError(404, 'Request not found');
    }
    await assertCanAccessRequest(request.circle_id, req.societyId as number, req.userId as number);

    const responsesResult = await db.query(
      `SELECT rr.*, u.first_name, u.last_name, u.trust_score,
        CASE WHEN rr.confirmed THEN u.phone ELSE NULL END as phone
       FROM request_responses rr
       JOIN users u ON rr.responder_id = u.id
       WHERE rr.request_id = $1
       ORDER BY rr.responded_at ASC`,
      [req.params.requestId]
    );

    const isCreator = request.creator_id === req.userId;
    const myResponse = responsesResult.rows.find((r) => r.responder_id === req.userId);
    const showCreatorPhone = isCreator || Boolean(myResponse?.confirmed);

    res.json({
      ...request,
      creator_phone: showCreatorPhone ? request.creator_phone : null,
      responses: responsesResult.rows,
    });
  } catch (error) {
    next(error);
  }
});

// Create request — standalone (society-wide) if no circleId given, otherwise scoped to a circle the user is in
router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createRequestSchema.parse(req.body);

    if (data.circleId) {
      await assertCanAccessRequest(data.circleId, req.societyId as number, req.userId as number);
    }

    const result = await db.query(
      `INSERT INTO requests (circle_id, society_id, creator_id, title, description, needed_by, category, urgency, photo_url, location, duration)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        data.circleId || null,
        req.societyId,
        req.userId,
        data.title,
        data.description,
        data.neededBy || null,
        data.category || null,
        data.urgency || 'normal',
        data.photoUrl || null,
        data.location || null,
        data.duration || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Respond to request
router.post('/:requestId/respond', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = respondSchema.parse(req.body);

    const requestResult = await db.query(
      'SELECT circle_id, society_id FROM requests WHERE id = $1',
      [req.params.requestId]
    );

    if (requestResult.rows.length === 0) {
      throw new AppError(404, 'Request not found');
    }

    const request = requestResult.rows[0];
    if (request.society_id !== req.societyId) {
      throw new AppError(404, 'Request not found');
    }
    await assertCanAccessRequest(request.circle_id, req.societyId as number, req.userId as number);

    const result = await db.query(
      `INSERT INTO request_responses (request_id, responder_id, message, confirmed)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (request_id, responder_id) DO UPDATE SET message = $3, confirmed = $4 OR request_responses.confirmed
       RETURNING *`,
      [req.params.requestId, req.userId, data.message, data.confirmed || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Responder confirms their own offer — reveals contact info both ways
router.post(
  '/:requestId/responses/:responseId/confirm',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await db.query(
        `UPDATE request_responses SET confirmed = true
         WHERE id = $1 AND request_id = $2 AND responder_id = $3
         RETURNING *`,
        [req.params.responseId, req.params.requestId, req.userId]
      );

      if (result.rows.length === 0) {
        throw new AppError(404, 'Response not found');
      }

      res.json(result.rows[0]);
    } catch (error) {
      next(error);
    }
  }
);

// Update request status
router.patch('/:requestId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;

    const requestResult = await db.query(
      'SELECT creator_id FROM requests WHERE id = $1',
      [req.params.requestId]
    );

    if (requestResult.rows.length === 0) {
      throw new AppError(404, 'Request not found');
    }

    if (requestResult.rows[0].creator_id !== req.userId) {
      throw new AppError(403, 'Only creator can update request');
    }

    const result = await db.query(
      'UPDATE requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.requestId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
