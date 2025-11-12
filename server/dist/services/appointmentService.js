import AppointmentsRepo from "../db/appointmentsRepo.js";
import { isBusinessTime, generateSlotsForWeek, toISOMinute } from "../utils/time.js";
export default class AppointmentService {
    repo = new AppointmentsRepo();
    listAll() {
        return this.repo.getAll();
    }
    getAvailableSlots(weekStart) {
        const now = new Date();
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const bookedInWindow = new Set(this.repo.getAll()
            .map(a => a.datetime)
            .filter(iso => {
            const d = new Date(iso);
            return d >= now && d >= weekStart && d < weekEnd && isBusinessTime(d);
        }));
        const available = [];
        const booked = [];
        for (const slot of generateSlotsForWeek(weekStart)) {
            if (slot < now || slot >= weekEnd)
                continue;
            if (!isBusinessTime(slot))
                continue;
            const iso = toISOMinute(slot);
            (bookedInWindow.has(iso) ? booked : available).push(iso);
        }
        available.sort();
        booked.sort();
        return { available, booked };
    }
    create(input) {
        const { datetimeISO, name, email, phone, reason } = input || {};
        if (!datetimeISO || !name || !email) {
            const e = new Error("datetimeISO, name, and email are required");
            e.status = 400;
            throw e;
        }
        const dt = new Date(datetimeISO);
        if (isNaN(dt.valueOf())) {
            const e = new Error("Invalid datetime");
            e.status = 422;
            throw e;
        }
        dt.setSeconds(0, 0);
        const now = new Date();
        if (dt < now) {
            const e = new Error("Cannot book in the past");
            e.status = 422;
            throw e;
        }
        if (!isBusinessTime(dt)) {
            const e = new Error("Outside business hours or not on a 30-minute slot (Mon-Fri, 9-17)");
            e.status = 422;
            throw e;
        }
        if (typeof name !== "string" || name.trim().length === 0) {
            const e = new Error("Name is required");
            e.status = 422;
            throw e;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof email !== "string" || !emailRegex.test(email.trim())) {
            const e = new Error("Invalid email");
            e.status = 422;
            throw e;
        }
        if (typeof reason === "string" && reason.trim().length > 200) {
            const e = new Error("Reason must be <= 200 characters");
            e.status = 422;
            throw e;
        }
        const iso = toISOMinute(dt);
        if (this.repo.getByDatetime(iso)) {
            const e = new Error("Time slot already booked");
            e.status = 409;
            throw e;
        }
        return this.repo.insert({ datetime: iso, name: name.trim(), email: email.trim(), phone, reason });
    }
    cancel(id) {
        const num = Number(id);
        if (!Number.isInteger(num)) {
            const e = new Error("Invalid id");
            e.status = 400;
            throw e;
        }
        const row = this.repo.getById(num);
        if (!row) {
            const e = new Error("Appointment not found");
            e.status = 404;
            throw e;
        }
        this.repo.deleteById(num);
        return { success: true };
    }
    update(id, input) {
        const num = Number(id);
        if (!Number.isInteger(num)) {
            const e = new Error("Invalid id");
            e.status = 400;
            throw e;
        }
        const existing = this.repo.getById(num);
        if (!existing) {
            const e = new Error("Appointment not found");
            e.status = 404;
            throw e;
        }
        const { datetimeISO, name, email, phone, reason } = input || {};
        if (!datetimeISO || !name || !email) {
            const e = new Error("datetimeISO, name, and email are required");
            e.status = 400;
            throw e;
        }
        const dt = new Date(datetimeISO);
        if (isNaN(dt.valueOf())) {
            const e = new Error("Invalid datetime");
            e.status = 422;
            throw e;
        }
        dt.setSeconds(0, 0);
        const now = new Date();
        if (dt < now) {
            const e = new Error("Cannot book in the past");
            e.status = 422;
            throw e;
        }
        if (!isBusinessTime(dt)) {
            const e = new Error("Outside business hours or not on a 30-minute slot (Mon-Fri, 9-17)");
            e.status = 422;
            throw e;
        }
        if (typeof name !== "string" || name.trim().length === 0) {
            const e = new Error("Name is required");
            e.status = 422;
            throw e;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof email !== "string" || !emailRegex.test(email.trim())) {
            const e = new Error("Invalid email");
            e.status = 422;
            throw e;
        }
        if (typeof reason === "string" && reason.trim().length > 200) {
            const e = new Error("Reason must be <= 200 characters");
            e.status = 422;
            throw e;
        }
        const iso = toISOMinute(dt);
        const other = this.repo.getByDatetime(iso);
        if (other && other.id !== num) {
            const e = new Error("Time slot already booked");
            e.status = 409;
            throw e;
        }
        return this.repo.update(num, { datetime: iso, name: name.trim(), email: email.trim(), phone, reason });
    }
}
