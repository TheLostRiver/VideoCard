import pg from "pg";
const { Pool } = pg;

let pool = null;

export function createPool(connectionString) {
  if (!pool) {
    pool = new Pool({ connectionString });
  }
  return pool;
}

export function getPool() {
  if (!pool) throw new Error("Pool not initialized. Call createPool() first.");
  return pool;
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
