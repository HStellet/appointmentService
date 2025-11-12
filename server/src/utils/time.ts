import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";

export const SLOT_MINUTES = 30 as const;
export const BUSINESS_START_HOUR = 9 as const;
export const BUSINESS_END_HOUR = 17 as const;

// Interpret a UTC instant `date` in the given IANA zone (if provided), otherwise fall back to tzOffsetMinutes.
export function isBusinessTime(date: Date, tzOrOffset?: string | number): boolean {
  let local: Date;
  if (typeof tzOrOffset === "string" && tzOrOffset.length > 0) {
    // convert UTC instant to zoned time
    local = utcToZonedTime(date, tzOrOffset);
  } else if (typeof tzOrOffset === "number") {
    const localMs = date.getTime() + tzOrOffset * 60_000;
    local = new Date(localMs);
  } else {
    // no tz provided — use server local interpretation
    local = date;
  }

  const day = local.getDay(); // 0 Sun - 6 Sat
  if (day === 0 || day === 6) return false;
  const mins = local.getHours() * 60 + local.getMinutes();
  const start = BUSINESS_START_HOUR * 60;
  const end = BUSINESS_END_HOUR * 60;
  return mins >= start && mins < end && (local.getMinutes() % SLOT_MINUTES === 0);
}

// Generate UTC instants for each local slot in the provided IANA zone, or using tzOffsetMinutes when zone not provided.
export function* generateSlotsForWeek(weekStartDate: Date, tzOrOffset?: string | number): Generator<Date> {
  const year = weekStartDate.getFullYear();
  const month = weekStartDate.getMonth();
  const dayBase = weekStartDate.getDate();

  for (let i = 0; i < 7; i++) {
    for (let h = BUSINESS_START_HOUR; h < BUSINESS_END_HOUR; h++) {
      for (let m = 0; m < 60; m += SLOT_MINUTES) {
        if (typeof tzOrOffset === "string" && tzOrOffset.length > 0) {
          // local date/time string for the zone — convert to UTC instant
          const localStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayBase + i).padStart(2, "0")} ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
          const utc = zonedTimeToUtc(localStr, tzOrOffset);
          yield utc;
        } else if (typeof tzOrOffset === "number") {
          const utcMillis = Date.UTC(year, month, dayBase + i, h, m, 0) - tzOrOffset * 60_000;
          yield new Date(utcMillis);
        } else {
          // server-local generation
          yield new Date(Date.UTC(year, month, dayBase + i, h, m, 0));
        }
      }
    }
  }
}

export function toISOMinute(date: Date): string {
  const d = new Date(date);
  d.setSeconds(0, 0);
  return d.toISOString();
}