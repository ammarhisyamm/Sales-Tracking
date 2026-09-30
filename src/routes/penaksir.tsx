import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import {
  ArrowsClockwise,
  BatteryFull as PhosphorBatteryFull,
  Bell as PhosphorBell,
  CaretDown,
  CaretRight,
  CellSignalFull,
  ClipboardText,
  Eye as PhosphorEye,
  FileImage,
  FileText as PhosphorFileText,
  House,
  Plus as PhosphorPlus,
  User as PhosphorUser,
  UserSquare,
  WifiHigh,
} from "@phosphor-icons/react";
import { useState } from "react";

export const Route = createFileRoute("/penaksir")({
  head: () => ({ meta: [{ title: "Penaksir — Sales Tracking" }] }),
  component: PenaksirHome,
});

const PRIMARY = "#2953A4";

type Range = "today" | "week" | "month";

const HEADER_SUMMARY = {
  ro: { current: 0, target: 120 },
  ovd: { current: 0, target: 120 },
};

/** pct ditulis eksplisit agar sama persis dengan desain (minggu: 2/15 tampil 90%). */
const RANGE_SUMMARY: Record<
  Range,
  {
    ro: { current: number; target: number; pct: number };
    ovd: { current: number; target: number; pct: number };
  }
> = {
  today: {
    ro: { current: 0, target: 5, pct: 0 },
    ovd: { current: 0, target: 5, pct: 0 },
  },
  week: {
    ro: { current: 2, target: 15, pct: 90 },
    ovd: { current: 2, target: 15, pct: 90 },
  },
  month: {
    ro: { current: 32, target: 60, pct: 53 },
    ovd: { current: 30, target: 60, pct: 50 },
  },
};

type StatusTone = "green" | "amber" | "red";

interface SbgItem {
  number: string;
  followUp: string;
}

interface PenaksirActivity {
  id: string;
  sbg: string;
  name: string;
  date: string;
  title: string;
  status: string;
  tone: StatusTone;
  extraSbg: SbgItem[];
}

const TONE_CLASS: Record<StatusTone, string> = {
  green: "text-[#008236]",
  amber: "text-amber-700",
  red: "text-[#e7000b]",
};

const WEEK_ACTIVITIES: PenaksirActivity[] = [
  {
    id: "ovd-deal",
    sbg: "1312T1T181817",
    name: "Adam Alis",
    date: "Sabtu, 10/10/2026",
    title: "Follow Up OVD",
    status: "Deal Transaksi",
    tone: "green",
    extraSbg: [
      { number: "001568002500007", followUp: "Follow Up ke-1" },
      { number: "001568002500006", followUp: "Follow Up ke-2" },
      { number: "001568002500005", followUp: "Follow Up ke-1" },
      { number: "001568002500002", followUp: "Follow Up ke-5" },
    ],
  },
  {
    id: "ro-pertimbang",
    sbg: "1312T1T181817",
    name: "Adam Alis",
    date: "Sabtu, 10/10/2026",
    title: "Follow Up RO | Follow up Ke-1",
    status: "Masih Dipertimbangkan",
    tone: "amber",
    extraSbg: [],
  },
  {
    id: "ro-tidak-hubungi",
    sbg: "1312T1T181817",
    name: "Adam Alis",
    date: "Sabtu, 10/10/2026",
    title: "Follow Up RO | Follow up Ke-1",
    status: "Tidak Dapat Dihubungi",
    tone: "red",
    extraSbg: [],
  },
];

const RANGES: Array<{ value: Range; label: string }> = [
  { value: "today", label: "Hari ini" },
  { value: "week", label: "Minggu ini" },
  { value: "month", label: "Bulan ini" },
];

