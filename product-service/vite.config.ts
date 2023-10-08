import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.[jt]s'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
