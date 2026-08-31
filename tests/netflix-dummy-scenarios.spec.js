const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Real (not fabricated) validation of netflix_dummy_test_scripts.csv — one
// test per test case row, checking each one is actually well-formed (real
// steps, a real expected result), not that a live Netflix app behaves a
// certain way. There is no live Netflix environment wired up here (no base
// URL, no test account), so these can't yet drive a real browser — same gap
// as vi-movies-scenarios.spec.js, see its final TODO test for the same
// reasoning.

// Minimal RFC4180-style CSV parser: handles quoted fields, embedded commas,
// embedded newlines, and "" as an escaped quote.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((f) => f.length > 0)) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const csvPath = path.resolve(__dirname, '..', 'netflix_dummy_test_scripts.csv');
const rawRows = parseCsv(fs.readFileSync(csvPath, 'utf-8'));
const [, ...dataRows] = rawRows; // drop header row
const cases = dataRows.map(([suite, id, description, preconditions, steps, expected]) => ({
  suite,
  id,
  description,
  preconditions,
  steps,
  expected,
}));

test('the Netflix dummy test-case CSV has cases', () => {
  expect(cases.length).toBeGreaterThan(0);
});

for (const testCase of cases) {
  test(`${testCase.id} [${testCase.suite}]: ${testCase.description}`, () => {
    expect(testCase.id).toMatch(/^TC-\d+$/);
    expect(testCase.suite.length).toBeGreaterThan(0);
    expect(testCase.steps.length).toBeGreaterThan(0);
    expect(testCase.expected.length).toBeGreaterThan(0);
  });
}

test('TODO: wire these cases up to a real Netflix environment', () => {
  // Intentionally failing — these describe real user flows (login, profile
  // management, search/playback, My List) but nothing here yet drives an
  // actual browser against a real Netflix base URL. That needs a target
  // environment (base URL, test account) this repo doesn't have configured.
  expect(false).toBe(true);
});
