# Server (TypeScript + Express + better-sqlite3)

- **No DB file by default**: runs on in-memory SQLite (`DB_PATH=:memory:`).
- To persist, set `DB_PATH` to a file path (e.g., `DB_PATH=./appointments.db`). The file will be created automatically by SQLite when you write to it.

## Commands
```bash
npm i
npm run dev              # watch with tsx
# or persist to a file:
DB_PATH=./appointments.db npm run dev
```

### What is `PRAGMA journal_mode = WAL`?
Enables Write-Ahead Logging so reads don't block writes. Good default for small APIs.