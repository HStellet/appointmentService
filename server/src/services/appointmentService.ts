import AppointmentsRepo from "../db/appointmentsRepo.js";
import { isBusinessTime, generateSlotsForWeek, toISOMinute } from "../utils/time.js";
import type { Appointment, CreateAppointmentInput } from "../types.js";

export default class AppointmentService {
  private repo = new AppointmentsRepo();

  listAll(): Appointment[] {
    return this.repo.getAll();
  }

  getAvailableSlots(weekStart: Date, tzOrOffset?: string | number): { available: string[]; booked: string[] } {
    const now = new Date();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const bookedInWindow = new Set<string>(
      this.repo.getAll()
        .map(a => a.datetime)
        .filter(iso => {
          const d = new Date(iso);
          return d >= now && d >= weekStart && d < weekEnd && isBusinessTime(d, tzOrOffset);
        })
    );

    const available: string[] = [];
    const booked: string[] = [];

    for (const slot of generateSlotsForWeek(weekStart, tzOrOffset)) {
      if (slot < now || slot >= weekEnd) continue;
      if (!isBusinessTime(slot, tzOrOffset)) continue;
      const iso = toISOMinute(slot);
      (bookedInWindow.has(iso) ? booked : available).push(iso);
    }
    available.sort();
    booked.sort();
    return { available, booked };
  }


  create(input: CreateAppointmentInput, tzOrOffset?: string | number): Appointment {
    const { datetimeISO, name, email, phone, reason } = input || ({} as CreateAppointmentInput);
    if (!datetimeISO || !name || !email) {
      const e: any = new Error("datetimeISO, name, and email are required"); e.status = 400; throw e;
    }
    const dt = new Date(datetimeISO);
    if (isNaN(dt.valueOf())) { const e: any = new Error("Invalid datetime"); e.status = 422; throw e; }
    dt.setSeconds(0, 0);
  const now = new Date();
  // compare instants - dt is an absolute UTC instant; booking in the past is independent of tz
  if (dt < now) { const e: any = new Error("Cannot book in the past"); e.status = 422; throw e; }
  if (!isBusinessTime(dt, tzOrOffset)) {
      const e: any = new Error("Outside business hours or not on a 30-minute slot (Mon-Fri, 9-17)"); e.status = 422; throw e;
    }
    if (typeof name !== "string" || name.trim().length === 0) { const e: any = new Error("Name is required"); e.status = 422; throw e; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email.trim())) { const e: any = new Error("Invalid email"); e.status = 422; throw e; }
    if (typeof reason === "string" && reason.trim().length > 200) { const e: any = new Error("Reason must be <= 200 characters"); e.status = 422; throw e; }

    const iso = toISOMinute(dt);
    if (this.repo.getByDatetime(iso)) { const e: any = new Error("Time slot already booked"); e.status = 409; throw e; }

    return this.repo.insert({ datetime: iso, name: name.trim(), email: email.trim(), phone, reason });
  }

  cancel(id: string) {
    const num = Number(id);
    if (!Number.isInteger(num)) { const e: any = new Error("Invalid id"); e.status = 400; throw e; }
    const row = this.repo.getById(num);
    if (!row) { const e: any = new Error("Appointment not found"); e.status = 404; throw e; }
    this.repo.deleteById(num);
    return { success: true as const };
  }

  update(id: string, input: CreateAppointmentInput, tzOrOffset?: string | number): Appointment {
    const num = Number(id);
    if (!Number.isInteger(num)) { const e: any = new Error("Invalid id"); e.status = 400; throw e; }

    const existing = this.repo.getById(num);
    if (!existing) { const e: any = new Error("Appointment not found"); e.status = 404; throw e; }

    const { datetimeISO, name, email, phone, reason } = input || ({} as CreateAppointmentInput);
    if (!datetimeISO || !name || !email) {
      const e: any = new Error("datetimeISO, name, and email are required"); e.status = 400; throw e;
    }

    const dt = new Date(datetimeISO);
    if (isNaN(dt.valueOf())) { const e: any = new Error("Invalid datetime"); e.status = 422; throw e; }
    dt.setSeconds(0, 0);

  const now = new Date();
  if (dt < now) { const e: any = new Error("Cannot book in the past"); e.status = 422; throw e; }
  if (!isBusinessTime(dt, tzOrOffset)) {
      const e: any = new Error("Outside business hours or not on a 30-minute slot (Mon-Fri, 9-17)"); e.status = 422; throw e;
    }

    if (typeof name !== "string" || name.trim().length === 0) { const e: any = new Error("Name is required"); e.status = 422; throw e; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email.trim())) { const e: any = new Error("Invalid email"); e.status = 422; throw e; }
    if (typeof reason === "string" && reason.trim().length > 200) { const e: any = new Error("Reason must be <= 200 characters"); e.status = 422; throw e; }

    const iso = toISOMinute(dt);
    const other = this.repo.getByDatetime(iso);
    if (other && other.id !== num) { const e: any = new Error("Time slot already booked"); e.status = 409; throw e; }

    return this.repo.update(num, { datetime: iso, name: name.trim(), email: email.trim(), phone, reason });
  }
}