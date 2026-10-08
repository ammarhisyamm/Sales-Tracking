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
  MessageCircle,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import { useActivities } from "../lib/activity-store";
import {
  KCP_ACTIVITY_SEEDS,
  KCP_MONTHS,
  filterByPeriod,
  fromSalesActivity,
  resolveLeadIds,
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
    () => visible.reduce((sum, item) => sum + item.leadIds.length, 0),
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
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <thead className="border-y border-slate-200 text-[14px] text-slate-400">
              <tr>
                <th className="px-7 py-5 font-medium">No</th>
                <th className="px-5 py-5 font-medium">Aktivitas</th>
                <th className="px-5 py-5 font-medium">KCP</th>
                <th className="px-5 py-5 font-medium">Tanggal</th>
                <th className="px-5 py-5 font-medium">Lokasi</th>
                <th className="px-5 py-5 font-medium">Nasabah</th>
                <th className="px-5 py-5 font-medium">Status</th>
                <th className="px-7 py-5 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-7 py-6">{(safePage - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="max-w-[240px] truncate px-5 py-6 font-medium">{item.title}</td>
                  <td className="whitespace-nowrap px-5 py-6">{item.kcp}</td>
                  <td className="whitespace-nowrap px-5 py-6">{formatDate(item.date)}</td>
                  <td className="max-w-[220px] truncate px-5 py-6">{item.place}</td>
                  <td className="whitespace-nowrap px-5 py-6 tabular-nums">
                    {item.leadIds.length} Nasabah
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
                  <td colSpan={8} className="px-7 py-12 text-center text-[14px] text-slate-400">
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

function ActivityDetailModal({ item, onClose }: { item: KepalaKcpActivity; onClose: () => void }) {
  const [showPhoto, setShowPhoto] = useState(false);
  const nasabah = useMemo(() => resolveLeadIds(item.leadIds), [item.leadIds]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="relative max-h-[calc(100vh-32px)] w-full max-w-[720px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
          <h2 className="text-[22px] font-bold">Detail Activity</h2>
          <button onClick={onClose} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-280px)] overscroll-contain overflow-y-auto px-8 py-6">
          <h3 className="text-[16px] font-semibold">Informasi Activity</h3>
          <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-left text-[14px]">
              <tbody>
                <tr className="border-b border-slate-100">
                  <th scope="row" className="w-40 bg-slate-50 px-4 py-3 font-medium text-slate-500">
                    Aktivitas
                  </th>
                  <td className="px-4 py-3 font-medium text-slate-900">{item.title}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <th scope="row" className="bg-slate-50 px-4 py-3 font-medium text-slate-500">
                    KCP
                  </th>
                  <td className="px-4 py-3">{item.kcp}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <th scope="row" className="bg-slate-50 px-4 py-3 font-medium text-slate-500">
                    Tanggal
                  </th>
                  <td className="px-4 py-3">{formatDate(item.date)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <th scope="row" className="bg-slate-50 px-4 py-3 font-medium text-slate-500">
                    Waktu
                  </th>
                  <td className="px-4 py-3">{item.time}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <th scope="row" className="bg-slate-50 px-4 py-3 font-medium text-slate-500">
                    Lokasi
                  </th>
                  <td className="px-4 py-3">{item.place}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <th scope="row" className="bg-slate-50 px-4 py-3 font-medium text-slate-500">
                    Wilayah
                  </th>
                  <td className="px-4 py-3">{item.region}</td>
                </tr>
                <tr>
                  <th scope="row" className="bg-slate-50 px-4 py-3 font-medium text-slate-500">
                    Status
                  </th>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 text-[16px] font-semibold">Daftar Leads ({nasabah.length})</h3>
          {nasabah.length > 0 ? (
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[680px] border-collapse text-left text-[14px]">
                <thead className="bg-slate-50 text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th scope="col" className="px-4 py-3 font-medium">
                      No
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Nasabah
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Pekerjaan
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">
                      Kontak
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {nasabah.map((contact, index) => {
                    const digits = contact.phone.replace(/\D/g, "");
                    return (
                      <tr key={contact.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-4 text-slate-500">{index + 1}</td>
                        <td className="px-4 py-4 font-medium text-slate-900">{contact.name}</td>
                        <td className="px-4 py-4 text-slate-600">{contact.job ?? "-"}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-600">
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="flex justify-end gap-2">
                            <a
                              href={`tel:${contact.phone}`}
                              aria-label={`Telepon ${contact.name}`}
                              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef5fd] text-[#2953A4]"
                            >
                              <Phone className="h-[22px] w-[22px]" />
                            </a>
                            <a
                              href={`https://wa.me/${digits}`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`WhatsApp ${contact.name}`}
                              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6f7ed] text-[#18a957]"
                            >
                              <MessageCircle className="h-6 w-6" />
                            </a>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-[14px] text-slate-400">
              Belum ada nasabah tercatat untuk activity ini.
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
