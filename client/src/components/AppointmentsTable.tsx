import { Appointment } from "../types";
import { useMemo, useState, useEffect } from "react";

type Props = {
  appts: Appointment[];
  onCancel: (id: number) => void;
  availableSlots: string[];
  onUpdated: (a: Appointment) => void;
  refreshSlots: () => void;
};

export default function AppointmentsTable({ appts, onCancel, availableSlots, onUpdated, refreshSlots }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ datetime: "", name: "", email: "", phone: "", reason: "" });

  useEffect(() => {
    if (editingId == null) return;
    const a = appts.find(x => x.id === editingId);
    if (a) setForm({ datetime: a.datetime, name: a.name, email: a.email, phone: a.phone || "", reason: a.reason || "" });
  }, [editingId, appts]);

  const datetimeOptions = useMemo(() => {
    return (availableSlots || []).slice().concat([]).sort();
  }, [availableSlots]);

  function startEdit(a: Appointment) {
    setEditingId(a.id);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function change<K extends keyof typeof form>(k: K, v: string) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function save(id: number) {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datetimeISO: form.datetime, name: form.name, email: form.email, phone: form.phone || null, reason: form.reason || null })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        alert("Save failed: " + (err.error || err.message || res.statusText));
        return;
      }
      const updated: Appointment = await res.json();
      onUpdated(updated);
      await refreshSlots();
      setEditingId(null);
    } catch (err: any) {
      alert("Save error: " + (err?.message || err));
    }
  }

  return (
    <div className="card">
      <div className="card-header"><h5 className="mb-0">All Appointments</h5></div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Date/Time</th><th>Name</th><th>Email</th><th>Phone</th><th>Reason</th><th>Manage</th>
              </tr>
            </thead>
            <tbody>
              {appts.map(a => (
                <tr key={a.id}>
                  <td>
                    {editingId === a.id ? (
                      <select className="form-select form-select-sm" value={form.datetime} onChange={e => change("datetime", e.target.value)}>
                        {new Set([...(availableSlots || []), a.datetime]).size > 0 && Array.from(new Set([...(availableSlots || []), a.datetime])).map(d => (
                          <option key={d} value={d}>{new Date(d).toLocaleString()}</option>
                        ))}
                      </select>
                    ) : (
                      new Date(a.datetime).toLocaleString()
                    )}
                  </td>
                  <td>{editingId === a.id ? <input className="form-control form-control-sm" value={form.name} onChange={e => change("name", e.target.value)} /> : a.name}</td>
                  <td>{editingId === a.id ? <input className="form-control form-control-sm" value={form.email} onChange={e => change("email", e.target.value)} /> : a.email}</td>
                  <td>{editingId === a.id ? <input className="form-control form-control-sm" value={form.phone} onChange={e => change("phone", e.target.value)} /> : (a.phone || "-")}</td>
                  <td>{editingId === a.id ? <input className="form-control form-control-sm" value={form.reason} onChange={e => change("reason", e.target.value)} /> : (a.reason || "-")}</td>
                  <td>
                  {editingId === a.id ? (
                    <>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => save(a.id)}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => { cancelEdit(); }}>
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                    <button className="btn btn-outline-danger btn-sm me-2" onClick={() => {
                        if (editingId === a.id) { cancelEdit(); return; }
                        if (!confirm("Cancel this appointment?")) return;
                        onCancel(a.id);
                        refreshSlots();
                      }}>
                        Cancel
                      </button><button className="btn btn-outline-secondary btn-sm" onClick={() => startEdit(a)}>Edit</button></>
                    )}
                </td>
                  
              </tr>
            ))}
              {appts.length === 0 && (
                <tr><td colSpan={7} className="text-center text-muted">No appointments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
