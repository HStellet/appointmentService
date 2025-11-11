# Appointment Booking

- **Server:** TypeScript + Express + better-sqlite3
- **Client:** React + Vite + TypeScript

## Run locally

**Terminal 1 (API)**
```bash
````markdown
# Appointment Booking

Small appointment booking demo: a TypeScript/Express backend using SQLite (better-sqlite3) and a Vite + React + TypeScript frontend.

## Tech stack

- Server: Node 18+, TypeScript, Express, better-sqlite3
- Client: React 18, Vite, TypeScript, Bootstrap for quick styling

## Features

- List appointments
- Show available 30-minute slots for a week (Mon-Fri business hours)
- Create and cancel appointments
- Edit appointment (inline row edit) with datetime dropdown populated from available slots
- Simple validation (no double-booking, business hours)

## Prerequisites

- Node 18+ and npm
- Git (to clone)

## Local setup (step-by-step)

1. Clone the repo and navigate into it:

```bash
git clone <repo-url> appointment-booking-ts
cd appointment-booking-ts
```

2. Start the server

```bash
cd server
npm install
# The server uses a local SQLite DB file by default. You can override with DB_PATH env var.
export DB_PATH=./appointments.db
npm run dev
```

The server dev script runs with `tsx watch` and serves the API (by default on port 3000 in the codebase). Check `server/src/index.ts` to confirm the port if you changed it.

3. Start the client in another terminal

```bash
cd client
npm install
npm run dev
```

Open the UI at the Vite URL printed in the terminal (commonly http://localhost:5173).

## API (JSON) - endpoints and example responses

Base path used by the client: `/api/appointments` (proxy or server mounting may differ). Adjust client base if your server runs on a different port.

1) GET /api/appointments

Response: 200

```json
[
	{
		"id": 1,
		"datetime": "2025-11-17T09:00:00.000Z",
		"name": "Alice",
		"email": "alice@example.com",
		"phone": null,
		"reason": "Consultation",
		"created_at": "2025-11-10T12:00:00.000Z"
	}
]
```

2) GET /api/appointments/available?weekStart=YYYY-MM-DD

Response: 200

```json
{
	"weekStart": "2025-11-17T00:00:00.000Z",
	"resp": {
		"available": ["2025-11-17T09:00:00.000Z","2025-11-17T09:30:00.000Z"],
		"booked": ["2025-11-17T10:00:00.000Z"]
	}
}
```

3) POST /api/appointments

Request body (JSON):

```json
{
	"datetimeISO": "2025-11-17T09:00:00.000Z",
	"name": "Alice",
	"email": "alice@example.com",
	"phone": null,
	"reason": "Consultation"
}
```

Response success: 201

```json
{ "id": 42, "datetime": "2025-11-17T09:00:00.000Z", "name": "Alice", "email": "alice@example.com", "phone": null, "reason": "Consultation", "created_at": "..." }
```

Errors: 400 or 422 for validation, 409 if time slot already booked. Responses use `{ "error": "message" }` with appropriate HTTP status.

4) DELETE /api/appointments/:id

Response: 200

```json
{ "ok": true }
```

5) PATCH /api/appointments/update/:id  (or PATCH /api/appointments/:id if you changed the router)

Request body (JSON): same shape as creation (datetimeISO, name, email, phone, reason)

Response: 200

```json
{ "id": 42, "datetime": "2025-11-17T09:30:00.000Z", "name": "Alice", "email": "alice@example.com", "phone": null, "reason": "Updated", "created_at": "..." }
```

Errors: 400/422/409 as above.

## Assumptions and important decisions

- Business hours are enforced in the service (30-minute slots Mon-Fri, e.g., 09:00-17:00), see `server/src/utils/time.ts`.
- The client expects the server API prefix at `/api/appointments`. If you run server and client on different ports, set up the Vite proxy or change fetch URLs to point to the server port.
- Editing an appointment keeps its current slot selectable even if the slot appears in `booked` (so the user can keep the same time).
- The DB is local SQLite, not intended for production concurrency.

## Future improvements

- Replace local SQLite with a real RDBMS for production use.
- Add authentication/authorization.
- Improve UI accessibility and add better form validation UX.
- Add integration tests for the frontend components.

## Troubleshooting

- If server fails to start due to DB path, ensure `DB_PATH` points to an existing writable location or leave default `./appointments.db` in `server` folder.
- If CORS issues occur when running client+server separately, enable CORS config in `server/src/index.ts` (already included in dependencies).

## Quick commands summary

```bash
# server
cd server
npm install
export DB_PATH=./appointments.db
npm run dev

# client
cd client
npm install
npm run dev
```
## Tests

There are small smoke tests for both server and client to verify basic functionality.

Run tests manually:

Server:
```bash
cd server
npm install
# ensure DB_PATH points to a writable DB or leave default
export DB_PATH=./appointments.db
npm run test
```

Client:
```bash
cd client
npm install
npm run test
```

Notes:
- The server test exercises `AppointmentsRepo` and will write to the configured SQLite DB. Use a disposable DB for CI or local test runs if you don't want to touch production data.
