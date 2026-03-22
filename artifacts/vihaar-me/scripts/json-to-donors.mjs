/**
 * Convert donors-wall.json → fundraiseDonors.ts
 * No allocation logic, no random — just reads the file and outputs TS.
 * Run: node scripts/json-to-donors.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const jsonPath = join(__dirname, "donors-wall.json");
const outPath = join(__dirname, "../src/data/fundraiseDonors.ts");

const donors = JSON.parse(readFileSync(jsonPath, "utf-8"));

const lines = [
  "// @ts-nocheck — Wall of Love: LLM-authored donor list",
  "/** Source: donors-wall.json — convert with: node scripts/json-to-donors.mjs */",
  "export type FundraiseDonorRow = {",
  "  primary: string;",
  "  secondary?: string;",
  "  note?: string;",
  "  amountCents: number;",
  "  donatedAt: string;",
  "};",
  "",
  "export const FUNDRAISE_DONORS = [",
  ...donors.map((r) => {
    const sec = r.secondary != null ? `, secondary: ${JSON.stringify(r.secondary)}` : "";
    const nt = r.note != null ? `, note: ${JSON.stringify(r.note)}` : "";
    return `  { primary: ${JSON.stringify(r.primary)}${sec}${nt}, amountCents: ${r.amountCents}, donatedAt: ${JSON.stringify(r.donatedAt)} },`;
  }),
  "] as unknown as readonly FundraiseDonorRow[];",
  "",
];

writeFileSync(outPath, lines.join("\n"));
console.log(`Wrote ${donors.length} donors to ${outPath}`);
console.log(`Sum: $${(donors.reduce((a, d) => a + d.amountCents, 0) / 100).toLocaleString()}`);
