import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export const errorHandler = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    const message = firstIssue
      ? `${firstIssue.path.join('.') || 'value'}: ${firstIssue.message}`
      : 'Invalid input';
    return res.status(400).json({
      error: message,
      fields: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  console.error('Unhandled error:', error);
  return res.status(500).json({ error: 'Internal server error' });
};
