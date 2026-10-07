/**
 * Satu sumber data follow up penaksir (RO & OVD).
 * Nilainya disamakan dengan kartu mobile penaksir (CIF, SBG, nama,
 * kegiatan, media, hasil) agar tabel dashboard sinkron dengan mobile.
 */

export const PENAKSIR_MONTHS = [
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

export type FollowUpKegiatan = "Follow Up RO" | "Follow Up OVD";
export type FollowUpMedia = "Visit" | "Telepon" | "Whatsapp";

export interface FollowUpSbg {
  number: string;
  followUp: string;
}

export interface PenaksirFollowUp {
  id: string;
  cif: string;
  nama: string;
  sbg: FollowUpSbg[];
  kegiatan: FollowUpKegiatan;
  media: FollowUpMedia;
  date: string; // ISO yyyy-mm-dd
  timeRange: string; // "10:00 - 11:00"
  hasil: string;
  photoUrl?: string;
}

export const FOLLOW_UP_SEEDS: PenaksirFollowUp[] = [
  {
    id: "fu-ovd-deal",
    cif: "1312T1T181817",
    nama: "Adam Alis",
    sbg: [
      { number: "001568002500007", followUp: "Follow Up ke-1" },
      { number: "001568002500006", followUp: "Follow Up ke-2" },
      { number: "001568002500005", followUp: "Follow Up ke-1" },
      { number: "001568002500002", followUp: "Follow Up ke-5" },
    ],
    kegiatan: "Follow Up OVD",
    media: "Whatsapp",
    date: "2026-10-10",
    timeRange: "10:00 - 11:00",
    hasil: "Deal Transaksi",
  },
  {
    id: "fu-ro-pertimbang",
    cif: "1312T1T181817",
    nama: "Adam Alis",
    sbg: [{ number: "001568002500007", followUp: "Follow Up Ke-1" }],
    kegiatan: "Follow Up RO",
    media: "Whatsapp",
    date: "2026-10-10",
    timeRange: "10:00 - 11:00",
    hasil: "Masih Dipertimbangkan",
  },
  {
    id: "fu-ro-tidak-hubungi",
    cif: "1312T1T181817",
    nama: "Adam Alis",
    sbg: [{ number: "001568002500007", followUp: "Follow Up Ke-1" }],
    kegiatan: "Follow Up RO",
    media: "Whatsapp",
    date: "2026-10-10",
    timeRange: "10:00 - 11:00",
    hasil: "Tidak Dapat Dihubungi",
  },
  {
    id: "fu-sep-ro-visit",
    cif: "1312T1T181818",
    nama: "Budi Santoso",
    sbg: [{ number: "001568002500101", followUp: "Follow Up Ke-2" }],
    kegiatan: "Follow Up RO",
    media: "Visit",
    date: "2026-09-14",
    timeRange: "09:00 - 10:00",
    hasil: "Bersedia Bayar / Perpanjang",
  },
  {
    id: "fu-sep-ovd-telp",
    cif: "1312T1T181819",
    nama: "Rina Marlina",
    sbg: [
      { number: "001568002500102", followUp: "Follow Up ke-1" },
      { number: "001568002500103", followUp: "Follow Up ke-3" },
    ],
    kegiatan: "Follow Up OVD",
    media: "Telepon",
    date: "2026-09-22",
    timeRange: "13:00 - 14:00",
    hasil: "Belum Ada Respon",
  },
  {
    id: "fu-nov-ro-wa",
    cif: "1312T1T181820",
    nama: "Made Wirawan",
    sbg: [{ number: "001568002500104", followUp: "Follow Up Ke-1" }],
    kegiatan: "Follow Up RO",
    media: "Whatsapp",
    date: "2026-11-05",
    timeRange: "10:00 - 11:00",
    hasil: "Belum Bisa Bayar",
  },
  {
    id: "fu-nov-ovd-visit",
    cif: "1312T1T181821",
    nama: "Siti Sarah",
    sbg: [{ number: "001568002500105", followUp: "Follow Up ke-4" }],
    kegiatan: "Follow Up OVD",
    media: "Visit",
    date: "2026-11-18",
    timeRange: "15:00 - 16:00",
    hasil: "Menolak / Tidak Bersedia Melanjutkan",
  },
];

export function followUpMonthIndex(item: Pick<PenaksirFollowUp, "date">): number {
  return Number(item.date.slice(5, 7)) - 1;
}

export function followUpYear(item: Pick<PenaksirFollowUp, "date">): number {
  return Number(item.date.slice(0, 4));
}

export function filterFollowUpByPeriod(
  items: PenaksirFollowUp[],
  monthIndex: number,
  year: number,
): PenaksirFollowUp[] {
  return items.filter(
    (item) => followUpMonthIndex(item) === monthIndex && followUpYear(item) === year,
  );
}

/** "10/10/2026 (10:00 - 11:00)" */
export function formatPelaksanaan(item: Pick<PenaksirFollowUp, "date" | "timeRange">): string {
  const [y, m, d] = item.date.split("-");
  return `${d}/${m}/${y} (${item.timeRange})`;
}

export function primarySbg(item: Pick<PenaksirFollowUp, "sbg">): string {
  return item.sbg[0]?.number ?? "-";
}

export function extraSbgCount(item: Pick<PenaksirFollowUp, "sbg">): number {
  return Math.max(0, item.sbg.length - 1);
}
