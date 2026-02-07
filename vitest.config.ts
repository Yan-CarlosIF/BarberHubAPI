/// <reference types="vitest" />
import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
		exclude: ['node_modules'],
		globals: true,
		environment: 'node',
		clearMocks: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
		},
	},
	resolve: {
		alias: {
			'@modules': path.resolve(__dirname, 'src/modules'),
			'@': path.resolve(__dirname, 'src'),
			'@shared': path.resolve(__dirname, 'src/shared'),
			'@infra': path.resolve(__dirname, 'src/infra'),
			'@config': path.resolve(__dirname, 'src/config'),
		},
	},
});
