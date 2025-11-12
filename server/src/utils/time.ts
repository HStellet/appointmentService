export const SLOT_MINUTES = 30 as const;
export const BUSINESS_START_HOUR = 9 as const;
export const BUSINESS_END_HOUR = 17 as const;

export function isBusinessTime(date: Date, tzOffsetMinutes?: number): boolean {
  // If tzOffsetMinutes provided, interpret 'date' in that timezone
  // tzOffsetMinutes follows Date.getTimezoneOffset() meaning minutes to add to local time to get UTC
  const localMs = date.getTime() + (tzOffsetMinutes || 0) * 60_000;
  const local = new Date(localMs);
  const day = local.getUTCDay(); // 0 Sun - 6 Sat
  if (day === 0 || day === 6) return false;
  const mins = local.getUTCHours() * 60 + local.getUTCMinutes();
  const start = BUSINESS_START_HOUR * 60;
  const end = BUSINESS_END_HOUR * 60;
  return mins >= start && mins < end && (local.getUTCMinutes() % SLOT_MINUTES === 0);
}

export function* generateSlotsForWeek(weekStartDate: Date, tzOffsetMinutes?: number): Generator<Date> {
  // weekStartDate: use its year/month/date as the base local day (client's calendar date)
  const year = weekStartDate.getFullYear();
  const month = weekStartDate.getMonth();
  const dayBase = weekStartDate.getDate();
  for (let i = 0; i < 7; i++) {
    for (let h = BUSINESS_START_HOUR; h < BUSINESS_END_HOUR; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        // Compute the UTC instant that corresponds to the client's local year-month-(dayBase+i) at time h:m
        const utcMillis = Date.UTC(year, month, dayBase + i, h, m, 0) - (tzOffsetMinutes || 0) * 60_000;
        const s = new Date(utcMillis);
        yield s;
      }
    }
  }
}

function shiftDateByOffset(date: Date, tzOffsetMinutes: number): Date {
  // Client will send getTimezoneOffset() -> minutes to add to local time to get UTC.
  // To convert the server-local date to the client's local time, subtract the tzOffsetMinutes.
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - tzOffsetMinutes);
  return d;
}

export function toISOMinute(date: Date): string {
  const d = new Date(date);
  d.setSeconds(0, 0);
  return d.toISOString();
}