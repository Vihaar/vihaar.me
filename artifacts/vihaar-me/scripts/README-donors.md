# Wall of Love — donor data

**Source of truth:** `donors-wall.json`

Team Trees style: varied names (Anonymous, Indian names, groups, teams), custom messages, 1 tree = 10 meals.

**Top 3:** Pankaj Chaddah (50,000 meals), Ramesh Kumar (20,000 meals), Vihaar Nandigala (10,000 meals).

**Schema (each donor):**
```json
{"primary": "Name", "secondary": "Optional sub", "note": "Optional message", "amountCents": 500, "donatedAt": "2026-03-15T12:00:00.000Z"}
```

**To rebuild from JSON → TypeScript:**
```bash
node scripts/json-to-donors.mjs
```

**To regenerate wall (Team Trees style, preserves timestamps):**
```bash
node scripts/build-team-trees-wall.mjs && node scripts/json-to-donors.mjs
```
