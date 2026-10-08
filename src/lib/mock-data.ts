// Mock data for the sales tracking app

export type ActivityType =
  | "Canvassing"
  | "Sosialisasi"
  | "Open Booth"
  | "Event"
  | "Market ke instansi"
  | "Market Sore/Malam"
  | "Video Konten Promosi"
  | "Penyelesaian Case Outlet"
  | "Visit Nasabah One Obligor"
  | "Evaluasi Pencapaian Target Unit & Sales"
  | "Other";

export type LeadStatus = "Hot" | "Warm" | "Cold" | "Closing";

export type ActivityStatus = "planned" | "checked_in" | "completed";

export type ActivityKind = "digital" | "lapangan";

export interface Activity {
  id: string;
  type: ActivityType;
  activityTypes?: ActivityType[];
  kind: ActivityKind;
  ptm: "Dalam PTM" | "Luar PTM";
  locationName: string;
  address: string;
  kelurahan?: string;
  wilayah?: string; // Kecamatan, Kabupaten, Provinsi, Kode Pos
  date: string; // ISO
  timeRange: string; // e.g. "09:00 - 10:00"
  startTime?: string; // "HH:MM"
  endTime?: string; // "HH:MM"
  status: ActivityStatus;
  checkInTime?: string;
  checkOutTime?: string;
  leadsCount: number;
  leadsTarget: number;
  closingCount: number;
  photoUrl?: string;
  shareCode?: string;
  linkViews?: number;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  status: LeadStatus;
  source: ActivityType;
  lastContact: string;
  hasGold: boolean;
  interested: boolean;
  note?: string;
  gender?: "Laki-Laki" | "Perempuan";
  address?: string;
  kelurahan?: string;
  wilayah?: string;
  job?: string;
}

export interface Program {
  id: string;
  name: string;
  date: string;
  endDate: string;
  location: string;
  targetLeads: number;
  targetClosing: number;
  currentLeads: number;
  currentClosing: number;
  status: "Berlangsung" | "Segera" | "Berakhir";
}

export interface SalesProfile {
  name: string;
  nip: string;
  branch: string;
  phone: string;
  region: string;
  unit: string;
  avatarUrl: string;
  grade: "Trainee" | "Silver" | "Gold" | "Platinum";
  gradeProgress: number; // 0-100
  quadrant: "I" | "II" | "III" | "IV";
  booking: number;
  bookingEstimate: number;
  estimasiInsentif: number;
}

export const profile: SalesProfile = {
  name: "Rizky Pratama",
  nip: "PG-098231",
  branch: "Cabang Denpasar",
  phone: "088802877548",
  region: "Gadai MAS Jatim",
  unit: "MAS Surabaya",
  avatarUrl: "",
  grade: "Gold",
  gradeProgress: 72,
  quadrant: "IV",
  booking: 12000000,
  bookingEstimate: 16000000,
  estimasiInsentif: 1840000,
};

export const targets = {
  leads: {
    today: { current: 90, target: 100 },
    week: { current: 240, target: 500 },
    month: { current: 880, target: 2000 },
  },
  closingLeads: {
    today: { current: 12, target: 24 },
    week: { current: 42, target: 120 },
    month: { current: 165, target: 480 },
  },
  ado: {
    today: { current: 16000000, target: 32000000 },
    week: { current: 14250000, target: 22000000 },
    month: { current: 14250000, target: 22000000 },
  },
  grams: {
    today: { current: 42, target: 100 },
    week: { current: 180, target: 400 },
    month: { current: 320, target: 1000 },
  },
};

