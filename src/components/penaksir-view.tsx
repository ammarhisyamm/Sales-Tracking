import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Eye,
  ListChecks,
  ScanEye,
  X,
} from "lucide-react";
import { usePenaksirPhoto } from "../lib/penaksir-photo-store";
import {
  FOLLOW_UP_SEEDS,
  PENAKSIR_MONTHS,
  extraSbgCount,
  filterFollowUpByPeriod,
  formatPelaksanaan,
  primarySbg,
  type PenaksirFollowUp,
} from "../lib/penaksir-followup";

const PAGE_SIZE = 10;

export function PenaksirView() {
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("Oktober");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<PenaksirFollowUp | null>(null);

  const years = useMemo(() => {
    const set = new Set(FOLLOW_UP_SEEDS.map((item) => item.date.slice(0, 4)));
    if (!set.has("2026")) set.add("2026");
    return [...set].sort().reverse();
  }, []);

  const monthIndex = PENAKSIR_MONTHS.indexOf(month as (typeof PENAKSIR_MONTHS)[number]);

  const visible = useMemo(
    () => filterFollowUpByPeriod(FOLLOW_UP_SEEDS, monthIndex, Number(year)),
    [monthIndex, year],
  );

  const totalRo = useMemo(
    () => visible.filter((item) => item.kegiatan === "Follow Up RO").length,
    [visible],
  );
  const totalOvd = useMemo(
    () => visible.filter((item) => item.kegiatan === "Follow Up OVD").length,
    [visible],
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const rows = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const changePeriod = (nextYear: string, nextMonth: string) => {
    setYear(nextYear);
    setMonth(nextMonth);
    setPage(1);
  };

  const hasilTone = (hasil: string) =>
    hasil === "Deal Transaksi" || hasil === "Bersedia Bayar / Perpanjang"
      ? "text-[#008236]"
      : hasil === "Masih Dipertimbangkan" || hasil === "Belum Bisa Bayar"
        ? "text-amber-700"
        : hasil === "Belum Ada Respon"
          ? "text-slate-500"
          : "text-[#e7000b]";

  return (
    <div>
      <h2 className="text-[17px] font-bold text-slate-900">Summary Aktivitas</h2>
      <p className="mt-1 text-[13px] text-slate-500">
        Pantau progres dan pencapaian target aktivitas
      </p>
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={<ListChecks className="h-5 w-5 text-[#199900]" />}
          label="Total Follow Up"
          value={`${visible.length} Kegiatan`}
          hint={`${month} ${year} · RO & OVD`}
        />
        <SummaryCard
          icon={<ScanEye className="h-5 w-5 text-[#199900]" />}
          label="Follow Up RO"
          value={`${totalRo} Kegiatan`}
          hint="Repeat Order · sudah lunas, meminjam lagi"
        />
        <SummaryCard
          icon={<ClipboardCheck className="h-5 w-5 text-[#199900]" />}
          label="Follow Up OVD"
          value={`${totalOvd} Kegiatan`}
          hint="Overdue · belum lunas, masih meminjam"
        />
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7">
          <div>
            <h2 className="text-[25px] font-semibold">Daftar Follow Up RO &amp; OVD</h2>
            <p className="mt-1 text-[14px] text-slate-400">{visible.length} Data</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect
              icon={<CalendarDays className="h-5 w-5 text-[#292663]" />}
              value={year}
              options={years}
              onChange={(value) => changePeriod(value, month)}
            />
            <FilterSelect
              icon={<CalendarDays className="h-5 w-5 text-[#292663]" />}
              value={month}
              options={[...PENAKSIR_MONTHS]}
              onChange={(value) => changePeriod(year, value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1280px] border-collapse text-left">
            <thead className="border-y border-slate-200 text-[14px] text-slate-400">
              <tr>
                <th className="px-7 py-5 font-medium">No</th>
                <th className="px-5 py-5 font-medium">CIF</th>
                <th className="px-5 py-5 font-medium">No. SBG</th>
                <th className="px-5 py-5 font-medium">Kegiatan</th>
                <th className="px-5 py-5 font-medium">Media FU</th>
                <th className="px-5 py-5 font-medium">Tanggal Pelaksanaan</th>
                <th className="px-5 py-5 font-medium">Hasil</th>
                <th className="px-7 py-5 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => {
                const extra = extraSbgCount(item);
                return (
                  <tr key={item.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-7 py-6">{(safePage - 1) * PAGE_SIZE + index + 1}</td>
                    <td className="px-5 py-6">
                      <p className="whitespace-nowrap font-medium tabular-nums">{item.cif}</p>
                      <p className="mt-0.5 text-[13px] text-slate-400">{item.nama}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-6 tabular-nums">
                      {primarySbg(item)}
                      {extra > 0 && (
                        <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-0.5 text-[12px] font-medium text-slate-500">
                          +{extra}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-6">
                      {item.kegiatan}
                      {item.sbg[0] && (
                        <span className="text-slate-400">/{item.sbg[0].followUp}</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-6">{item.media}</td>
                    <td className="whitespace-nowrap px-5 py-6 tabular-nums">
                      {formatPelaksanaan(item)}
                    </td>
                    <td className={`whitespace-nowrap px-5 py-6 font-medium ${hasilTone(item.hasil)}`}>
                      {item.hasil}
                    </td>
                    <td className="px-7 py-6 text-right">
                      <button
                        onClick={() => setDetail(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-7 py-12 text-center text-[14px] text-slate-400">
                    Belum ada follow up pada {month} {year}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-end gap-5 px-7 py-6 text-[14px] text-slate-400">
          <span>
            Rows per page: <strong className="ml-2 text-slate-600">{PAGE_SIZE}</strong>
          </span>
          <button
            disabled={safePage <= 1}
            onClick={() => setPage(safePage - 1)}
            className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white">
            {safePage}
          </span>
          <button
            disabled={safePage >= pageCount}
            onClick={() => setPage(safePage + 1)}
            className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {detail && (
        <FollowUpDetailModal
          item={detail}
          hasilTone={hasilTone}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="flex items-center gap-2 text-[14px] text-slate-500">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f5e9]">
          {icon}
        </span>
        {label}
      </p>
      <p className="mt-3 truncate text-[22px] font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-[13px] text-slate-400">{hint}</p>
    </div>
  );
}

function FilterSelect({
  icon,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <span className="relative inline-flex items-center">
      <span className="pointer-events-none absolute left-4">{icon}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-12 pr-10 text-[15px] font-medium text-slate-700 outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-slate-500" />
    </span>
  );
}

const HASIL_PILL: Record<string, string> = {
  "Deal Transaksi": "bg-green-100 text-green-800",
  "Bersedia Bayar / Perpanjang": "bg-green-100 text-green-800",
  "Masih Dipertimbangkan": "bg-amber-100 text-amber-800",
  "Belum Bisa Bayar": "bg-amber-100 text-amber-800",
  "Belum Ada Respon": "bg-slate-100 text-slate-500",
  "Tidak Dapat Dihubungi": "bg-[#ffe0e0] text-[#e5484d]",
  "Menolak / Tidak Bersedia Melanjutkan": "bg-[#ffe0e0] text-[#e5484d]",
};

function FollowUpDetailModal({
  item,
  hasilTone,
  onClose,
}: {
  item: PenaksirFollowUp;
  hasilTone: (hasil: string) => string;
  onClose: () => void;
}) {
  const [photoOpen, setPhotoOpen] = useState(false);
  const storedPhoto = usePenaksirPhoto(item.cif);
  const photo = item.photoUrl || storedPhoto;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="relative max-h-[calc(100vh-32px)] w-full max-w-[880px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
          <div>
            <h2 className="text-[22px] font-bold">Detail Follow Up</h2>
            <p className="mt-0.5 text-[14px] text-slate-400">
              {item.cif} · {item.nama} · {formatPelaksanaan(item)}
            </p>
          </div>
          <button onClick={onClose} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-280px)] overflow-y-auto px-8 py-6">
          <div className="flex flex-wrap items-center gap-4 rounded-xl bg-[#f3f6fb] px-5 py-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#292663] text-[18px] font-bold text-white">
              {item.nama
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[18px] font-bold text-slate-900">
                {item.nama}
              </span>
              <span className="mt-0.5 block truncate text-[13px] text-slate-500">
                {item.cif} · {item.kegiatan} · {item.media}
              </span>
            </span>
            <span
              className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold ${HASIL_PILL[item.hasil] ?? "bg-slate-100 text-slate-600"}`}
            >
              {item.hasil}
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 md:grid-cols-4">
              <DetailCell label="CIF" value={item.cif} />
              <DetailCell label="Nama" value={item.nama} />
              <DetailCell label="Kegiatan" value={item.kegiatan} />
              <DetailCell label="Media FU" value={item.media} />
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">
              <DetailCell label="Tanggal Pelaksanaan" value={formatPelaksanaan(item)} />
              <DetailCell label="Follow Up Ke" value={item.sbg[0]?.followUp ?? "-"} />
              <DetailCell label="Hasil" value={item.hasil} />
              <DetailCell
                label="Foto"
                value={
                  <button
                    type="button"
                    onClick={() => setPhotoOpen((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#292663] px-4 py-2 text-[14px] font-medium text-[#292663]"
                  >
                    <Eye className="h-5 w-5" /> {photoOpen ? "Sembunyikan" : "Lihat Foto"}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${photoOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                }
              />
            </div>
          </div>

          <h3 className="mt-6 text-[16px] font-semibold">
            Daftar Nomor SBG ({item.sbg.length})
          </h3>
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[520px] border-collapse text-left text-[14px]">
              <thead className="bg-slate-50 text-slate-500">
                <tr className="border-b border-slate-200">
                  <th scope="col" className="px-4 py-3 font-medium">
                    No
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    No. SBG
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Follow Up Ke
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Progres
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.sbg.map((sbg, index) => {
                  const total = item.sbg.length;
                  const done = Math.min(index + 1, total);
                  return (
                    <tr key={sbg.number} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium tabular-nums text-slate-900">
                        {sbg.number}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {sbg.followUp}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                            <span
                              className="block h-full rounded-full bg-[#199900]"
                              style={{ width: `${Math.round((done / total) * 100)}%` }}
                            />
                          </span>
                          <span className="text-[12px] tabular-nums text-slate-400">
                            {done}/{total}
                          </span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {photoOpen && (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <div className="bg-slate-50 px-4 py-3 text-[14px] font-medium text-slate-500">
                Foto Realisasi
              </div>
              <div className="flex min-h-[220px] items-center justify-center bg-[#eef2f7] p-4">
                {photo ? (
                  <img
                    src={photo}
                    alt={`Foto realisasi ${item.kegiatan} ${item.nama}`}
                    className="max-h-[360px] w-full rounded-lg object-contain"
                  />
                ) : (
                  <p className="flex flex-col items-center gap-2 px-6 py-8 text-center text-[14px] text-slate-400">
                    <Eye className="h-8 w-8 text-slate-300" />
                    Foto realisasi {item.kegiatan} belum tersedia.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-8 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border-2 border-[#199900] px-5 py-2.5 text-[14px] font-medium text-[#199900]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0 px-5 py-4">
      <p className="text-[15px] font-medium text-slate-700">{label}</p>
      <div className="mt-1 truncate text-[15px] text-slate-400">{value}</div>
    </div>
  );
}


