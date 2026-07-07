export const IST_TIMEZONE = "Asia/Kolkata";

export function getDateParts(date = new Date(), timeZone = IST_TIMEZONE) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long"
  });
  const parts = formatter.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return {
    year: part("year"),
    month: part("month"),
    day: part("day"),
    weekday: part("weekday")
  };
}

export function todayKey(date = new Date(), timeZone = IST_TIMEZONE) {
  const parts = getDateParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function readableDate(date = new Date(), timeZone = IST_TIMEZONE) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function readableTime(date = new Date(), timeZone = IST_TIMEZONE) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short"
  }).format(date);
}

export function dateKeyToDate(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function shiftDateKey(key: string, offsetDays: number) {
  const date = dateKeyToDate(key);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export function lastNDays(count: number, endKey = todayKey()) {
  return Array.from({ length: count }, (_, index) => shiftDateKey(endKey, index - count + 1));
}

export function daysBetween(startKey: string, endKey: string) {
  const start = dateKeyToDate(startKey).getTime();
  const end = dateKeyToDate(endKey).getTime();
  return Math.round((end - start) / 86_400_000);
}

export function monthLabel(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1))
  );
}