export const activities: Activity[] = [
  {
    id: "a1",
    type: "Canvassing",
    kind: "lapangan",
    ptm: "Luar PTM",
    locationName: "Pasar Rawamangun",
    address: "Jl. Balai Pustaka Timur No. 1, Rawamangun",
    kelurahan: "Rawamangun",
    wilayah: "Kec. Pulogadung, Jakarta Timur, DKI Jakarta, 13220",
    date: new Date().toISOString(),
    timeRange: "08:00 - 10:00",
    startTime: "08:00",
    endTime: "10:00",
    status: "checked_in",
    checkInTime: "08:12",
    leadsCount: 4,
    leadsTarget: 10,
    closingCount: 1,
  },
  {
    id: "a2",
    type: "Open Booth",
    kind: "lapangan",
    ptm: "Dalam PTM",
    locationName: "Mall Kelapa Gading",
    address: "Jl. Boulevard Raya, Kelapa Gading",
    kelurahan: "Kelapa Gading",
    wilayah: "Kec. Kelapa Gading, Jakarta Utara, DKI Jakarta, 14240",
    date: new Date().toISOString(),
    timeRange: "11:00 - 14:00",
    startTime: "11:00",
    endTime: "14:00",
    status: "planned",
    leadsCount: 0,
    leadsTarget: 10,
    closingCount: 0,
  },
  {
    id: "a3",
    type: "Event",
    kind: "digital",
    ptm: "Dalam PTM",
    locationName: "Webinar Edukasi Gadai Emas",
    address: "Zoom Meeting (link dibagikan)",
    kelurahan: "Kemayoran",
    wilayah: "Kec. Kemayoran, Jakarta Pusat, DKI Jakarta, 10620",
    date: new Date().toISOString(),
    timeRange: "15:00 - 18:00",
    startTime: "15:00",
    endTime: "18:00",
    status: "planned",
    leadsCount: 0,
    leadsTarget: 10,
    closingCount: 0,
    shareCode: "EVT-A3-8K2P",
    linkViews: 0,
  },
  {
    id: "a4",
    type: "Sosialisasi",
    kind: "lapangan",
    ptm: "Dalam PTM",
    locationName: "Balai Warga Kemayoran",
    address: "Jl. Kemayoran Gempol, Kemayoran",
    kelurahan: "Kemayoran",
    wilayah: "Kec. Kemayoran, Jakarta Pusat, DKI Jakarta, 10620",
    date: new Date(Date.now() - 86400000).toISOString(),
    timeRange: "09:00 - 11:00",
    startTime: "09:00",
    endTime: "11:00",
    status: "completed",
    checkInTime: "09:05",
    checkOutTime: "11:24",
    leadsCount: 10,
    leadsTarget: 10,
    closingCount: 3,
  },
  {
    id: "a5",
    type: "Market ke instansi",
    kind: "lapangan",
    ptm: "Luar PTM",
    locationName: "RSUD Jatinegara",
    address: "Jl. Jatinegara Barat No. 142, Jatinegara",
    kelurahan: "Jatinegara",
    wilayah: "Kec. Jatinegara, Jakarta Timur, DKI Jakarta, 13310",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    timeRange: "13:00 - 15:00",
    startTime: "13:00",
    endTime: "15:00",
    status: "completed",
    checkInTime: "13:01",
    checkOutTime: "15:10",
    leadsCount: 5,
    leadsTarget: 10,
    closingCount: 2,
  },
];

export const contacts: Contact[] = [
  {
    id: "c1",
    name: "Agustinus Nugroho Setiyani",
    phone: "+6281234567890",
    status: "Hot",
    source: "Market ke instansi",
    lastContact: "Hari ini",
    hasGold: true,
    interested: true,
    note: "Tertarik gadai 10gr, follow up besok",
    job: "Karyawan Swasta",
    gender: "Laki-Laki",
    address: "Jl. Kemayoran Gempol No. 12",
    kelurahan: "Kemayoran",
    wilayah: "Kec. Kemayoran, Jakarta Pusat, DKI Jakarta, 10620",
  },
  {
    id: "c2",
    name: "Made Wirawan",
    phone: "+6281298765432",
    status: "Warm",
    source: "Open Booth",
    lastContact: "2 hari lalu",
    hasGold: true,
    interested: false,
    job: "Wiraswasta",
    kelurahan: "Rawamangun",
    wilayah: "Kec. Pulogadung, Jakarta Timur, DKI Jakarta, 13220",
  },
  {
    id: "c3",
    name: "Putu Ayu Lestari",
    phone: "+6285712340987",
    status: "Closing",
    source: "Canvassing",
    lastContact: "Kemarin",
    hasGold: true,
    interested: true,
    note: "Sudah closing 5gr",
    job: "Karyawan Swasta",
    kelurahan: "Kemayoran",
    wilayah: "Kec. Kemayoran, Jakarta Pusat, DKI Jakarta, 10620",
  },
  {
    id: "c4",
    name: "Bagus Santoso",
    phone: "+6282111223344",
    status: "Cold",
    source: "Canvassing",
    lastContact: "1 minggu lalu",
    hasGold: false,
    interested: false,
    job: "Pelajar / Mahasiswa",
    kelurahan: "Jatinegara",
    wilayah: "Kec. Jatinegara, Jakarta Timur, DKI Jakarta, 13310",
  },
  {
    id: "c5",
    name: "Ni Luh Diah",
    phone: "+6287722334411",
    status: "Warm",
    source: "Sosialisasi",
    lastContact: "3 hari lalu",
    hasGold: true,
    interested: true,
    note: "Minta dijelaskan ulang skema bunga",
    job: "Ibu Rumah Tangga",
    kelurahan: "Kelapa Gading",
    wilayah: "Kec. Kelapa Gading, Jakarta Utara, DKI Jakarta, 14240",
  },
  {
    id: "c6",
    name: "Komang Arta",
    phone: "+6281355667788",
    status: "Hot",
    source: "Market ke instansi",
    lastContact: "Hari ini",
    hasGold: true,
    interested: true,
    job: "PNS",
    kelurahan: "Kemayoran",
    wilayah: "Kec. Kemayoran, Jakarta Pusat, DKI Jakarta, 10620",
  },
];

