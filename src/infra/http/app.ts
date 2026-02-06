import cors from 'cors';
import express from 'express';

export const app = express();

app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	}),
);

app.get('/health', (_, res) => res.sendStatus(200));
