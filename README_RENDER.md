Render deployment instructions (one-time quick steps)

1) Commit and push your code to a Git provider connected to Render (GitHub/GitLab/Bitbucket).

2) In the Render dashboard create a new service -> "Web Service" and connect the repository.

3) Render will detect the `render.yaml` at the repo root and create the `appointment-booking-server` service.

4) The service in `render.yaml` requests a 1GB disk mount at `/data`. In the Render service settings, confirm the disk attachment. Render will mount it at `/data` inside the container.

5) Confirm the environment variable `DB_PATH` is set to `/data/appointments.db` (already set in `render.yaml`). This makes SQLite use the persistent disk.

6) Deploy. After build completes, Render will start the service. The application listens on the port provided by Render via the `PORT` env var (already supported in `server/src/index.ts`).

Quick checks after deploy

- Visit the service public URL from the Render UI. You should see the API root message: "Appointment Booking API is running".
- Use the API endpoints under /api/appointments to test functionality.

Local quick test

```bash
cd server
npm ci
DB_PATH=./data/appointments.db npm run dev
```

If you hit issues, paste the server logs here and I'll help debug.
