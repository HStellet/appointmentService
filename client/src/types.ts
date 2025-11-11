export type Appointment = {
  id: number;
  datetime: string;
  name: string;
  email: string;
  phone?: string | null;
  reason?: string | null;
  created_at: string;
};

export type FormState = {
  name: string;
  email: string;
  phone: string;
  reason: string;
  datetimeISO: string;
};
