export function todayKigali() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Kigali",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function clampDateToToday(value: string) {
  const min = todayKigali();
  return !value || value < min ? min : value;
}
