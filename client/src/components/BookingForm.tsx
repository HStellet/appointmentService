import { FormState } from "../types";

type Props = {
  form: FormState;
  setForm: (f: FormState) => void;
  msg: string;
  onSubmit: (e: React.FormEvent) => void;
  mode?: "create" | "edit";
};

export default function BookingForm({ form, setForm, msg, onSubmit, mode = "create" }: Props) {
  return (
    <div className="card equal-card">
      <div className="card-header">
        <h5 className="mb-0">{mode === "edit" ? "Edit Appointment" : "Book a Slot"}</h5>
      </div>
      <div className="card-body">
        <form className="row g-3" onSubmit={onSubmit}>
          <div className="col-12">
            <label className="form-label">Time:</label>
            <input
              className="form-control"
              required={mode === "create"}
              value={form.datetimeISO}
              onChange={e => setForm({ ...form, datetimeISO: e.target.value })}
              placeholder="Pick from calendar or enter ISO string"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Name*</label>
            <input className="form-control" required
                   value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}/>
          </div>
          <div className="col-md-6">
            <label className="form-label">Email*</label>
            <input className="form-control" type="email" required
                   value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input className="form-control"
                   value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/>
          </div>
          <div className="col-md-6">
            <label className="form-label">Reason (max 200)</label>
            <textarea className="form-control" maxLength={200}
                      value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}/>
          </div>
          <div className="col-12 d-flex gap-2">
            <button className="btn btn-primary" type="submit">
              {mode === "edit" ? "Save" : "Book"}
            </button>
          </div>
          {msg && <div className="col-12 text-success fw-semibold">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
