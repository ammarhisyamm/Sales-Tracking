import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Crosshair,
  Eye,
  ListChecks,
  UserRound,
  X,
} from "lucide-react";
import { useActivities } from "../lib/activity-store";
import { useLeads } from "../lib/leads-store";
import { KCP_MONTHS } from "../lib/kepala-kcp";
import { STATUS_META, type Activity, type ActivityStatus } from "../lib/mock-data";
import type { Contact } from "../lib/mock-data";

const PAGE_SIZE = 10;

const now = new Date();
const DEFAULT_MONTH = KCP_MONTHS[now.getMonth()];
const DEFAULT_YEAR = String(now.getFullYear());

export function SalesOfficerView() {
  const activities = useActivities();
  const [month, setMonth] = useState<string>(DEFAULT_MONTH);
  const [year, setYear] = useState<string>(DEFAULT_YEAR);
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Activity | null>(null);

  const years = useMemo(() => {
    const set = new Set(activities.map((item) => item.date.slice(0, 4)));
    set.add(DEFAULT_YEAR);
    return [...set].sort().reverse();
  }, [activities]);

  const monthIndex = KCP_MONTHS.indexOf(month as (typeof KCP_MONTHS)[number]);

  const visible = useMemo(
    () =>
      activities.filter((item) => {
        const d = new Date(item.date);
        return d.getMonth() === monthIndex && String(d.getFullYear()) === year;
      }),
    [activities, monthIndex, year],
  );

  const totalLeads = useMemo(
    () => visible.reduce((sum, item) => sum + item.leadsCount, 0),
    [visible],
  );
  const totalClosing = useMemo(
    () => visible.reduce((sum, item) => sum + item.closingCount, 0),
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
          value={`${visible.length}`}
          hint={`${month} ${year} · Sales Gadai Mas`}
        />
        <SummaryCard
          icon={<Crosshair className="h-5 w-5 text-[#199900]" />}
          label="Total Leads"
          value={`${totalLeads}`}
          hint={`${month} ${year} · realisasi kegiatan`}
        />
        <SummaryCard
          icon={<UserRound className="h-5 w-5 text-[#199900]" />}
          label="Total Closing"
          value={`${totalClosing}`}
          hint={`${month} ${year} · realisasi kegiatan`}
        />
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7">
          <div>
            <h2 className="text-[25px] font-semibold">Daftar Pencapaian Sales Officer</h2>
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
          <table className="w-full min-w-[1150px] border-collapse text-left">
            <thead className="border-y border-slate-200 text-[14px] text-slate-400">
              <tr>
                <th className="px-7 py-5 font-medium">No</th>
                <th className="px-5 py-5 font-medium">Tanggal</th>
                <th className="px-5 py-5 font-medium">Aktivitas</th>
                <th className="px-5 py-5 font-medium">Lokasi</th>
                <th className="px-5 py-5 font-medium">Leads</th>
                <th className="px-5 py-5 font-medium">Closing</th>
                <th className="px-5 py-5 font-medium">Status</th>
                <th className="px-7 py-5 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-7 py-6">{(safePage - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="whitespace-nowrap px-5 py-6">{formatDate(item.date)}</td>
                  <td className="max-w-[240px] truncate px-5 py-6 font-medium">
                    {item.locationName}
                  </td>
                  <td className="max-w-[220px] truncate px-5 py-6">{item.address}</td>
                  <td className="whitespace-nowrap px-5 py-6 tabular-nums">
                    {item.leadsCount}/{item.leadsTarget}
                  </td>
                  <td className="whitespace-nowrap px-5 py-6 tabular-nums">
                    {item.closingCount}
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

function StatusBadge({ status }: { status: ActivityStatus }) {
  return <span className={`text-[14px] font-medium ${STATUS_META[status].className}`}>{STATUS_META[status].label}</span>;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

function InfoCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0 px-5 py-4">
      <p className="text-[15px] font-medium text-slate-700">{label}</p>
      <div className="mt-1 truncate text-[15px] text-slate-400">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: Contact["status"] }) {
  const styles: Record<Contact["status"], string> = {
    Hot: "bg-[#ffe0e0] text-[#e5484d]",
    Cold: "bg-[#e0f0ff] text-[#2b7cd3]",
    Warm: "bg-[#ffefd6] text-[#e8930c]",
    Closing: "bg-green-100 text-green-800",
  };
  return (
    <span
      className={`inline-block min-w-[72px] rounded-full px-4 py-1.5 text-center text-[14px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ActivityDetailModal({ item, onClose }: { item: Activity; onClose: () => void }) {
  const [photoOpen, setPhotoOpen] = useState(false);
  const leads = useLeads(item.id, item.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="relative max-h-[calc(100vh-32px)] w-full max-w-[880px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
          <h2 className="text-[22px] font-bold">Detail Activity</h2>
          <button onClick={onClose} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-280px)] overflow-y-auto px-8 py-6">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 md:grid-cols-4">
              <InfoCell label="Tanggal" value={formatDate(item.date)} />
              <InfoCell label="Aktivitas" value={item.locationName} />
              <InfoCell label="Waktu" value={`${item.timeRange} WIB`} />
              <InfoCell label="Lokasi" value={item.address} />
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">
              <InfoCell label="Leads" value={`${item.leadsCount}/${item.leadsTarget}`} />
              <InfoCell label="Closing Leads" value={String(item.closingCount)} />
              <InfoCell label="Status" value={<StatusBadge status={item.status} />} />
              <InfoCell label="Jenis" value={item.kind === "digital" ? "Digital" : "Lapangan"} />
            </div>
          </div>

          <h3 className="mt-6 text-[16px] font-semibold">Daftar Leads ({leads.length})</h3>
          {leads.length > 0 ? (
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[860px] border-collapse text-left text-[14px]">
                <thead className="bg-slate-50 text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th scope="col" className="px-4 py-3 font-medium">
                      No
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Calon Nama Nasabah
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Nomor Telepon
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Kelurahan
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Pekerjaan
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status Nasabah
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, index) => (
                    <tr key={lead.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-4 text-slate-500">{index + 1}</td>
                      <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                        {lead.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 tabular-nums">{lead.phone}</td>
                      <td className="whitespace-nowrap px-4 py-4">{lead.kelurahan ?? "-"}</td>
                      <td className="max-w-[160px] truncate px-4 py-4 text-slate-600">
                        {lead.job ?? "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4">
                        <StatusPill status={lead.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-[14px] text-slate-400">
              Belum ada leads tercatat untuk activity ini.
            </p>
          )}

          <button
            onClick={() => setPhotoOpen(true)}
            className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#2953A4] py-4 text-[16px] font-medium text-white"
          >
            <Eye className="h-5 w-5" /> Lihat Foto
          </button>
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
      {photoOpen && (
        <PhotoModal
          title={item.locationName}
          photoUrl={item.photoUrl}
          onClose={() => setPhotoOpen(false)}
        />
      )}
    </div>
  );
}

function PhotoModal({
  title,
  photoUrl,
  onClose,
}: {
  title: string;
  photoUrl?: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 p-4">
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
          <h2 className="text-[22px] font-bold">Foto Kegiatan</h2>
          <button onClick={onClose} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        <div className="px-8 py-6">
          <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl bg-[#eef2f7] p-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`Foto kegiatan ${title}`}
                className="max-h-[420px] w-full rounded-lg object-contain"
              />
            ) : (
              <p className="px-6 py-8 text-center text-[14px] text-slate-400">
                Foto kegiatan belum tersedia.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
