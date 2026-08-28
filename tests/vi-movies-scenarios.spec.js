const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Real (not fabricated) validation of the automation blueprint CSV at
// vi_movies_automation_scripts.csv — one test per scenario row, checking
// each blueprint is actually well-formed Gherkin with real selectors, not
// that the live Vi Movies app behaves a certain way. There is no live Vi
// Movies environment wired up here (no base URL, no OTP delivery, no auth),
// so these can't yet drive a real browser against the real app — see the
// final placeholder test below for that gap.

// Minimal RFC4180-style CSV parser: handles quoted fields, embedded commas,
// embedded newlines, and "" as an escaped quote. Avoids pulling in a csv
// parsing dependency for four rows of test data.
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

const csvPath = path.resolve(__dirname, '..', 'vi_movies_automation_scripts.csv');
const rawRows = parseCsv(fs.readFileSync(csvPath, 'utf-8'));
const [, ...dataRows] = rawRows; // drop header row
const scenarios = dataRows.map(([id, description, blueprint, targets]) => ({ id, description, blueprint, targets }));

test('the automation blueprint CSV has scenarios', () => {
  expect(scenarios.length).toBeGreaterThan(0);
});

for (const scenario of scenarios) {
  test(`${scenario.id}: ${scenario.description}`, () => {
    expect(scenario.blueprint).toContain('Feature:');
    expect(scenario.blueprint).toContain('Scenario:');
    expect(scenario.blueprint).toMatch(/Given|When|Then/);
    expect(scenario.targets.length).toBeGreaterThan(0);
    expect(scenario.targets).toMatch(/`.+`/); // at least one backtick-delimited selector
  });
}

test('TODO: wire these blueprints up to a real Vi Movies environment', () => {
  // Intentionally failing — these scenarios describe real user flows (OTP
  // login, live TV playback, search, paywall, language filter) but nothing
  // here yet drives an actual browser against a real Vi Movies base URL.
  // That needs a target environment (base URL, test account, OTP handling)
  // this repo doesn't have configured.
  expect(false).toBe(true);
});
