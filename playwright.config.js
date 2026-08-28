const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['json', { outputFile: 'test-results/results.json' }], ['list']],
});