function PenaksirHome() {
  const [range, setRange] = useState<Range>("today");
  const summary = RANGE_SUMMARY[range];
  const activities = range === "today" ? [] : WEEK_ACTIVITIES;

  return (
    <MobileShell hideNav hideFab>
      <header
        className="relative h-[170px] overflow-visible px-4 pt-[56px] text-white"
        style={{ background: "linear-gradient(180deg, #28285f 0%, #4d529d 72%, #7b8bd0 100%)" }}
      >
        <div className="absolute inset-x-6 top-5 flex items-center justify-between text-white">
          <span className="text-[15px] font-semibold tracking-tight">9:41</span>
          <span className="flex items-center gap-1.5">
            <CellSignalFull size={17} weight="bold" />
            <WifiHigh size={18} weight="bold" />
            <PhosphorBatteryFull size={20} weight="bold" />
          </span>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#2953A4]">
              <PhosphorUser size={30} weight="fill" />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] text-white/90">Selamat datang</p>
              <p className="truncate text-[20px] font-bold leading-tight">
                Penaksir Kasir (MAS MONANG-...
              </p>
            </div>
          </div>
          <Link
            to="/notifikasi"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#2953A4]"
            aria-label="Notifikasi"
          >
            <PhosphorBell size={21} weight="regular" />
          </Link>
        </div>

        <div className="absolute left-4 right-4 top-[136px] z-20 rounded-xl bg-white p-3 text-slate-900 shadow-[0_12px_24px_rgba(25,42,77,0.10)]">
          <div className="grid grid-cols-2">
            <div className="border-r border-slate-200 pr-3">
              <p className="flex items-center gap-2 text-[13px] text-slate-500">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e9f1fd] text-[#2953A4]">
                  <ArrowsClockwise size={17} weight="regular" />
                </span>
                Follow Up RO
              </p>
              <p className="mt-2 text-[21px] font-bold leading-tight tracking-tight">
                {HEADER_SUMMARY.ro.current}
                <span className="font-normal text-slate-400">/{HEADER_SUMMARY.ro.target}</span>
              </p>
            </div>
            <div className="pl-3">
              <p className="flex items-center gap-2 text-[13px] text-slate-500">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e9f1fd] text-[#2953A4]">
                  <PhosphorFileText size={17} weight="regular" />
                </span>
                Follow Up OVD
              </p>
              <p className="mt-2 text-[21px] font-bold leading-tight tracking-tight">
                {HEADER_SUMMARY.ovd.current}
                <span className="font-normal text-slate-400">/{HEADER_SUMMARY.ovd.target}</span>
              </p>
            </div>
          </div>
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

      <div className="space-y-6 bg-white px-4 pb-32 pt-[72px]">
        <section>
          <h2 className="text-[17px] font-bold text-slate-900">Summary Aktivitas</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            Pantau progres dan pencapaian target aktivitas
          </p>
          <div className="mt-2.5 flex gap-2">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`rounded-full border px-4 py-2 text-[13px] font-medium ${
                  range === r.value
                    ? "border-[#2953A4] bg-[#2953A4] text-white"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <SummaryCard
              icon={<ArrowsClockwise size={17} weight="regular" color="#2953A4" />}
              label="Follow Up RO"
              current={summary.ro.current}
              target={summary.ro.target}
              pct={summary.ro.pct}
            />
            <SummaryCard
              icon={<PhosphorFileText size={17} weight="regular" color="#2953A4" />}
              label="Follow Up OVD"
              current={summary.ovd.current}
              target={summary.ovd.target}
              pct={summary.ovd.pct}
            />
          </div>
        </section>

        <section>
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-slate-900">Aktivitas Hari Ini</h2>
            <Link
              to="/aktivitas"
              className="inline-flex items-center gap-0.5 text-[13px] font-medium text-slate-500"
            >
              Lihat Semua <CaretRight size={17} weight="regular" />
            </Link>
          </div>
          {activities.length === 0 ? (
            <>
              <div className="py-6 text-center">
                <img
                  src="/empty-activity.svg"
                  alt=""
                  className="mx-auto h-28 w-40 object-contain"
                />
                <p className="mt-4 text-[17px] font-bold text-slate-900">
                  Belum Ada Aktivitas Hari Ini
                </p>
                <p className="mt-1 text-[13px] text-slate-500">
                  Aktivitas yang tersedia akan muncul disini
                </p>
              </div>
              <div className="mt-3 flex justify-center">
                <Link
                  to="/penaksir-aktivitas/buat"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#2953A4] bg-white px-4 py-2 text-[14px] font-medium text-[#2953A4] transition-transform duration-100 active:scale-[0.98]"
                >
                  <PhosphorPlus size={20} weight="regular" /> Tambah Aktivitas
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {activities.map((a) => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </div>
          )}
        </section>
      </div>

      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 border-t border-slate-200 bg-white">
        <ul className="grid grid-cols-3 px-2 pb-4 pt-2">
          <li className="flex justify-center">
            <span className="flex w-full flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium text-[#2953A4]">
              <House size={23} weight="regular" />
              <span>Home</span>
            </span>
          </li>
          <li className="flex justify-center">
            <Link
              to="/aktivitas"
              className="flex w-full flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium text-slate-400"
            >
              <ClipboardText size={23} weight="regular" />
              <span>Aktivitas</span>
            </Link>
          </li>
          <li className="flex justify-center">
            <Link
              to="/profile"
              className="flex w-full flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium text-slate-400"
            >
              <PhosphorUser size={23} weight="regular" />
              <span>Profil</span>
            </Link>
          </li>
        </ul>
      </nav>
    </MobileShell>
  );
}

function SummaryCard({
  icon,
  label,
  current,
  target,
  pct,
}: {
  icon: React.ReactNode;
  label: string;
  current: number;
  target: number;
  pct: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
      <p className="flex items-center gap-1.5 text-[14px] text-slate-700">
        {icon} {label}
      </p>
      <p className="mt-1.5 truncate text-[18px] font-bold text-slate-900">
        {current}
        <span className="text-[13px] font-normal text-slate-400">/{target}</span>
      </p>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[#2953A4]" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[12px] text-slate-500">{pct}%</span>
      </div>
    </div>
  );
}

function ActivityCard({ activity }: { activity: PenaksirActivity }) {
  const [open, setOpen] = useState(false);
  const hasExtra = activity.extraSbg.length > 0;
  const showWhatsapp = !hasExtra || !open;
  const showVisit = hasExtra && open;
  const showPhoto = !hasExtra || open;
  const detailsId = `sbg-details-${activity.id}`;

  return (
    <div className="overflow-hidden rounded-lg border border-[#e2e8f0] bg-[#eff6ff]">
      <p className="flex items-center gap-2 px-3 py-3 text-[13px] font-medium text-slate-900">
        <UserSquare size={20} weight="regular" color={PRIMARY} />
        {activity.sbg}
      </p>
      <div className="rounded-lg border border-[#e2e8f0] bg-white p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[14px] text-[#45556c]">{activity.name}</p>
          <p className="shrink-0 text-[12px] text-[#45556c]">{activity.date}</p>
        </div>
        <div className="my-3 border-t border-[#eeeeee]" />
        <p className="text-[16px] font-medium leading-snug text-[#131324]">{activity.title}</p>
        <p className={`mt-1 text-[14px] ${TONE_CLASS[activity.tone]}`}>{activity.status}</p>

        {hasExtra && !open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls={detailsId}
            className="mt-2.5 flex w-full items-center justify-between py-1 text-left text-[12px] text-[#62748e]"
          >
            <span>+{activity.extraSbg.length} Nomor SBG Lainnya</span>
            <CaretDown size={16} weight="regular" color="#62748e" />
          </button>
        )}
        {hasExtra && open && (
          <div id={detailsId} className="mt-3 rounded-lg bg-[#eff6ff] p-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-expanded={open}
              aria-controls={detailsId}
              className="flex w-full items-center justify-between py-1 text-left text-[12px] text-[#62748e]"
            >
              <span>+{activity.extraSbg.length} Nomor SBG Lainnya</span>
              <CaretDown size={16} weight="regular" color="#62748e" className="rotate-180" />
            </button>
            <ul className="mt-1 space-y-2 pb-1 pt-1">
              {activity.extraSbg.map((item, index) => (
                <li key={item.number} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-medium text-[#131324]">
                    {index + 1}
                  </span>
                  <span className="text-[12px] text-[#45556c]">
                    {item.number} - {item.followUp}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showWhatsapp && (
          <button
            type="button"
            aria-label="Hubungi nasabah melalui Whatsapp"
            className="mt-3 flex w-full items-center gap-2 rounded-lg border border-[#e2e8f0] p-2 text-left transition-transform duration-100 active:scale-[0.99]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f7fe]">
              <FileImage size={18} weight="regular" color="#62748e" />
            </span>
            <span className="text-[13px] text-[#131324]">Whatsapp</span>
          </button>
        )}
        {showVisit && (
          <button
            type="button"
            aria-label="Kunjungi nasabah"
            className="mt-3 flex w-full items-center gap-2 rounded-lg border border-[#e2e8f0] p-2 text-left transition-transform duration-100 active:scale-[0.99]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f0f7fe]">
              <FileImage size={18} weight="regular" color="#62748e" />
            </span>
            <span className="text-[13px] text-[#131324]">Visit</span>
          </button>
        )}
        {showPhoto && (
          <button
            type="button"
            aria-label="Lihat foto aktivitas"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2953A4] py-3 text-[14px] font-medium text-white transition-transform duration-100 active:scale-[0.99]"
          >
            <PhosphorEye size={20} weight="regular" />
            Lihat Foto
          </button>
        )}
      </div>
    </div>
  );
}
