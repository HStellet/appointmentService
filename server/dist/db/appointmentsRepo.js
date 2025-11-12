import db from "./index.js";
export default class AppointmentsRepo {
    getAll() {
        return db.prepare("SELECT * FROM appointments ORDER BY datetime ASC").all();
    }
    getByDatetime(iso) {
        return db.prepare("SELECT * FROM appointments WHERE datetime = ?").get(iso);
    }
    insert({ datetime, name, email, phone, reason }) {
        const info = db.prepare(`
      INSERT INTO appointments (datetime, name, email, phone, reason, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(datetime, name, email, phone ?? null, (reason ?? "").trim(), new Date().toISOString());
        return db.prepare("SELECT * FROM appointments WHERE id = ?").get(Number(info.lastInsertRowid));
    }
    deleteById(id) {
        return db.prepare("DELETE FROM appointments WHERE id = ?").run(id);
    }
    getAllDatetimesSet() {
        const rows = db.prepare("SELECT datetime FROM appointments").all();
        return new Set(rows.map((r) => r.datetime));
    }
    getById(id) {
        return db.prepare("SELECT * FROM appointments WHERE id = ?").get(id);
    }
    update(id, { datetime, name, email, phone, reason }) {
        db.prepare(`
      UPDATE appointments
      SET datetime = ?, name = ?, email = ?, phone = ?, reason = ?
      WHERE id = ?
    `).run(datetime, name, email, phone ?? null, (reason ?? "").trim(), id);
        return db.prepare("SELECT * FROM appointments WHERE id = ?").get(id);
    }
}
