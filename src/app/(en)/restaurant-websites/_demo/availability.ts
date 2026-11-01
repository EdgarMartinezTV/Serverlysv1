import { HOURS } from "./menu";

/**
 * Reservation availability for the demo — deterministic, not random, so the
 * assistant can quote times ("Friday has tables at 7:30 and 9:00") that the
 * reservation form then shows as open. Both read this one function.
 */

export type Slot = { minutes: number; available: boolean };

/** Last seating is an hour before close; slots every 30 minutes. */
export function slotsFor(date: Date, party: number, now?: Date): Slot[] {
  const hours = HOURS[date.getDay()];
  if (!hours) return [];
  const sameDay = now && sameDate(date, now);
  const earliest = sameDay ? now.getHours() * 60 + now.getMinutes() + 30 : 0;
  const busy = party > 6 ? 5 : 3;
  const slots: Slot[] = [];
  for (let m = hours.open; m <= hours.close - 60; m += 30) {
    if (m < earliest) continue;
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${m}-${party > 6 ? "L" : "S"}`;
    slots.push({ minutes: m, available: hash(key) % 10 >= busy });
  }
  return slots;
}

export function sameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Midnight `offset` days after `from`. */
export function addDays(from: Date, offset: number): Date {
  return new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset);
}

/** The next date (today included) that falls on `weekday`. */
export function nextWeekday(from: Date, weekday: number): Date {
  const delta = (weekday - from.getDay() + 7) % 7;
  return addDays(from, delta);
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
