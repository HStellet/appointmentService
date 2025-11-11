import express from "express";
import cors from "cors";
import helmet from "helmet";
import appointmentsRouter from "./routes/appointmentsRouter.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (_req, res) => res.send("Appointment Booking API is running"));
app.use("/api/appointments", appointmentsRouter);

export default app;