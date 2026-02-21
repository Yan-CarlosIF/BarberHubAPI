import { resolve } from 'node:path';
import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';

config({ path: resolve(__dirname, '.env') });

export default defineConfig({
	test: {
		fileParallelism: false,
		isolate: false,
		include: ['**/*.e2e.{test,spec}.{js,ts}'],
		globals: true,
		setupFiles: ['./src/shared/test/setup.e2e.ts'],
		environment: 'node',
		env: {
			NODE_ENV: 'test',
		},
		pool: 'forks',
	},
	resolve: {
		alias: {
			'@modules': resolve(__dirname, 'src/modules'),
			'@': resolve(__dirname, 'src'),
			'@shared': resolve(__dirname, 'src/shared'),
			'@infra': resolve(__dirname, 'src/infra'),
			'@config': resolve(__dirname, 'src/config'),
		},
	},
});
