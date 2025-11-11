import { Router } from "express";
import AppointmentService from "../services/appointmentService.js";

const router = Router();
const svc = new AppointmentService();

router.get("/", (_req, res) => {
  res.json(svc.listAll());
});

router.get("/available", (req, res) => {
  const qs = req.query.weekStart as string | undefined;
  let weekStart: Date;
  if (qs) {
    weekStart = new Date(`${qs}T00:00:00`);
  } else {
    const temp = new Date();
    const d = temp.getDay();
    const diff = (d === 0 ? -6 : 1 - d);
    temp.setDate(temp.getDate() + diff);
    temp.setHours(0, 0, 0, 0);
    weekStart = temp;
  }
  const { available, booked } = svc.getAvailableSlots(weekStart);
  res.json({ weekStart: weekStart.toISOString(), resp: { available, booked } });
});

router.post("/", (req, res) => {
  try {
    const created = svc.create(req.body || {});
    res.status(201).json(created);
  } catch (e: any) {
    res.status(e?.status || 500).json({ error: e?.message || "Internal server error" });
  }
});

router.delete("/:id", (req, res) => {
  try {
    const out = svc.cancel(req.params.id);
    res.json(out);
  } catch (e: any) {
    res.status(e?.status || 500).json({ error: e?.message || "Internal server error" });
  }
});

router.patch("/update/:id", (req, res) => {
  try {
    const out = svc.update(req.params.id, req.body || {});
    res.json(out);
  } catch (e: any) {
    res.status(e?.status || 500).json({ error: e?.message || "Internal server error" });
  }
});

export default router;