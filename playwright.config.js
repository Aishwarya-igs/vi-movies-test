const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // The dashboard reporter streams live per-test results to the dashboard
  // backend — without it, the dashboard only sees the overall process exit
  // code, not individual test outcomes. Present at this path because
  // admin-dashboard's provisioner copies dashboard/ into every client repo.
  reporter: [['json', { outputFile: 'test-results/results.json' }], ['list'], ['./dashboard/reporter/dashboard-reporter.js']],
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
    {
      name: 'netflix-dummy-scenarios',
      testMatch: ['**/netflix-dummy-scenarios.spec.js'],
    },
  ],
});
