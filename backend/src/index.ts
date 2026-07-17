import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db/client.js';
import authRoutes from './routes/auth.js';
import circlesRoutes from './routes/circles.js';
import requestsRoutes from './routes/requests.js';
import profileRoutes from './routes/profile.js';
import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

app.use(helmet({
  contentSecurityPolicy: isProd ? undefined : false,
}));
app.use(cors({
  origin: isProd ? true : (process.env.FRONTEND_URL || 'http://localhost:3003'),
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/circles', circlesRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});

// Serve built frontend in production
if (isProd) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
}

app.use(errorHandler);

const start = async () => {
  try {
    await db.connect();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default app;
