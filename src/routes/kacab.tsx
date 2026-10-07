import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { OverlayPortal } from "@/components/motion";
import { useAllLeads } from "@/lib/leads-store";
import type { Contact } from "@/lib/mock-data";
import {
  BatteryFull,
  Bell,
  Buildings,
  CaretDown,
  CaretRight,
  CellSignalFull,
  ClipboardText,
  Clock,
  Crosshair,
  FileText,
  House,
  Megaphone,
  Plus,
  Phone,
  User,
  Users,
  WifiHigh,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";

export const Route = createFileRoute("/kacab")({
  head: () => ({ meta: [{ title: "Home KACAB — Sales Tracking" }] }),
  component: KacabHome,
});

type Period = "today" | "week" | "month";

const KCP_DATA = [
  {
    name: "MAS MONANG-MANING",
    visit: { today: [0, 1], week: [3, 7], month: [7, 7] },
    waskat: { today: 0, week: 4, month: 10 },
    marketing: {
      kepala: { today: [0, 0], week: [3, 6], month: [24, 24] },
      ro: { today: [0, 5], week: [12, 30], month: [120, 120] },
      ovd: { today: [0, 5], week: [12, 30], month: [120, 120] },
      leads: { today: [0, 5], week: [18, 30], month: [120, 120] },
      closing: { today: [0, 1], week: [4, 6], month: [24, 24] },
    },
  },
  {
    name: "MAS RAWAMANGUN",
    visit: { today: [1, 2], week: [5, 8], month: [18, 24] },
    waskat: { today: 1, week: 6, month: 14 },
    marketing: {
      kepala: { today: [0, 0], week: [4, 6], month: [18, 24] },
      ro: { today: [3, 5], week: [18, 30], month: [96, 120] },
      ovd: { today: [2, 5], week: [14, 30], month: [88, 120] },
      leads: { today: [4, 5], week: [22, 30], month: [108, 120] },
      closing: { today: [1, 1], week: [5, 6], month: [19, 24] },
    },
  },
] as const;

function KacabHome() {
  const [selectedKcp, setSelectedKcp] = useState(0);
  const [period, setPeriod] = useState<Period>("today");
  const [leadDetail, setLeadDetail] = useState<"all" | "closing" | null>(null);
  const kcp = KCP_DATA[selectedKcp];
  const leads = useAllLeads();

  return (
    <MobileShell role="kacab" hideFab>
      <header
        className="relative h-[176px] overflow-visible px-4 pt-[56px] text-white"
        style={{ background: "linear-gradient(180deg, #28285f 0%, #4d529d 72%, #7b8bd0 100%)" }}
      >
        <div className="absolute inset-x-6 top-5 flex items-center justify-between text-white">
          <span className="text-[15px] font-semibold tracking-tight">9:41</span>
          <span className="flex items-center gap-1.5">
            <CellSignalFull size={17} weight="bold" />
            <WifiHigh size={18} weight="bold" />
            <BatteryFull size={20} weight="bold" />
          </span>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#2953A4]">
              <User size={30} weight="fill" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-white/75">Selamat datang</p>
              <p className="line-clamp-2 text-[16px] font-bold leading-tight">KACAB ({kcp.name})</p>
            </div>
          </div>
          <button
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#2953A4]"
            aria-label="Notifikasi"
          >
            <Bell size={21} weight="regular" />
          </button>
        </div>

        <div className="absolute left-3 right-3 top-[116px] z-20 grid grid-cols-2 divide-x divide-slate-200 rounded-xl bg-white p-3 text-slate-900 shadow-[0_12px_24px_rgba(25,42,77,0.10)]">
          <SummaryMetric
            icon={<Buildings size={20} weight="regular" />}
            label="Visit"
            value={`${kcp.visit[period][0]}`}
            target={`/${kcp.visit[period][1]}`}
          />
          <SummaryMetric
            icon={<FileText size={20} weight="regular" />}
            label="Waskat"
            value={`${kcp.waskat[period]}`}
          />
        </div>
        <svg
          className="absolute bottom-0 left-0 h-[100px] w-full"
          viewBox="0 0 440 70"
          preserveAspectRatio="none"
        >
          <path d="M0,38 C110,72 230,72 440,14 L440,70 L0,70 Z" fill="#8fa3d9" opacity="0.5" />
          <path d="M0,48 C130,78 260,76 440,28 L440,70 L0,70 Z" fill="#c3d0f0" opacity="0.75" />
          <path d="M0,56 C140,82 280,80 440,40 L440,70 L0,70 Z" fill="#eef2fd" />
        </svg>
      </header>

      <main className="space-y-5 bg-background px-4 pb-8 pt-[20px]">
        <section>
          <h2 className="text-[20px] font-bold text-slate-900">Monitoring Aktivitas</h2>
          <label className="mt-3 block text-[14px] font-medium text-slate-700">Pilih KCP</label>
          <span className="relative mt-1.5 block">
            <select
              value={selectedKcp}
              onChange={(e) => setSelectedKcp(Number(e.target.value))}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[14px] font-medium text-slate-900 outline-none"
            >
              {KCP_DATA.map((item, index) => (
                <option key={item.name} value={index}>
                  {item.name}
                </option>
              ))}
            </select>
            <CaretDown
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
              weight="regular"
            />
          </span>
        </section>

        <section>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(
              [
                ["today", "Hari ini"],
                ["week", "Minggu ini"],
                ["month", "Bulan ini"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={`flex-shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium ${period === value ? "border-[#2953A4] bg-[#2953A4] text-white" : "border-slate-200 bg-white text-slate-500"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-3">
            <MetricGroup icon={<User size={18} weight="regular" />} title="Kepala KCP">
              <MetricRow
                icon={<Megaphone size={18} weight="regular" />}
                label="Marketing"
                value={kcp.marketing.kepala[period]}
              />
            </MetricGroup>
            <MetricGroup icon={<Users size={18} weight="regular" />} title="Penaksir Kasir">
              <div className="grid grid-cols-2 gap-2.5">
                <MetricRow
                  icon={<ClipboardText size={18} weight="regular" />}
                  label="Follow Up RO"
                  value={kcp.marketing.ro[period]}
                />
                <MetricRow
                  icon={<Clock size={18} weight="regular" />}
                  label="Follow Up OVD"
                  value={kcp.marketing.ovd[period]}
                />
              </div>
            </MetricGroup>
            <MetricGroup icon={<Users size={18} weight="regular" />} title="Sales Officer">
              <div className="grid grid-cols-2 gap-2.5">
                <MetricRow
                  icon={<Crosshair size={18} weight="regular" />}
                  label="Leads"
                  value={kcp.marketing.leads[period]}
                  onClick={() => setLeadDetail("all")}
                />
                <MetricRow
                  icon={<User size={18} weight="regular" />}
                  label="Closing Leads"
                  value={kcp.marketing.closing[period]}
                  onClick={() => setLeadDetail("closing")}
                />
              </div>
            </MetricGroup>
          </div>
        </section>

        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-slate-900">Aktivitas Hari Ini</h2>
            <Link
              to="/kacab-aktivitas"
              className="inline-flex items-center gap-0.5 text-[13px] font-medium text-slate-500"
            >
              Lihat Semua <CaretRight size={17} weight="regular" />
            </Link>
          </div>
          <div className="py-3 text-center">
            <img src="/empty-activity.svg" alt="" className="mx-auto h-28 w-40 object-contain" />
            <p className="mt-4 text-[17px] font-bold text-slate-900">
              Belum Ada Aktivitas Marketing
            </p>
            <p className="mt-1 text-[13px] text-slate-500">
              Aktivitas yang tersedia akan muncul disini
            </p>
            <a
              href="/kacab-aktivitas/buat"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#2953A4] bg-white px-4 py-2.5 text-[14px] font-medium text-[#2953A4]"
            >
              <Plus size={20} weight="regular" /> Tambah Aktivitas
            </a>
          </div>
        </section>
      </main>
      {leadDetail && (
        <LeadDetailsSheet
          leads={
            leadDetail === "closing" ? leads.filter((lead) => lead.status === "Closing") : leads
          }
          title={leadDetail === "closing" ? "Detail Closing Leads" : "Detail Leads"}
          onClose={() => setLeadDetail(null)}
        />
      )}
    </MobileShell>
  );
}

function SummaryMetric({
  icon,
  label,
  value,
  target,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  target?: string;
}) {
  return (
    <div className="flex items-center gap-2 px-1 first:pr-3 last:pl-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef5ff] text-[#607b9d]">
        {icon}
      </span>
      <div>
        <p className="text-[13px] text-slate-500">{label}</p>
        <p className="mt-1 text-[18px] font-bold text-slate-900">
          {value}
          <span className="font-normal text-slate-400">{target}</span>
        </p>
      </div>
    </div>
  );
}

function MetricGroup({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <p className="mb-3 flex items-center gap-2 px-1 text-[15px] font-bold text-slate-900">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef5ff] text-[#2953A4]">
          {icon}
        </span>
        {title}
      </p>
      {children}
    </div>
  );
}

function MetricRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: readonly [number, number];
  onClick?: () => void;
}) {
  const percent = value[1] ? Math.min(100, Math.round((value[0] / value[1]) * 100)) : 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-left ${onClick ? "transition-transform active:scale-[0.99]" : "cursor-default"}`}
    >
      <p className="flex items-center gap-2 text-[14px] font-medium text-slate-700">
        <span className="text-[#2953A4]">{icon}</span>
        <span className="truncate">{label}</span>
      </p>
      <p className="mt-2 text-[20px] font-bold leading-none text-slate-900">
        {value[0]}
        <span className="font-normal text-slate-400">/{value[1]}</span>
      </p>
      {value[1] > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#edf3fb]">
            <div className="h-full rounded-full bg-[#2953A4]" style={{ width: `${percent}%` }} />
          </div>
          <span className="w-9 shrink-0 text-right text-[12px] font-medium text-slate-600">
            {percent}%
          </span>
        </div>
      )}
    </button>
  );
}

function LeadDetailsSheet({
  leads,
  title,
  onClose,
}: {
  leads: Contact[];
  title: string;
  onClose: () => void;
}) {
  return (
    <OverlayPortal>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 px-0">
        <div className="w-full max-w-[440px] rounded-t-3xl bg-white px-5 pb-8 pt-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[22px] font-bold text-slate-900">{title}</h2>
              <p className="mt-0.5 text-[13px] text-slate-500">{leads.length} data nasabah</p>
            </div>
            <button type="button" onClick={onClose} aria-label="Tutup detail leads">
              <X size={28} weight="regular" className="text-slate-500" />
            </button>
          </div>

          <div className="mt-5 max-h-[62vh] space-y-3 overflow-y-auto">
            {leads.length > 0 ? (
              leads.map((lead) => <LeadContactCard key={lead.id} lead={lead} />)
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-[14px] text-slate-500">
                Belum ada data leads.
              </div>
            )}
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}

function LeadContactCard({ lead }: { lead: Contact }) {
  const whatsappNumber = lead.phone.replace(/\D/g, "").replace(/^0/, "62");
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(25,42,77,0.04)]">
      <p className="text-[16px] font-medium text-slate-900">{lead.name}</p>
      <p className="mt-0.5 text-[14px] text-slate-500">
        {lead.job ?? "Pekerjaan belum tersedia"} <span className="text-slate-300">|</span>{" "}
        {lead.status}
      </p>
      <div className="mt-3 flex gap-2">
        <a
          href={`tel:${lead.phone}`}
          aria-label={`Telepon ${lead.name}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef5ff] text-[#2953A4]"
        >
          <Phone size={20} weight="regular" />
        </a>
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`WhatsApp ${lead.name}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f7ed] text-[#16a765]"
        >
          <span className="text-[18px] font-bold">W</span>
        </a>
      </div>
    </div>
  );
}
