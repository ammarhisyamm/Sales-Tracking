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
import { getLeadsForActivity } from "../lib/leads-store";
import type { Contact } from "../lib/mock-data";
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
  const [photoItem, setPhotoItem] = useState<KepalaKcpActivity | null>(null);

  const all = useMemo(() => {
    const seeds = KCP_ACTIVITY_SEEDS;
    const mapped = salesActivities.map((activity) =>
      fromSalesActivity(activity, getLeadsForActivity(activity.id, activity.type)),
    );
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
  const totalLeads = useMemo(
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
          value={`${visible.length}`}
          hint={`${month} ${year} · KCP MAS RAWAMANGUN`}
        />
        <SummaryCard
          icon={<CircleCheck className="h-5 w-5 text-[#199900]" />}
          label="Aktivitas Selesai"
          value={`${doneCount}`}
          hint={`${month} ${year} · KCP MAS RAWAMANGUN`}
        />
        <SummaryCard
          icon={<UserRound className="h-5 w-5 text-[#199900]" />}
          label="Total Leads"
          value={`${totalLeads}`}
          hint={`${month} ${year} · KCP MAS RAWAMANGUN`}
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
          <table className="w-full min-w-[1150px] border-collapse text-left">
            <thead className="border-y border-slate-200 text-[14px] text-slate-400">
              <tr>
                <th className="px-7 py-5 font-medium">No</th>
                <th className="px-5 py-5 font-medium">Tanggal</th>
                <th className="px-5 py-5 font-medium">Aktivitas</th>
                <th className="px-5 py-5 font-medium">Lokasi</th>
                <th className="px-5 py-5 font-medium">Target Leads</th>
                <th className="px-5 py-5 font-medium">Realisasi Leads</th>
                <th className="px-5 py-5 font-medium">Status</th>
                <th className="px-7 py-5 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-7 py-6">{(safePage - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="whitespace-nowrap px-5 py-6">{formatDate(item.date)}</td>
                  <td className="max-w-[240px] truncate px-5 py-6 font-medium">{item.title}</td>
                  <td className="max-w-[220px] truncate px-5 py-6">{item.place}</td>
                  <td className="whitespace-nowrap px-5 py-6 tabular-nums">
                    {item.leadsTarget ?? 10}
                  </td>
                  <td className="whitespace-nowrap px-5 py-6 tabular-nums">
                    {item.leadIds.length}
                  </td>
                  <td className="whitespace-nowrap px-5 py-6">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="whitespace-nowrap px-7 py-6 text-right">
                    <span className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setDetail(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => setPhotoItem(item)}
                        aria-label={`Lihat foto kegiatan ${item.title}`}
                        title="Lihat foto"
                        className="inline-flex items-center justify-center rounded-lg border border-[#292663] p-2.5 text-[#292663]"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </span>
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
      {photoItem && (
        <PhotoModal
          title={photoItem.title}
          photoUrl={photoItem.photoUrl}
          onClose={() => setPhotoItem(null)}
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

function ActivityDetailModal({ item, onClose }: { item: KepalaKcpActivity; onClose: () => void }) {
  const nasabah = useMemo(
    () => resolveLeadIds(item.leadIds, item.leadContacts),
    [item.leadIds, item.leadContacts],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="relative max-h-[calc(100vh-32px)] w-full max-w-[880px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
          <h2 className="text-[22px] font-bold">Detail Activity</h2>
          <button onClick={onClose} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-280px)] overscroll-contain overflow-y-auto px-8 py-6">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 md:grid-cols-4">
              <InfoCell label="Tanggal" value={formatDate(item.date)} />
              <InfoCell label="Aktivitas" value={item.title} />
              <InfoCell label="Tanggal" value={formatDate(item.date)} />
              <InfoCell label="Nama Lokasi" value={item.place} />
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 md:grid-cols-4">
              <InfoCell label="Alamat" value={item.address ?? item.place} />
              <InfoCell label="Kelurahan" value={item.kelurahan ?? item.region} />
              <InfoCell label="Target Leads" value={String(item.leadsTarget ?? 10)} />
              <InfoCell label="Realisasi Leads" value={String(nasabah.length)} />
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">
              <InfoCell label="Status" value={<StatusBadge status={item.status} />} />
            </div>
          </div>

          <h3 className="mt-6 text-[16px] font-semibold">Daftar Leads ({nasabah.length})</h3>
          {nasabah.length > 0 ? (
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
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                          {contact.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 tabular-nums">
                          {contact.phone}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {contact.kelurahan ?? "-"}
                        </td>
                        <td className="max-w-[160px] truncate px-4 py-4 text-slate-600">
                          {contact.job ?? "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <StatusPill status={contact.status} />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
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
