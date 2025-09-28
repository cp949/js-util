import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Global test APIs (describe, it, expect, vi, etc.)
    globals: true,

    // Test environment
    environment: 'jsdom',

    // Test files pattern
    include: ['__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    // Exclude patterns
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{turbo}/**', '**/coverage/**'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{js,ts}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/index.ts', // Re-export files
        'src/**/*.test.{js,ts}',
        'src/**/*.spec.{js,ts}',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // Test timeout
    testTimeout: 10000,

    // Hook timeout
    hookTimeout: 10000,

    // Reporters
    reporters: ['default', 'html'],

    // Watch mode configuration
    watch: true,

    // Vitest UI configuration
    ui: false,

    // Pool options for better performance
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
  },
});
