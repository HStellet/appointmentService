import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import fs from "fs";
import appointmentsRouter from "./routes/appointmentsRouter.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

// Serve built client when available. During Render build we copy client/dist -> server/dist/public
const publicPath = path.resolve(process.cwd(), "dist", "public");
if (fs.existsSync(publicPath)) {
	app.use(express.static(publicPath));
	// For SPA routes, serve index.html for non-API requests
	app.get("/", (_req, res) => res.sendFile(path.join(publicPath, "index.html")));
} else {
	app.get("/", (_req, res) => res.send("Appointment Booking API is running"));
}

app.use("/api/appointments", appointmentsRouter);

// centralized error handling
app.use(errorHandler);

export default app;