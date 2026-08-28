const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['json', { outputFile: 'test-results/results.json' }], ['list']],
  // Explicit, named project with a real testMatch list — an unnamed default
  // project (what Playwright falls back to without this) reports its
  // testMatch as the raw catch-all glob string, which the dashboard passes
  // straight through as if it were a real filename. That hangs indefinitely
  // instead of ever matching a file, since it's a pattern, not a path.
  projects: [
    {
      name: 'vi-movies-scenarios',
      testMatch: ['**/vi-movies-scenarios.spec.js'],
    },
  ],
});
