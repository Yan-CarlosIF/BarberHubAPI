import 'reflect-metadata';
import '@shared/container';

import { env } from '@config/env';
import { apiReference } from '@scalar/express-api-reference';
import { errorHandler } from '@shared/errors/errorHandler';
import cors from 'cors';
import express from 'express';
import { openApiDocument } from '../../../../docs/openapi';
import { appRoutes } from './routes';

export const app = express();
const origin = env.FRONTEND_URL ?? 'http://localhost:3000';

app.use(
	cors({
		origin,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	}),
);
app.use(express.json());

// API documentation route
app.use(
	'/docs',
	apiReference({
		_integration: 'express',
		content: openApiDocument,
		persistAuth: true,
		authentication: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
				},
			},
		},
		defaultHttpClient: {
			clientKey: 'http',
			targetKey: 'http',
		},
	}),
);

// Health check endpoint
app.get('/health', (_, res) => res.sendStatus(200));

// Register application routes
app.use(appRoutes);

// Error handling middleware should be registered after all routes and other middleware
app.use(errorHandler);
