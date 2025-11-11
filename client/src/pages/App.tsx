import { useEffect, useState } from "react";
import CalendarPanel from "../components/CalendarPanel";
import BookingForm from "../components/BookingForm";
import AppointmentsTable from "../components/AppointmentsTable";
import type { Appointment, FormState } from "../types";

function startOfWeekMonday(date = new Date()) {
  const t = new Date(date);
  const day = t.getDay();               // 0..6
  const diff = (day === 0 ? -6 : 1 - day);
  t.setDate(t.getDate() + diff);
  t.setHours(0, 0, 0, 0);
  return t;
}

function weekStartStr(weekStart: Date) {
  const y = weekStart.getFullYear();
  const m = String(weekStart.getMonth() + 1).padStart(2, '0');
  const d = String(weekStart.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function App() {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(startOfWeekMonday());
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", reason: "", datetimeISO: "" });
  const [msg, setMsg] = useState("");

  function load() {
    fetch(`/api/appointments/available?weekStart=${weekStartStr(weekStart)}`)
      .then(r => r.json())
      .then(d => {
        // server returns { weekStart, available, booked }
        setAvailableSlots(d.resp.available || []);
        setBookedSlots(d.resp.booked || []);
      });
    fetch(`/api/appointments`).then(r => r.json()).then(setAppts);
  }
  useEffect(() => { load(); }, [weekStart]);

  function book(e: React.FormEvent) {
    e.preventDefault(); setMsg("");

    fetch(`/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(async r => { if (!r.ok) { const x = await r.json().catch(() => ({})); throw new Error(x.error || `HTTP ${r.status}`); } return r.json(); })
      .then(_ => { setMsg("Booked!"); setForm({ datetimeISO: "", name: "", email: "", phone: "", reason: "" }); load(); })
      .catch(err => setMsg(err.message));
  }

  function cancel(id: number) {
    if (!confirm("Cancel this appointment?")) return;
    fetch(`/api/appointments/${id}`, { method: "DELETE" })
      .then(_ => load());
  }

  function onUpdated(updated: Appointment) {
    setAppts(prev => prev.map(p => p.id === updated.id ? updated : p));
  }

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold">Appointment Booking</h1>
        <div className="text-muted">Mon–Fri, 9:00 AM – 5:00 PM (30-minute slot)</div>
      </div>

      {/* Equal height columns via d-flex on columns + .equal-card on cards */}
      <div className="row g-4 align-items-stretch">
        <div className="col-md-6 equal-col">
          <CalendarPanel
            weekStart={weekStart}
            availableSlots={availableSlots}
            bookedSlots={bookedSlots}
            onPrevWeek={() => setWeekStart(new Date(weekStart.getTime() - 7 * 86400000))}
            onNextWeek={() => setWeekStart(new Date(weekStart.getTime() + 7 * 86400000))}
            onPickSlot={(s) => setForm({ ...form, datetimeISO: s })}
          />
        </div>

        <div className="col-md-6 equal-col">
          <BookingForm
            form={form}
            setForm={setForm}
            msg={msg}
            onSubmit={book}
            mode="create"
          />
        </div>
      </div>

      <div className="mt-4">
        <AppointmentsTable appts={appts} onCancel={cancel} availableSlots={availableSlots} onUpdated={onUpdated} refreshSlots={() => load()} />
      </div>
    </div>
  );
}
