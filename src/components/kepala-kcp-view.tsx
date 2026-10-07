import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  Eye,
  ListChecks,
  UserRound,
  X,
} from "lucide-react";
import { useActivities } from "../lib/activity-store";
import {
  KCP_ACTIVITY_SEEDS,
  KCP_MONTHS,
  filterByPeriod,
  fromSalesActivity,
  type KepalaKcpActivity,
} from "../lib/kepala-kcp";

const PAGE_SIZE = 10;

export function KepalaKcpView() {
  const salesActivities = useActivities();
  const [month, setMonth] = useState("Februari");
  const [year, setYear] = useState("2026");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<KepalaKcpActivity | null>(null);

  const all = useMemo(() => {
    const seeds = KCP_ACTIVITY_SEEDS;
    const mapped = salesActivities.map(fromSalesActivity);
    const seen = new Set(seeds.map((item) => item.id));
    return [...seeds, ...mapped.filter((item) => !seen.has(item.id))];
  }, [salesActivities]);

  const years = useMemo(() => {
    const set = new Set(all.map((item) => item.date.slice(0, 4)));
    if (!set.has("2026")) set.add("2026");
    return [...set].sort().reverse();
  }, [all]);

  const monthIndex = KCP_MONTHS.indexOf(month as (typeof KCP_MONTHS)[number]);

  const visible = useMemo(
    () => filterByPeriod(all, monthIndex, Number(year)),
    [all, monthIndex, year],
  );

  const doneCount = useMemo(
    () => visible.filter((item) => item.status === "Selesai").length,
    [visible],
  );
  const scheduledCount = visible.length - doneCount;
  const nasabahCount = useMemo(
    () => visible.reduce((sum, item) => sum + item.entries.length, 0),
    [visible],
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const rows = visible.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const changePeriod = (nextMonth: string, nextYear: string) => {
    setMonth(nextMonth);
    setYear(nextYear);
    setPage(1);
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={<ListChecks className="h-5 w-5 text-[#199900]" />}
          label="Total Aktivitas"
          value={`${visible.length} Kegiatan`}
          hint={`${month} ${year} · KCP MAS RAWAMANGUN`}
        />
        <SummaryCard
          icon={<UserRound className="h-5 w-5 text-[#199900]" />}
          label="Total Nasabah"
          value={`${nasabahCount} Nasabah`}
          hint="Terdaftar pada activity periode ini"
        />
        <SummaryCard
          icon={<CircleCheck className="h-5 w-5 text-[#199900]" />}
          label="Progres"
          value={`${doneCount} Selesai`}
          hint={`${scheduledCount} terjadwal · ${month} ${year}`}
        />
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7">
          <div>
            <h2 className="text-[25px] font-semibold">Daftar Activity</h2>
            <p className="mt-1 text-[14px] text-slate-400">{visible.length} Data</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <FilterSelect
              icon={<CalendarDays className="h-5 w-5 text-[#292663]" />}
              value={month}
              options={[...KCP_MONTHS]}
              onChange={(value) => changePeriod(value, year)}
            />
            <FilterSelect
              icon={<CalendarDays className="h-5 w-5 text-[#292663]" />}
              value={year}
              options={years}
              onChange={(value) => changePeriod(month, value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="border-y border-slate-200 text-[14px] text-slate-400">
              <tr>
                <th className="px-7 py-5 font-medium">No</th>
                <th className="px-5 py-5 font-medium">Aktivitas</th>
                <th className="px-5 py-5 font-medium">KCP</th>
                <th className="px-5 py-5 font-medium">Tanggal</th>
                <th className="px-5 py-5 font-medium">Nasabah</th>
                <th className="px-5 py-5 font-medium">Status</th>
                <th className="px-7 py-5 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-7 py-6">{(safePage - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="px-5 py-6">
                    <p className="font-medium">{item.title}</p>
                    <p className="mt-0.5 max-w-[260px] truncate text-[13px] text-slate-400">
                      {item.place}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-6">{item.kcp}</td>
                  <td className="whitespace-nowrap px-5 py-6">{formatDate(item.date)}</td>
                  <td className="whitespace-nowrap px-5 py-6 tabular-nums">
                    {item.entries.length} Nasabah
                  </td>
                  <td className="whitespace-nowrap px-5 py-6">
                    <StatusBadge status={item.status} />
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
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-7 py-12 text-center text-[14px] text-slate-400">
                    Belum ada activity pada {month} {year}.
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

      {detail && <ActivityDetailModal item={detail} onClose={() => setDetail(null)} />}
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

function StatusBadge({ status }: { status: KepalaKcpActivity["status"] }) {
  const done = status === "Selesai";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[14px] ${done ? "text-green-700" : "text-amber-600"}`}
    >
      {done ? <CircleCheck className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
      {status}
    </span>
  );
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${iso}T00:00:00`));
}

function ActivityDetailModal({
  item,
  onClose,
}: {
  item: KepalaKcpActivity;
  onClose: () => void;
}) {
  const [showPhoto, setShowPhoto] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="relative max-h-[calc(100vh-32px)] w-full max-w-[720px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
          <div>
            <h2 className="text-[22px] font-bold">Detail Activity</h2>
            <p className="mt-0.5 text-[14px] text-slate-400">
              {item.kcp} · {formatDate(item.date)} | {item.time}
            </p>
          </div>
          <button onClick={onClose} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-280px)] overflow-y-auto px-8 py-6">
          <p className="text-[18px] font-semibold">{item.title}</p>
          <p className="mt-1 text-[14px] text-slate-500">
            {item.place} · {item.region}
          </p>
          <div className="mt-2">
            <StatusBadge status={item.status} />
          </div>

          <h3 className="mt-6 text-[16px] font-semibold">
            Daftar Nasabah ({item.entries.length})
          </h3>
          {item.entries.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {item.entries.map((entry, index) => (
                <li
                  key={entry.sbg}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef2f7] text-[15px] font-semibold text-[#292663]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium">{entry.nama}</span>
                    <span className="block text-[13px] tabular-nums text-slate-400">
                      {entry.sbg}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold ${
                      entry.tipe === "ADO"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {entry.tipe}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-[14px] text-slate-400">
              Belum ada daftar nasabah untuk activity ini.
            </p>
          )}

          <button
            onClick={() => setShowPhoto((value) => !value)}
            className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#2953A4] py-4 text-[16px] font-medium text-white"
          >
            <Eye className="h-5 w-5" />
            {showPhoto ? "Sembunyikan Foto" : "Lihat Foto"}
          </button>
          {showPhoto && (
            <div className="mt-3 flex min-h-[220px] items-center justify-center overflow-hidden rounded-xl bg-[#eef2f7] p-4">
              {item.photoUrl ? (
                <img
                  src={item.photoUrl}
                  alt={`Foto kegiatan ${item.title}`}
                  className="max-h-[360px] w-full rounded-lg object-contain"
                />
              ) : (
                <p className="px-6 py-8 text-center text-[14px] text-slate-400">
                  Foto kegiatan belum tersedia.
                </p>
              )}
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
