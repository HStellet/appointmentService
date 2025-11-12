export const SLOT_MINUTES = 30;
export const BUSINESS_START_HOUR = 9;
export const BUSINESS_END_HOUR = 17;
export function isBusinessTime(date) {
    const day = date.getDay(); // 0 Sun - 6 Sat
    if (day === 0 || day === 6)
        return false;
    const mins = date.getHours() * 60 + date.getMinutes();
    const start = BUSINESS_START_HOUR * 60;
    const end = BUSINESS_END_HOUR * 60;
    return mins >= start && mins < end && (date.getMinutes() % SLOT_MINUTES === 0);
}
export function* generateSlotsForWeek(weekStartDate) {
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStartDate);
        day.setDate(day.getDate() + i);
        for (let h = BUSINESS_START_HOUR; h < BUSINESS_END_HOUR; h++) {
            for (let m = 0; m < 60; m += SLOT_MINUTES) {
                const slot = new Date(day);
                slot.setHours(h, m, 0, 0);
                if (slot.getDay() !== 0 && slot.getDay() !== 6)
                    yield slot;
            }
        }
    }
}
export function toISOMinute(date) {
    const d = new Date(date);
    d.setSeconds(0, 0);
    return d.toISOString();
}
