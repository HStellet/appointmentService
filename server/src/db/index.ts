import Database from "better-sqlite3";

// Default to in-memory DB (no .db file). To persist, set DB_PATH to a file path.
export const DB_PATH = process.env.DB_PATH || ":memory:";

const db = new Database(DB_PATH);
// Improve read/write concurrency. Works with in-memory and file DBs.
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