import 'reflect-metadata';
import { errorHandler } from '@shared/errors/errorHandler';
import cors from 'cors';
import express from 'express';
import { appRoutes } from './routes/_index';

export const app = express();

app.use(cors());
app.use(express.json());

// Error handling middleware should be registered after all routes and other middleware
app.use(errorHandler);

// Health check endpoint
app.get('/health', (_, res) => res.sendStatus(200));

// Register application routes
app.use(appRoutes);
