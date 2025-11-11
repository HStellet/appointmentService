# Appointment Booking

- **Server:** TypeScript + Express + better-sqlite3
  - In-memory DB by default (no `.db` file). Set `DB_PATH` to persist.
- **Client:** React + Vite + TypeScript

## Run locally

**Terminal 1 (API)**
```bash
cd server
npm i
npm run dev
# or persist:
# export DB_PATH=./appointments.db npm run dev
```

**Terminal 2 (Web)**
```bash
cd client
npm i
npm run dev
```

Open http://localhost:5173

**Optional functionalities included**
```
1. Bootstrap CSS styling ✅
2. Timezone Handling ✅
3. Edit an appointment ✅
4. Search an appointment ✅
5. Tests ✅
```

Open http://localhost:5173