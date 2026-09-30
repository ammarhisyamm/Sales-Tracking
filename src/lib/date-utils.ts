const pad2 = (value: number) => String(value).padStart(2, "0");
const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

export function todayInputDate() {
  const date = new Date();
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function inputDateToLocalIso(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toISOString();
}

export function formatInputDateLong(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${MONTHS_ID[month - 1]} ${year}`;
}
