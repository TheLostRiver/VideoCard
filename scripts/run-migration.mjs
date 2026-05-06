import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createPool, closePool } from "../src/infrastructure/postgres/pool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "..", "db", "migrations");

async function main() {
  const databaseUrl = process.env.DATABASE_URL || "postgresql://hardware:hardware_dev@localhost:5432/hardware_platform";
  console.log("Connecting to:", databaseUrl.replace(/:[^:@]+@/, ":***@"));

  const pool = createPool(databaseUrl);
  const client = await pool.connect();

  try {
    const sqlPath = join(MIGRATIONS_DIR, "0001_initial_hardware_platform.sql");
    const sql = await readFile(sqlPath, "utf8");
    console.log("Running migration: 0001_initial_hardware_platform.sql");
    await client.query(sql);
    console.log("Migration complete. 13 tables created.");
  } finally {
    client.release();
    await closePool();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
