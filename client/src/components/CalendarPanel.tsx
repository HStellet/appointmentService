import { FormEvent } from "react";

type Props = {
  weekStart: Date;
  availableSlots: string[];
  bookedSlots: string[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onPickSlot: (s: string) => void;
};

export default function CalendarPanel({
  weekStart, availableSlots, bookedSlots, onPrevWeek, onNextWeek, onPickSlot
}: Props) {
  return (
    <div className="card equal-card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Calendar (Week)</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={onPrevWeek}>◀ Prev</button>
          <button className="btn btn-outline-secondary btn-sm" onClick={onNextWeek}>Next ▶</button>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-2 text-muted"><strong>Week of:</strong> {weekStart.toDateString()}</div>

        <p className="text-secondary mb-2">Available slots (click to fill the form):</p>
        {availableSlots.length === 0 && (
        <div className="text-muted mb-2">No available slots this week.</div>
        )}

        <div className="slots-list">
            <div className="row g-2">
                {availableSlots.map(s => (
                <div className="col-6" key={s}>
                    <button className="btn btn-soft w-100" onClick={() => onPickSlot(s)}>
                    {new Date(s).toLocaleString()}
                    </button>
                </div>
                ))}
            </div>
        </div>

        <p className="text-secondary mb-2">Booked slots</p>

        {bookedSlots.length === 0 && (
        <div className="text-muted mb-2">No booked slots this week.</div>
        )}

        <div className="slots-list">
            <div className="row g-2">
                {bookedSlots.map(s => (
                <div className="col-6" key={s}>
                    <button className="btn btn-outline-secondary w-100" disabled>
                    {new Date(s).toLocaleString()}
                    </button>
                </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
