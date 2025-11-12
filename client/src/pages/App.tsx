import { useEffect, useState } from "react";
import CalendarPanel from "../components/CalendarPanel";
import BookingForm from "../components/BookingForm";
import AppointmentsTable from "../components/AppointmentsTable";
import FiltersPanel from "../components/FiltersPanel";
import type { Appointment, FormState } from "../types";
import useAppointments from "../hooks/useAppointments";
import { startOfWeekMonday } from "../utils/date";

export default function App() {
  const { availableSlots, bookedSlots, appts, load, updateLocalAppointment } = useAppointments();
  const [weekStart, setWeekStart] = useState<Date>(startOfWeekMonday());
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", reason: "", datetimeISO: "" });
  const [msg, setMsg] = useState("");

  // Filter/search state
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchDateFrom, setSearchDateFrom] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");

  useEffect(() => { load(weekStart); }, [weekStart, load]);

  function book(e: React.FormEvent) {
    e.preventDefault(); setMsg("");

    const tzOffset = -new Date().getTimezoneOffset();
    fetch(`/api/appointments?tzOffset=${tzOffset}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(async r => { if (!r.ok) { const x = await r.json().catch(() => ({})); throw new Error(x.error || `HTTP ${r.status}`); } return r.json(); })
      .then(_ => { setMsg("Booked!"); setForm({ datetimeISO: "", name: "", email: "", phone: "", reason: "" }); load(weekStart); })
      .catch(err => setMsg(err.message));
  }

  function cancel(id: number) {
    if (!confirm("Cancel this appointment?")) return;
    fetch(`/api/appointments/${id}`, { method: "DELETE" })
      .then(_ => load(weekStart));
  }

  function onUpdated(updated: Appointment) {
    updateLocalAppointment(updated);
    load(weekStart);
  }

  // Filter logic for appointments
  const filteredAppts = appts.filter(appt => {
    const matchesName =
      !searchName.trim() ||
      appt.name.toLowerCase().includes(searchName.trim().toLowerCase());
    const matchesEmail =
      !searchEmail.trim() ||
      appt.email.toLowerCase().includes(searchEmail.trim().toLowerCase());
    const matchesPhone =
      !searchPhone.trim() ||
      (appt.phone || "").toLowerCase().includes(searchPhone.trim().toLowerCase());

    const apptDateISO = appt.datetime
      ? new Date(appt.datetime).toISOString().slice(0, 10)
      : "";
    const fromOk = !searchDateFrom || apptDateISO >= searchDateFrom;
    const toOk = !searchDateTo || apptDateISO <= searchDateTo;
    const matchesDate = fromOk && toOk;

    return matchesName && matchesEmail && matchesPhone && matchesDate;
  });

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h1 className="fw-bold">Appointment Booking</h1>
        <div className="text-muted">Mon–Fri, 9:00 AM – 5:00 PM (30-minute slot)</div>
      </div>

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
        <FiltersPanel
          searchName={searchName}
          setSearchName={setSearchName}
          searchEmail={searchEmail}
          setSearchEmail={setSearchEmail}
          searchPhone={searchPhone}
          setSearchPhone={setSearchPhone}
          searchDateFrom={searchDateFrom}
          setSearchDateFrom={setSearchDateFrom}
          searchDateTo={searchDateTo}
          setSearchDateTo={setSearchDateTo}
        />

        <AppointmentsTable
          appts={filteredAppts}
          onCancel={cancel}
          availableSlots={availableSlots}
          onUpdated={onUpdated}
          refreshSlots={() => load(weekStart)}
        />
      </div>
    </div>
  );
}
