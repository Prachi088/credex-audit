# TESTS.md

## Audit Engine Tests

All tests are in `tests/auditEngine.test.ts`. Run with:

```bash
npm test
```

### Test 1 — Cursor Business overkill for small team
**File:** `tests/auditEngine.test.ts`
**What it covers:** Detects when a team of 2 is on Cursor Business plan ($40/seat) instead of Pro ($20/seat). Expects $40/mo savings and high severity.

### Test 2 — Claude Max overkill for small team
**File:** `tests/auditEngine.test.ts`
**What it covers:** Detects when a team of 2 is on Claude Max ($100/seat) instead of Pro ($20/seat). Expects $160/mo savings and medium severity.

### Test 3 — Optimal tools marked correctly
**File:** `tests/auditEngine.test.ts`
**What it covers:** Confirms that a correctly-priced tool (Cursor Pro, 1 seat, $20/mo) returns $0 savings and optimal severity.

### Test 4 — Annual savings calculation
**File:** `tests/auditEngine.test.ts`
**What it covers:** Confirms totalAnnualSavings = totalMonthlySavings * 12.

### Test 5 — Credex CTA threshold
**File:** `tests/auditEngine.test.ts`
**What it covers:** Confirms showCredex is true when savings exceed $500/mo (Gemini Ultra for coding use case).

### Test 6 — GitHub Copilot Business overkill
**File:** `tests/auditEngine.test.ts`
**What it covers:** Detects when a team of 2 is on GitHub Copilot Business ($19/seat) instead of Individual ($10/seat). Expects $18/mo savings.