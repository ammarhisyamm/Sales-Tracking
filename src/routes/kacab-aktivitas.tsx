import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { useActivities } from "@/lib/activity-store";
import { KCP_ACTIVITY_SEEDS } from "@/lib/kepala-kcp";
import type { Activity } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Crosshair, MapPin, Plus } from "lucide-react";

export const Route = createFileRoute("/kacab-aktivitas")({
  head: () => ({ meta: [{ title: "Aktivitas KACAB" }] }),
  component: KacabActivities,
});

const TABS = ["Hari Ini", "Minggu Ini", "Bulan Ini", "Custom"] as const;
type KacabActivityItem = {
  id: string;
  kcp: string;
  date: string;
  title: string;
  ptm?: string;
  activityTypes?: string[];
  place: string;
  region: string;
  leadsCount?: number;
  leadsTarget?: number;
  leadIds?: string[];
  photoUrl?: string;
};
/** Sumber data sama dengan dashboard Pencapaian Kepala KCP. */
const ITEMS: KacabActivityItem[] = KCP_ACTIVITY_SEEDS;

function KacabActivities() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/kacab-aktivitas") return <Outlet />;
  return <KacabActivityList />;
}

function KacabActivityList() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Custom");
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const activities = useActivities();
  const activityItems = useMemo(
    () => [...ITEMS, ...activities.map(toKacabActivityItem)],
    [activities],
  );
  const visible = useMemo(() => {
    if (tab !== "Custom") return activityItems;
    return activityItems.filter((item) => item.date >= from && item.date <= to);
  }, [activityItems, tab, from, to]);

  return (
    <MobileShell role="kacab" hideFab>
      <header className="bg-background px-5 pb-5 pt-12">
        <h1 className="text-[22px] font-bold text-slate-900">Aktivitas</h1>
        <p className="mt-0.5 text-[15px] text-slate-500">
          Kelola dan pantau semua kegiatan lapanganmu
        </p>
      </header>
      <main className="space-y-4 bg-background px-5 pb-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`flex-shrink-0 rounded-full border px-4 py-2.5 text-[14px] font-medium ${tab === item ? "border-[#2953A4] bg-[#2953A4] text-white" : "border-slate-200 bg-white text-slate-500"}`}
            >
              {item}
            </button>
          ))}
        </div>
        {tab === "Custom" && (
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#dce6f3] bg-[#f1f6fc] p-3">
            <DateField label="Dari Tanggal" value={from} onChange={setFrom} />
            <DateField label="Ke Tanggal" value={to} onChange={setTo} />
          </div>
        )}
        <div className="space-y-4">
          {visible.map((item) => {
            const key = item.id;
            const additionalActivities = item.activityTypes?.slice(1) ?? [];
            const expanded = expandedItem === key;
            const leadsCount = item.leadsCount ?? item.leadIds?.length ?? 0;
            const leadsTarget = item.leadsTarget ?? 10;
            return (
              <section key={key} className="rounded-xl border border-[#dce6f3] bg-white p-3">
                <article>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14px] font-bold text-[#2953A4]">
                      {item.title}
                      <span className="mx-1.5 font-normal text-slate-300">•</span>
                      <span className="font-normal text-slate-600">{item.ptm || "Dalam PTM"}</span>
                    </p>
                    <span className="flex-shrink-0 text-[14px] text-slate-600">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  <div className="my-3 border-t border-slate-100" />
                  {additionalActivities.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpandedItem(expanded ? null : key)}
                        className="mt-2 flex w-full items-center justify-between text-left text-[14px] text-[#607b9d]"
                      >
                        <span>+{additionalActivities.length} Kegiatan Lainnya</span>
                        {expanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                      {expanded && (
                        <div className="mt-2 space-y-2 rounded-2xl bg-[#eef5ff] p-3">
                          {additionalActivities.map((activity, index) => (
                            <div
                              key={activity}
                              className="flex items-center gap-3 text-[14px] font-medium text-slate-700"
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-900">
                                {index + 1}
                              </span>
                              <span>{activity}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-3">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#eef5ff] text-[#2953A4]">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-medium text-slate-900">
                        {item.place}
                      </p>
                      <p className="mt-0.5 text-[14px] text-slate-500">{item.region}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-[15px] text-slate-600">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef5ff] text-[#2953A4]">
                        <Crosshair className="h-5 w-5" />
                      </span>
                      <span>
                        {leadsCount}/{leadsTarget} Leads
                      </span>
                    </div>
                    <a
                      href={`/tambah-leads/${item.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#315bac] px-4 py-3 text-[15px] font-semibold text-white"
                    >
                      <Plus className="h-5 w-5" /> Tambah Leads
                    </a>
                  </div>
                </article>
              </section>
            );
          })}
          {visible.length === 0 && (
            <div className="rounded-2xl border border-slate-200 px-5 py-12 text-center text-[14px] text-slate-500">
              Belum ada aktivitas pada rentang tanggal ini.
            </div>
          )}
        </div>
        <div className="flex justify-center pt-1">
          <a
            href="/kacab-aktivitas/buat"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#2953A4] px-5 py-3 text-[15px] font-semibold text-[#2953A4]"
          >
            <Plus className="h-5 w-5" /> Tambah Aktivitas
          </a>
        </div>
      </main>
    </MobileShell>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-medium text-slate-800">{label}</span>
      <span className="relative block">
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-[13px] text-slate-900 outline-none"
        />
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </span>
    </label>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function toKacabActivityItem(activity: Activity): KacabActivityItem {
  const activityTypes = activity.activityTypes?.length ? activity.activityTypes : [activity.type];
  return {
    id: activity.id,
    kcp: activity.locationName,
    date: activity.date.slice(0, 10),
    title: activityTypes[0],
    ptm: activity.ptm,
    activityTypes,
    place: activity.address,
    region: activity.wilayah || activity.kelurahan || "Wilayah belum tersedia",
    leadsCount: activity.leadsCount,
    leadsTarget: activity.leadsTarget,
    leadIds: [],
    photoUrl: activity.photoUrl,
  };
}