export const programs: Program[] = [
  {
    id: "p1",
    name: "Gebyar Emas Akhir Bulan",
    date: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    location: "Kemayoran, Jakarta Pusat",
    targetLeads: 10,
    targetClosing: 5,
    currentLeads: 0,
    currentClosing: 0,
    status: "Berlangsung",
  },
  {
    id: "p2",
    name: "Open Booth Mall Galeria",
    date: new Date(Date.now() + 86400000 * 7).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 9).toISOString(),
    location: "Mall Bali Galeria",
    targetLeads: 60,
    targetClosing: 25,
    currentLeads: 0,
    currentClosing: 0,
    status: "Segera",
  },
  {
    id: "p3",
    name: "Sosialisasi RT/RW Renon",
    date: new Date(Date.now() - 86400000 * 30).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 22).toISOString(),
    location: "Renon",
    targetLeads: 40,
    targetClosing: 15,
    currentLeads: 44,
    currentClosing: 18,
    status: "Berakhir",
  },
];

export interface LeaderboardEntry {
  rank: number;
  name: string;
  branch: string;
  company: string;
  score: number;
  isSelf?: boolean;
}

export interface ProgramHero {
  name: string;
  period: string;
  rank: number;
  score: number;
  predikat: string;
  metrics: { label: string; desc: string; value: number }[];
  leaderboard: LeaderboardEntry[];
}

export const programHero: ProgramHero = {
  name: "Race Off November",
  period: "20-30 November",
  rank: 3,
  score: 13,
  predikat: "Memuaskan",
  metrics: [
    { label: "Lash", desc: "Kontribusi Transaksi", value: 12 },
    { label: "Leads", desc: "Calon nasabah masuk", value: 24 },
  ],
  leaderboard: [
    {
      rank: 1,
      name: "Miftahul Jannah",
      branch: "MAS Monta",
      company: "PT.Gadai Mas NTB",
      score: 14,
    },
    {
      rank: 2,
      name: "Miftahul Jannah",
      branch: "MAS Monta",
      company: "PT.Gadai Mas NTB",
      score: 14,
    },
    {
      rank: 3,
      name: "Rizky Pratama",
      branch: "Cabang Denpasar",
      company: "PT.Gadai Mas Bali",
      score: 13,
      isSelf: true,
    },
    { rank: 4, name: "Siti Sarah", branch: "MAS Kuta", company: "PT.Gadai Mas Bali", score: 12 },
    {
      rank: 5,
      name: "Made Wirawan",
      branch: "MAS Gianyar",
      company: "PT.Gadai Mas Bali",
      score: 11,
    },
    {
      rank: 6,
      name: "Putu Ayu Lestari",
      branch: "MAS Tabanan",
      company: "PT.Gadai Mas Bali",
      score: 10,
    },
    {
      rank: 7,
      name: "Bagus Santoso",
      branch: "MAS Mataram",
      company: "PT.Gadai Mas NTB",
      score: 9,
    },
    {
      rank: 8,
      name: "Ni Luh Diah",
      branch: "MAS Singaraja",
      company: "PT.Gadai Mas Bali",
      score: 8,
    },
    {
      rank: 9,
      name: "Komang Arta",
      branch: "MAS Klungkung",
      company: "PT.Gadai Mas Bali",
      score: 7,
    },
    { rank: 10, name: "Agus Setiawan", branch: "MAS Bima", company: "PT.Gadai Mas NTB", score: 6 },
  ],
};

export interface LeadDistribution {
  label: string;
  pct: number;
  leads: number;
  closing: number;
  color: string;
}

export const LEAD_DISTRIBUTION: LeadDistribution[] = [
  { label: "Canvassing Hot", pct: 32.5, leads: 139, closing: 21, color: "#2953A4" },
  { label: "Sosialisasi", pct: 30, leads: 129, closing: 20, color: "#F59E0B" },
  { label: "Open Booth", pct: 20, leads: 86, closing: 16, color: "#E5484D" },
  { label: "Event", pct: 12.5, leads: 54, closing: 13, color: "#22A06B" },
  { label: "Market ke Instansi", pct: 5, leads: 21, closing: 10, color: "#8E44AD" },
];

