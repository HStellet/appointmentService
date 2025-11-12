import { Request, Response, NextFunction } from "express";
import type AppointmentService from "../services/appointmentService.js";

export default class AppointmentController {
  private svc: AppointmentService;
  constructor(svc: AppointmentService) {
    this.svc = svc;
  }

  listAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const out = this.svc.listAll();
      return res.json(out);
    } catch (err) {
      return next(err);
    }
  }

  getAvailable(req: Request, res: Response, next: NextFunction) {
    try {
      const qs = req.query.weekStart as string | undefined;
      let weekStart: Date;
      if (qs) {
        const d = new Date(`${qs}T00:00:00`);
        if (Number.isNaN(d.getTime())) {
          const e: any = new Error("Invalid weekStart date"); e.status = 400; throw e;
        }
        weekStart = d;
      } else {
        const temp = new Date();
        const d = temp.getDay();
        const diff = (d === 0 ? -6 : 1 - d);
        temp.setDate(temp.getDate() + diff);
        temp.setHours(0, 0, 0, 0);
        weekStart = temp;
      }

  // optional timezone offset in minutes (client should send getTimezoneOffset() for the weekStart date)
  const tzOffsetQs = req.query.tzOffset as string | undefined;
  const tzOffset = tzOffsetQs ? Number(tzOffsetQs) : undefined;
  const { available, booked } = this.svc.getAvailableSlots(weekStart, tzOffset);
      return res.json({ weekStart: weekStart.toISOString(), resp: { available, booked } });
    } catch (err) {
      return next(err);
    }
  }

  create(req: Request, res: Response, next: NextFunction) {
    try {
  const tzOffsetQs = req.query.tzOffset as string | undefined;
  const tzOffset = tzOffsetQs ? Number(tzOffsetQs) : undefined;
  const created = this.svc.create(req.body || {}, tzOffset);
      return res.status(201).json(created);
    } catch (err) {
      return next(err);
    }
  }

  cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const out = this.svc.cancel(req.params.id);
      return res.json(out);
    } catch (err) {
      return next(err);
    }
  }

  update(req: Request, res: Response, next: NextFunction) {
    try {
  const tzOffsetQs = req.query.tzOffset as string | undefined;
  const tzOffset = tzOffsetQs ? Number(tzOffsetQs) : undefined;
  const out = this.svc.update(req.params.id, req.body || {}, tzOffset);
      return res.json(out);
    } catch (err) {
      return next(err);
    }
  }
}
