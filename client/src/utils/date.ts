export function startOfWeekMonday(date = new Date()) {
  const t = new Date(date);
  const day = t.getDay();               // 0..6
  const diff = (day === 0 ? -6 : 1 - day);
  t.setDate(t.getDate() + diff);
  t.setHours(0, 0, 0, 0);
  return t;
}

export function weekStartStr(weekStart: Date) {
  const y = weekStart.getFullYear();
  const m = String(weekStart.getMonth() + 1).padStart(2, '0');
  const d = String(weekStart.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
