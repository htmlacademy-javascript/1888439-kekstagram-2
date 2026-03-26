import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        runScripts: 'dangerously',
      },
    },
    setupFiles: ['tests/setup.js'],
  }
});
