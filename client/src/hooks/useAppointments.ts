import { useCallback, useState } from "react";
import type { Appointment } from "../types";
import { weekStartStr } from "../utils/date";

export default function useAppointments() {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);

  const load = useCallback((weekStart: Date) => {
    fetch(`/api/appointments/available?weekStart=${weekStartStr(weekStart)}`)
      .then(r => r.json())
      .then(d => {
        setAvailableSlots(d.resp?.available || []);
        setBookedSlots(d.resp?.booked || []);
      })
      .catch(() => { /* ignore for now */ });

    fetch(`/api/appointments`)
      .then(r => r.json())
      .then((data: Appointment[]) => setAppts(data))
      .catch(() => { /* ignore for now */ });
  }, []);

  const updateLocalAppointment = useCallback((updated: Appointment) => {
    setAppts(prev => prev.map(p => p.id === updated.id ? updated : p));
  }, []);

  return {
    availableSlots,
    bookedSlots,
    appts,
    load,
    updateLocalAppointment,
    setAppts
  } as const;
}
