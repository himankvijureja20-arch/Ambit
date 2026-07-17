import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/client.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

router.use(authenticate, requireAdmin);

// List residents pending approval in admin's society
router.get('/pending-users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `SELECT id, email, first_name, last_name, flat_number, phone, created_at
       FROM users
       WHERE society_id = $1 AND admin_approved = false
       ORDER BY created_at ASC`,
      [req.societyId]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Approve a pending resident
router.post('/users/:userId/approve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `UPDATE users SET admin_approved = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND society_id = $2
       RETURNING id, email, first_name, last_name, admin_approved`,
      [req.params.userId, req.societyId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'User not found in your society');
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Reject a pending resident (removes the application)
router.post('/users/:userId/reject', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `DELETE FROM users WHERE id = $1 AND society_id = $2 AND admin_approved = false RETURNING id`,
      [req.params.userId, req.societyId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Pending user not found in your society');
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// List circles pending approval in admin's society
router.get('/pending-circles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `SELECT c.*, u.first_name, u.last_name, u.trust_score as founder_trust_score
       FROM circles c
       LEFT JOIN users u ON c.creator_id = u.id
       WHERE c.society_id = $1 AND c.status = 'pending'
       ORDER BY c.created_at ASC`,
      [req.societyId]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Approve a pending circle
router.post('/circles/:circleId/approve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `UPDATE circles SET status = 'approved', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND society_id = $2
       RETURNING id, name, status`,
      [req.params.circleId, req.societyId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Circle not found in your society');
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Reject a pending circle
router.post('/circles/:circleId/reject', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `UPDATE circles SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND society_id = $2
       RETURNING id, name, status`,
      [req.params.circleId, req.societyId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Circle not found in your society');
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// List requests in admin's society for moderation (circle-scoped and standalone alike)
router.get('/requests', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `SELECT r.*, u.first_name, u.last_name, c.name as circle_name,
        (SELECT COUNT(*) FROM request_responses WHERE request_id = r.id) as response_count
       FROM requests r
       LEFT JOIN users u ON r.creator_id = u.id
       LEFT JOIN circles c ON r.circle_id = c.id
       WHERE r.society_id = $1
       ORDER BY r.created_at DESC`,
      [req.societyId]
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Remove (moderate) a request
router.post('/requests/:requestId/remove', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `UPDATE requests SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND society_id = $2
       RETURNING id, title, status`,
      [req.params.requestId, req.societyId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Request not found in your society');
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Flag a request for review (does not remove it)
router.post('/requests/:requestId/flag', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `UPDATE requests SET status = 'flagged', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND society_id = $2
       RETURNING id, title, status`,
      [req.params.requestId, req.societyId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Request not found in your society');
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Clear a flag, returning the request to open
router.post('/requests/:requestId/unflag', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await db.query(
      `UPDATE requests SET status = 'open', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND society_id = $2
       RETURNING id, title, status`,
      [req.params.requestId, req.societyId]
    );

    if (result.rows.length === 0) {
      throw new AppError(404, 'Request not found in your society');
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
