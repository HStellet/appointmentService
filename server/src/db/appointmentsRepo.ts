import db from "./index.js";
import type { Appointment } from "../types.js";

export default class AppointmentsRepo {
  getAll(): Appointment[] {
    return db.prepare<[], Appointment>("SELECT * FROM appointments ORDER BY datetime ASC").all();
  }

  getByDatetime(iso: string): Appointment | undefined {
    return db.prepare<[string], Appointment>("SELECT * FROM appointments WHERE datetime = ?").get(iso);
  }

  insert({ datetime, name, email, phone, reason }:
         { datetime: string; name: string; email: string; phone?: string | null; reason?: string | null; }): Appointment {
    const info = db.prepare(`
      INSERT INTO appointments (datetime, name, email, phone, reason, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(datetime, name, email, phone ?? null, (reason ?? "").trim(), new Date().toISOString());
    return db.prepare<[number], Appointment>("SELECT * FROM appointments WHERE id = ?").get(Number(info.lastInsertRowid))!;
  }

  deleteById(id: number) {
    return db.prepare<[number]>("DELETE FROM appointments WHERE id = ?").run(id);
  }

  getAllDatetimesSet(): Set<string> {
    const rows = db.prepare<[], { datetime: string }>("SELECT datetime FROM appointments").all();
    return new Set(rows.map(r => r.datetime));
  }

  getById(id: number): Appointment | undefined {
    return db.prepare<[number], Appointment>("SELECT * FROM appointments WHERE id = ?").get(id);
  }

  update(id: number, { datetime, name, email, phone, reason }:
         { datetime: string; name: string; email: string; phone?: string | null; reason?: string | null; }): Appointment {
    db.prepare(`
      UPDATE appointments
      SET datetime = ?, name = ?, email = ?, phone = ?, reason = ?
      WHERE id = ?
    `).run(datetime, name, email, phone ?? null, (reason ?? "").trim(), id);
    return db.prepare<[number], Appointment>("SELECT * FROM appointments WHERE id = ?").get(id)!;
  }

}