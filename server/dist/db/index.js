import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
// Allow overriding DB location via env (important for Render persistent disk)
// Default to file-based DB at ./data/appointments.db so local runs persist across restarts.
// If you explicitly set DB_PATH=":memory:" it will use an in-memory DB.
export const DB_PATH = process.env.DB_PATH || path.resolve(process.cwd(), "data", "appointments.db");
// If DB_PATH points to a file, ensure its directory exists.
if (DB_PATH !== ":memory:") {
    try {
        fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }
    catch (err) {
        // ignore errors here; better-sqlite3 will throw meaningful errors if path invalid
    }
}
const db = new Database(DB_PATH);
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
