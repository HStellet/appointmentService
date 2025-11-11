export interface Appointment {
  id: number;
  datetime: string; // ISO minute precision
  name: string;
  email: string;
  phone?: string | null;
  reason?: string | null;
  created_at: string;
}

export interface CreateAppointmentInput {
  datetimeISO: string;
  name: string;
  email: string;
  phone?: string;
  reason?: string;
}