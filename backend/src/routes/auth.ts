import { Router, Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { db } from '../db/client.js';
import { AppError } from '../middleware/errorHandler.js';
import { z } from 'zod';

const router = Router();

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});

router.use(authRateLimit);

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  inviteCode: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const generateToken = (userId: number, societyId: number) => {
  return jwt.sign({ userId, societyId }, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = signupSchema.parse(req.body);

    const societyResult = await db.query('SELECT id FROM societies WHERE invite_code = $1', [
      data.inviteCode,
    ]);
    if (societyResult.rows.length === 0) {
      throw new AppError(400, 'Invalid invite code');
    }
    const societyId = societyResult.rows[0].id;

    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [data.email]);
    if (existingUser.rows.length > 0) {
      throw new AppError(400, 'Email already registered');
    }

    const passwordHash = await bcryptjs.hash(data.password, 10);
    const result = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, society_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, first_name, last_name, admin_approved`,
      [data.email, passwordHash, data.firstName, data.lastName, societyId]
    );

    const user = result.rows[0];

    // No token issued — account is pending admin approval, not yet a session.
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        adminApproved: user.admin_approved,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await db.query(
      `SELECT id, password_hash, society_id, admin_approved, email, first_name, last_name, role, trust_score
       FROM users WHERE email = $1`,
      [data.email]
    );
    if (result.rows.length === 0) {
      throw new AppError(401, 'Invalid credentials');
    }

    const user = result.rows[0];
    const passwordMatch = await bcryptjs.compare(data.password, user.password_hash);
    if (!passwordMatch) {
      throw new AppError(401, 'Invalid credentials');
    }

    if (!user.admin_approved) {
      throw new AppError(403, 'Account pending admin approval');
    }

    const token = generateToken(user.id, user.society_id);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        trustScore: user.trust_score,
        adminApproved: user.admin_approved,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