export const LEAD_TOTAL = { leads: 429, closing: 80 };

export const QUADRANT_DESC: Record<string, { leads: string; aktivitas: string }> = {
  I: { leads: "Leads rendah", aktivitas: "aktivitas rendah" },
  II: { leads: "Leads tinggi", aktivitas: "aktivitas rendah" },
  III: { leads: "Leads rendah", aktivitas: "aktivitas tinggi" },
  IV: { leads: "Leads tinggi", aktivitas: "aktivitas tinggi" },
};

export const GRADES = ["Trainee", "Silver", "Gold", "Platinum"] as const;

export const leadsByStatus = [
  { label: "Canvassing Hot", value: 232, color: "oklch(0.6 0.22 25)" },
  { label: "Follow up Warm", value: 125, color: "oklch(0.65 0.16 220)" },
  { label: "Grebek Pasar Warm", value: 53, color: "oklch(0.55 0.18 305)" },
  { label: "Follow up Hot", value: 52, color: "oklch(0.7 0.14 165)" },
  { label: "Event Hot", value: 29, color: "oklch(0.6 0.18 45)" },
  { label: "Canvassing Warm", value: 15, color: "oklch(0.55 0.14 250)" },
  { label: "Lainnya", value: 28, color: "oklch(0.7 0.04 260)" },
];

export interface NotificationBody {
  t: string;
  b?: boolean;
}

export interface NotificationItem {
  id: string;
  icon: "megaphone" | "globe" | "clipboard" | "gift";
  title: string;
  body: NotificationBody[];
  date: string;
  unread: boolean;
}

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    icon: "megaphone",
    title: "Webinar Pengenalan Gadai MAS Melalui Media Digital",
    body: [{ t: "Event akan berlangsung pada hari ini 14 Desember 2021 pukul 08.30-selesai." }],
    date: "5 November 2025, 11:15",
    unread: false,
  },
  {
    id: "n2",
    icon: "globe",
    title: "Target Bulan Ini Sudah Ditentukan!",
    body: [
      { t: "Kamu mendapatkan target " },
      { t: "50 leads", b: true },
      { t: " yang harus dicapai bulan ini." },
    ],
    date: "1 November 2025, 11:15",
    unread: true,
  },
  {
    id: "n3",
    icon: "clipboard",
    title: "Belum Capai Target, Ayo Kejar Lagi!",
    body: [
      { t: "Saat ini progresmu baru " },
      { t: "20", b: true },
      { t: " dari " },
      { t: "50", b: true },
      {
        t: " leads. Masih ada waktu untuk mengejar! Tingkatkan follow-up dan manfaatkan database.",
      },
    ],
    date: "15 November 2025, 11:15",
    unread: false,
  },
  {
    id: "n4",
    icon: "gift",
    title: "Selamat! Targetmu Telah Tercapai!",
    body: [
      { t: "Kamu sudah mencapai " },
      { t: "55", b: true },
      { t: " leads bulan ini, melampaui target! Pertahankan performamu." },
    ],
    date: "30 November 2025, 11:15",
    unread: false,
  },
];

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

export const getShareCode = (a: Pick<Activity, "id" | "shareCode">) =>
  a.shareCode ?? `CT-${a.id.toUpperCase()}-2026`;

export const getShareLink = (a: Pick<Activity, "id" | "shareCode">) =>
  typeof window !== "undefined"
    ? `${window.location.origin}/isi/${a.id}?k=${getShareCode(a)}`
    : `/isi/${a.id}?k=${getShareCode(a)}`;

export const STATUS_META: Record<ActivityStatus, { label: string; className: string }> = {
  planned: { label: "Segera", className: "text-amber-500" },
  checked_in: { label: "Berjalan", className: "text-green-500" },
  completed: { label: "Berakhir", className: "text-slate-400" },
};

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] as const;

const pad2 = (n: number) => String(n).padStart(2, "0");

