import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.resolve(__dirname, "../db/migrations/0001_initial_hardware_platform.sql");

const REQUIRED_TABLES = [
  "hardware_categories",
  "manufacturers",
  "product_families",
  "hardware_items",
  "hardware_variants",
  "metric_definitions",
  "metric_values",
  "benchmark_definitions",
  "benchmark_scores",
  "ranking_profiles",
  "ranking_scores",
  "source_documents",
  "audit_logs",
];

describe("database migration file", () => {
  let sql;

  it("migration file exists", () => {
    sql = readFileSync(migrationPath, "utf8");
    assert.ok(sql.length > 0, "migration file should not be empty");
  });

  for (const table of REQUIRED_TABLES) {
    it(`contains CREATE TABLE for ${table}`, () => {
      if (!sql) sql = readFileSync(migrationPath, "utf8");
      const pattern = new RegExp(`CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?${table}\\b`, "i");
      assert.ok(pattern.test(sql), `migration should contain CREATE TABLE ${table}`);
    });
  }

  it("all tables have PRIMARY KEY", () => {
    if (!sql) sql = readFileSync(migrationPath, "utf8");
    for (const table of REQUIRED_TABLES) {
      const tableBlock = extractTableBlock(sql, table);
      assert.ok(tableBlock, `should find table block for ${table}`);
      assert.ok(/PRIMARY\s+KEY/i.test(tableBlock), `${table} should have PRIMARY KEY`);
    }
  });

  it("contains foreign key references", () => {
    if (!sql) sql = readFileSync(migrationPath, "utf8");
    const fkCount = (sql.match(/REFERENCES\b/gi) || []).length;
    assert.ok(fkCount >= 10, `should have at least 10 REFERENCES, found ${fkCount}`);
  });

  it("contains required indexes", () => {
    if (!sql) sql = readFileSync(migrationPath, "utf8");
    const indexCount = (sql.match(/CREATE\s+INDEX/gi) || []).length;
    assert.ok(indexCount >= 10, `should have at least 10 indexes, found ${indexCount}`);
  });
});

function extractTableBlock(sql, tableName) {
  const regex = new RegExp(
    `CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?${tableName}\\b\\s*\\(`,
    "i"
  );
  const startMatch = sql.match(regex);
  if (!startMatch) return null;
  const startIdx = startMatch.index + startMatch[0].length;
  let depth = 1;
  let i = startIdx;
  while (i < sql.length && depth > 0) {
    if (sql[i] === "(") depth++;
    else if (sql[i] === ")") depth--;
    i++;
  }
  return depth === 0 ? sql.slice(startIdx, i - 1) : null;
}
