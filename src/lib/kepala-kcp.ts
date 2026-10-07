import type { Activity } from "./mock-data";

/**
 * Satu sumber data aktivitas KCP.
 * Dipakai oleh dashboard "Pencapaian Kepala KCP" dan list mobile KACAB
 * agar kedua sisi selalu menampilkan activity yang sama.
 *
 * ADO = pinjaman yang belum lunas tapi nasabah masih meminjam (outstanding).
 * RO  = Repeat Order = pinjaman yang sudah lunas, lalu nasabah meminjam lagi.
 */
export const ADO_DESC = "Belum lunas, tapi masih meminjam";
export const RO_DESC = "Sudah lunas, meminjam lagi (Repeat Order)";

export const KCP_MONTHS = [
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

export type KcpEntryType = "ADO" | "RO";

export interface KcpActivityEntry {
  sbg: string;
  nama: string;
  tipe: KcpEntryType;
  nominal: number;
}

export type KcpActivityStatus = "Selesai" | "Terjadwal";

export interface KepalaKcpActivity {
  id: string;
  kcp: string;
  date: string; // ISO yyyy-mm-dd
  time: string;
  title: string;
  activityTypes?: string[];
  place: string;
  region: string;
  priority: string;
  status: KcpActivityStatus;
  entries: KcpActivityEntry[];
  photoUrl?: string;
}

export const KCP_ACTIVITY_SEEDS: KepalaKcpActivity[] = [
  {
    id: "seed-kcp-jan-canvassing",
    kcp: "MAS RAWAMANGUN",
    date: "2026-01-15",
    time: "09:00 - 11:00 WIB",
    title: "Canvassing",
    activityTypes: ["Canvassing"],
    place: "Pasar Kemayoran",
    region: "Kemayoran, Jakarta Pusat",
    priority: "Medium",
    status: "Selesai",
    entries: [
      { sbg: "001568002501101", nama: "H. Mahmud", tipe: "ADO", nominal: 8500000 },
      { sbg: "001568002501102", nama: "Sri Wahyuni", tipe: "RO", nominal: 12000000 },
    ],
  },
  {
    id: "seed-kcp-feb-visit",
    kcp: "MAS RAWAMANGUN",
    date: "2026-02-03",
    time: "10:00 - 12:00 WIB",
    title: "Visit Nasabah One Obligor",
    activityTypes: ["Visit Nasabah One Obligor"],
    place: "Ruko Rawamangun",
    region: "Rawamangun, Jakarta Timur",
    priority: "High",
    status: "Selesai",
    entries: [
      { sbg: "001568002502201", nama: "Adam Alis", tipe: "ADO", nominal: 16000000 },
      { sbg: "001568002502202", nama: "Budi Santoso", tipe: "ADO", nominal: 4500000 },
      { sbg: "001568002502203", nama: "Rina Marlina", tipe: "RO", nominal: 22000000 },
    ],
  },
  {
    id: "seed-kcp-feb-evaluasi",
    kcp: "MAS RAWAMANGUN",
    date: "2026-02-12",
    time: "13:00 - 15:00 WIB",
    title: "Evaluasi Pencapaian Target Unit & Sales",
    activityTypes: ["Evaluasi Pencapaian Target Unit & Sales"],
    place: "KCP Rawamangun",
    region: "Rawamangun, Jakarta Timur",
    priority: "Medium",
    status: "Selesai",
    entries: [
      { sbg: "001568002502301", nama: "Made Wirawan", tipe: "RO", nominal: 9500000 },
      { sbg: "001568002502302", nama: "Putu Ayu Lestari", tipe: "ADO", nominal: 7200000 },
    ],
  },
  {
    id: "seed-kcp-feb-sosialisasi",
    kcp: "MAS RAWAMANGUN",
    date: "2026-02-20",
    time: "08:00 - 10:00 WIB",
    title: "Sosialisasi",
    activityTypes: ["Sosialisasi"],
    place: "Balai Warga Kemayoran",
    region: "Kemayoran, Jakarta Pusat",
    priority: "Medium",
    status: "Selesai",
    entries: [
      { sbg: "001568002502401", nama: "Agus Setiawan", tipe: "ADO", nominal: 6000000 },
      { sbg: "001568002502402", nama: "Dewi Lestari", tipe: "RO", nominal: 18000000 },
      { sbg: "001568002502403", nama: "Joko Prasetyo", tipe: "RO", nominal: 11000000 },
    ],
  },
  {
    id: "seed-kcp-mar-booth",
    kcp: "MAS RAWAMANGUN",
    date: "2026-03-05",
    time: "10:00 - 14:00 WIB",
    title: "Open Booth",
    activityTypes: ["Open Booth"],
    place: "Mall Kelapa Gading",
    region: "Kelapa Gading, Jakarta Utara",
    priority: "Medium",
    status: "Selesai",
    entries: [
      { sbg: "001568002503301", nama: "Siti Sarah", tipe: "ADO", nominal: 13500000 },
      { sbg: "001568002503302", nama: "Komang Arta", tipe: "RO", nominal: 20000000 },
    ],
  },
  {
    id: "seed-kcp-mar-event",
    kcp: "MAS RAWAMANGUN",
    date: "2026-03-18",
    time: "15:00 - 17:00 WIB",
    title: "Event",
    activityTypes: ["Event"],
    place: "Balai Warga Rawamangun",
    region: "Rawamangun, Jakarta Timur",
    priority: "High",
    status: "Selesai",
    // Aktivitas digital dimulai tanpa daftar nasabah. Leads akan muncul
    // setelah calon nasabah mengisi formulir pendaftaran.
    entries: [],
  },
  {
    id: "seed-kcp-apr-market",
    kcp: "MAS RAWAMANGUN",
    date: "2026-04-09",
    time: "09:00 - 11:00 WIB",
    title: "Market ke instansi",
    activityTypes: ["Market ke instansi"],
    place: "RSUD Kemayoran",
    region: "Kemayoran, Jakarta Pusat",
    priority: "Medium",
    status: "Selesai",
    entries: [
      { sbg: "001568002504401", nama: "Bagus Santoso", tipe: "ADO", nominal: 5000000 },
      { sbg: "001568002504402", nama: "Miftahul Jannah", tipe: "ADO", nominal: 9800000 },
      { sbg: "001568002504403", nama: "Ayu Putri", tipe: "RO", nominal: 15000000 },
    ],
  },
  {
    id: "seed-kcp-may-visit",
    kcp: "MAS RAWAMANGUN",
    date: "2026-05-14",
    time: "14:00 - 16:00 WIB",
    title: "Visit Nasabah One Obligor",
    activityTypes: ["Visit Nasabah One Obligor", "Penyelesaian Case Outlet"],
    place: "KCP Rawamangun",
    region: "Rawamangun, Jakarta Timur",
    priority: "High",
    status: "Selesai",
    entries: [
      { sbg: "001568002505501", nama: "Hendra Gunawan", tipe: "RO", nominal: 32000000 },
      { sbg: "001568002505502", nama: "Lina Marlina", tipe: "ADO", nominal: 7600000 },
    ],
  },
  {
    id: "seed-rawamangun",
    kcp: "MAS RAWAMANGUN",
    date: "2026-06-06",
    time: "09:00 - 10:00 WIB",
    title: "Visit Nasabah One Obligor",
    activityTypes: ["Visit Nasabah One Obligor"],
    place: "KCP Rawamangun",
    region: "Jakarta Timur, DKI Jakarta",
    priority: "Medium",
    status: "Selesai",
    entries: [
      { sbg: "001568002506601", nama: "Dodi Firmansyah", tipe: "ADO", nominal: 11200000 },
      { sbg: "001568002506602", nama: "Nina Kurnia", tipe: "RO", nominal: 17500000 },
    ],
  },
  {
    id: "seed-monang",
    kcp: "MAS RAWAMANGUN",
    date: "2026-06-28",
    time: "15:00 - 16:00 WIB",
    title: "Evaluasi Pencapaian Target Unit & Sales",
    activityTypes: ["Evaluasi Pencapaian Target Unit & Sales"],
    place: "Balai Warga Rawamangun",
    region: "Rawamangun, Jakarta Timur",
    priority: "High",
    status: "Terjadwal",
    entries: [],
  },
];

export function entryTotal(entries: KcpActivityEntry[], tipe: KcpEntryType): number {
  return entries.filter((item) => item.tipe === tipe).reduce((sum, item) => sum + item.nominal, 0);
}

export function activityAdo(item: KepalaKcpActivity): number {
  return entryTotal(item.entries, "ADO");
}

export function activityRo(item: KepalaKcpActivity): number {
  return entryTotal(item.entries, "RO");
}

export function activityMonthIndex(item: Pick<KepalaKcpActivity, "date">): number {
  return Number(item.date.slice(5, 7)) - 1;
}

export function activityYear(item: Pick<KepalaKcpActivity, "date">): number {
  return Number(item.date.slice(0, 4));
}

export function filterByPeriod(
  items: KepalaKcpActivity[],
  monthIndex: number,
  year: number,
): KepalaKcpActivity[] {
  return items.filter(
    (item) => activityMonthIndex(item) === monthIndex && activityYear(item) === year,
  );
}

export function sumAdo(items: KepalaKcpActivity[]): number {
  return items.reduce((sum, item) => sum + activityAdo(item), 0);
}

export function sumRo(items: KepalaKcpActivity[]): number {
  return items.reduce((sum, item) => sum + activityRo(item), 0);
}

/** Aktivitas sales (mobile) yang tampil di list KCP — belum punya rincian ADO/RO. */
export function fromSalesActivity(a: Activity): KepalaKcpActivity {
  const types = a.activityTypes?.length ? a.activityTypes : [a.type];
  return {
    id: a.id,
    kcp: a.locationName,
    date: a.date.slice(0, 10),
    time: `${a.timeRange} WIB`,
    title: types[0],
    activityTypes: types,
    place: a.address,
    region: a.wilayah || a.kelurahan || "Wilayah belum tersedia",
    priority: "Medium",
    status: a.status === "completed" ? "Selesai" : "Terjadwal",
    entries: [],
    photoUrl: a.photoUrl,
  };
}
