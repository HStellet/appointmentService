import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

// Allow overriding DB location via env (important for Render persistent disk)
// Default to file-based DB at ./data/appointments.db so local runs persist across restarts.
// If you explicitly set DB_PATH=":memory:" it will use an in-memory DB.
export const DB_PATH = process.env.DB_PATH || path.resolve(process.cwd(), "data", "appointments.db");

// If DB_PATH points to a file, ensure its directory exists. If we cannot create the
// directory (for example a disk wasn't mounted), fall back to an ephemeral DB in /tmp
// so the server can still start for demo/testing purposes.
let resolvedDbPath = DB_PATH;
if (DB_PATH !== ":memory:") {
  const dir = path.dirname(DB_PATH);
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    console.error(`Failed to create DB directory ${dir}: ${err}`);
    const fallback = path.resolve("/tmp", "appointments.db");
    try {
      fs.mkdirSync(path.dirname(fallback), { recursive: true });
      console.error(`Falling back to ephemeral DB at ${fallback}`);
      resolvedDbPath = fallback;
    } catch (err2) {
      // If even /tmp can't be used (very unlikely), rethrow the original error to fail fast.
      console.error(`Failed to create fallback DB directory /tmp: ${err2}`);
      throw err;
    }
  }
}

const db = new Database(resolvedDbPath);
// Improve read/write concurrency when using file DBs.
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    datetime TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    reason TEXT,
    created_at TEXT NOT NULL
  );
`);

export default db;