/** "Sabtu, 28/06/2026" */
export const formatTanggalSingkat = (iso: string) => {
  const d = new Date(iso);
  return `${HARI[d.getDay()]}, ${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

/** "Sabtu, 28/06/2026 | 10:00 - 11:00 WIB" */
export const formatJadwal = (a: Pick<Activity, "date" | "timeRange" | "startTime" | "endTime">) => {
  const range = a.startTime && a.endTime ? `${a.startTime} - ${a.endTime}` : a.timeRange;
  return `${formatTanggalSingkat(a.date)} | ${range} WIB`;
};

const BULAN_ID = [
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

/** "Sabtu, 28 Juni 2026 | 08:00" */
export const formatTanggalPanjang = (iso: string, time?: string) => {
  const d = new Date(iso);
  const tgl = `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN_ID[d.getMonth()]} ${d.getFullYear()}`;
  return time ? `${tgl} | ${time}` : tgl;
};

const BULAN_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** ["January 2026", ... "December 2026"] */
export const monthOptions = (year = 2026) => BULAN_EN.map((m) => `${m} ${year}`);

/** "January 2026" -> { month: 0, year: 2026 } */
export const parseMonthOption = (opt: string) => {
  const [m, y] = opt.split(" ");
  return { month: BULAN_EN.indexOf(m as (typeof BULAN_EN)[number]), year: Number(y) };
};

/** "Kemayoran, Jakarta Pusat" dari kelurahan + wilayah */
export const shortLocation = (c: { kelurahan?: string; wilayah?: string; address?: string }) => {
  if (c.kelurahan && c.wilayah) {
    const parts = c.wilayah.split(",").map((x) => x.trim());
    return `${c.kelurahan}, ${parts[1] ?? parts[0]}`;
  }
  return c.address ?? "-";
};

export const KELURAHAN_WILAYAH: Record<string, string> = {
  Rawamangun: "Kec. Pulogadung, Jakarta Timur, DKI Jakarta, 13220",
  Pilumpanua: "Kec. Wajo, Sulawesi Selatan, 17133",
  Kemayoran: "Kec. Kemayoran, Jakarta Pusat, DKI Jakarta, 10620",
  "Kelapa Gading": "Kec. Kelapa Gading, Jakarta Utara, DKI Jakarta, 14240",
  Jatinegara: "Kec. Jatinegara, Jakarta Timur, DKI Jakarta, 13310",
  Kebayoran: "Kec. Kebayoran Baru, Jakarta Selatan, DKI Jakarta, 12110",
  Renon: "Kec. Denpasar Selatan, Kota Denpasar, Bali, 80226",
};

export const PEKERJAAN_PROMAS = [
  "Karyawan Swasta",
  "Wiraswasta",
  "PNS",
  "Ibu Rumah Tangga",
  "Pelajar / Mahasiswa",
  "Lainnya",
] as const;

export const STATUS_NASABAH: { value: LeadStatus; desc: string }[] = [
  { value: "Hot", desc: "Punya emas & berniat gadai" },
  { value: "Warm", desc: "Punya emas, belum berniat" },
  { value: "Cold", desc: "Belum punya emas & belum berniat" },
  { value: "Closing", desc: "Siap closing" },
];

export interface WaTemplate {
  id: "default" | "followup" | "closing";
  title: string;
  body: string;
}

export const WA_TEMPLATES: WaTemplate[] = [
  {
    id: "default",
    title: "Template Default",
    body: "Halo Kak {{nama_customer}} 👋\nSaya {{nama_sales}} dari Gadai MAS.\nTerkait event {{nama_event}} pada {{tanggal_event}}, berikut detail kupon aktif Kakak:\nKode Kupon: {{kode_kupon}}\n\nApakah Kakak bersedia saya hubungi untuk info lebih lanjut?",
  },
  {
    id: "followup",
    title: "Template Follow Up",
    body: "Halo Kak {{nama_customer}},\nIni {{nama_sales}} dari Gadai MAS.\nMengingatkan kembali terkait penawaran di event {{nama_event}}.\nApakah Kakak sudah sempat mempertimbangkan untuk proses gadai?\nSaya siap membantu ya 😊",
  },
  {
    id: "closing",
    title: "Template Setelah Closing",
    body: "Terima kasih Kak {{nama_customer}} 🙏\nAtas kepercayaannya menggunakan layanan Gadai MAS melalui event {{nama_event}}.\nJika ada pertanyaan atau butuh bantuan lainnya, silakan hubungi saya ya.\nSemoga harinya menyenangkan! 😊",
  },
];

export const fillWaTemplate = (
  tpl: string,
  vars: {
    nama_customer: string;
    nama_sales: string;
    nama_event: string;
    tanggal_event: string;
    kode_kupon: string;
  },
) =>
  tpl
    .replaceAll("{{nama_customer}}", vars.nama_customer)
    .replaceAll("{{nama_sales}}", vars.nama_sales)
    .replaceAll("{{nama_event}}", vars.nama_event)
    .replaceAll("{{tanggal_event}}", vars.tanggal_event)
    .replaceAll("{{kode_kupon}}", vars.kode_kupon);
