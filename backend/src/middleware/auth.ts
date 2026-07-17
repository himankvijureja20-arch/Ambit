import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      societyId?: number;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError(401, 'No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
      societyId: number;
    };
    req.userId = decoded.userId;
    req.societyId = decoded.societyId;
    next();
  } catch (error) {
    next(new AppError(401, 'Invalid or expired token'));
  }
};
