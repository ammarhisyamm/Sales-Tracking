import { contacts, type Activity, type Contact } from "./mock-data";

/**
 * Satu sumber data aktivitas KCP.
 * Dipakai oleh dashboard "Pencapaian Kepala KCP" dan list mobile KACAB
 * agar kedua sisi selalu menampilkan activity yang sama.
 *
 * Daftar nasabah tiap activity merujuk langsung ke data leads yang sama
 * dengan mobile (form Tambah Leads / kartu kontak) lewat `leadIds`,
 * sehingga isi detail selalu deterministik dan tidak berubah-ubah.
 */

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

export type KcpActivityStatus = "Selesai" | "Terjadwal";

export interface KepalaKcpActivity {
  id: string;
  kcp: string;
  date: string; // ISO yyyy-mm-dd
  time: string;
  title: string;
  activityTypes?: string[];
  ptm?: "Dalam PTM" | "Luar PTM";
  address?: string;
  kelurahan?: string;
  leadsTarget?: number;
  place: string;
  region: string;
  priority: string;
  status: KcpActivityStatus;
  /** ID kontak (data leads) yang terdaftar pada activity ini. */
  leadIds: string[];
  /** Leads baru dari local activity store, bila activity dibuat dari mobile. */
  leadContacts?: Contact[];
  photoUrl?: string;
}

/** Kembalikan data kontak untuk daftar ID — urutan mengikuti IDs. */
export function resolveLeadIds(ids: string[], extraContacts: Contact[] = []): Contact[] {
  const contactsById = new Map([...contacts, ...extraContacts].map((item) => [item.id, item]));
  return ids.map((id) => contactsById.get(id)).filter((item): item is Contact => Boolean(item));
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
    address: "Jl. Balai Pustaka Timur No. 1",
    kelurahan: "Kemayoran",
    leadsTarget: 10,
    priority: "Medium",
    status: "Selesai",
    leadIds: ["c3", "c4"],
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
    address: "Ruko Rawamangun No. 12",
    kelurahan: "Rawamangun",
    leadsTarget: 6,
    priority: "High",
    status: "Selesai",
    leadIds: ["c1", "c6", "c3"],
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
    address: "KCP Rawamangun",
    kelurahan: "Rawamangun",
    leadsTarget: 5,
    priority: "Medium",
    status: "Selesai",
    leadIds: ["c2", "c5"],
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
    address: "Balai Warga Kemayoran",
    kelurahan: "Kemayoran",
    leadsTarget: 4,
    priority: "Medium",
    status: "Selesai",
    leadIds: ["c5", "c1", "c6"],
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
    address: "Mall Kelapa Gading",
    kelurahan: "Kelapa Gading",
    leadsTarget: 10,
    priority: "Medium",
    status: "Selesai",
    leadIds: ["c2", "c6"],
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
    address: "Balai Warga Rawamangun",
    kelurahan: "Rawamangun",
    leadsTarget: 10,
    priority: "High",
    status: "Selesai",
    // Aktivitas digital dimulai tanpa daftar nasabah. Leads akan muncul
    // setelah calon nasabah mengisi formulir pendaftaran.
    leadIds: [],
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
    address: "RSUD Kemayoran",
    kelurahan: "Kemayoran",
    leadsTarget: 10,
    priority: "Medium",
    status: "Selesai",
    leadIds: ["c1", "c6", "c4"],
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
    address: "KCP Rawamangun",
    kelurahan: "Rawamangun",
    leadsTarget: 10,
    priority: "High",
    status: "Selesai",
    leadIds: ["c3", "c5"],
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
    address: "KCP Rawamangun",
    kelurahan: "Rawamangun",
    leadsTarget: 10,
    priority: "Medium",
    status: "Selesai",
    leadIds: ["c4", "c2"],
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
    address: "Balai Warga Rawamangun",
    kelurahan: "Rawamangun",
    leadsTarget: 10,
    priority: "High",
    status: "Terjadwal",
    leadIds: [],
  },
];

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

/** Aktivitas sales (mobile) yang tampil di list KCP — belum punya daftar nasabah. */
export function fromSalesActivity(a: Activity, leadContacts: Contact[] = []): KepalaKcpActivity {
  const types = a.activityTypes?.length ? a.activityTypes : [a.type];
  return {
    id: a.id,
    kcp: a.locationName,
    date: a.date.slice(0, 10),
    time: `${a.timeRange} WIB`,
    title: types[0],
    activityTypes: types,
    ptm: a.ptm,
    address: a.address,
    kelurahan: a.kelurahan,
    leadsTarget: a.leadsTarget,
    place: a.address,
    region: a.wilayah || a.kelurahan || "Wilayah belum tersedia",
    priority: "Medium",
    status: a.status === "completed" ? "Selesai" : "Terjadwal",
    leadIds: leadContacts.map((lead) => lead.id),
    leadContacts,
    photoUrl: a.photoUrl,
  };
}
