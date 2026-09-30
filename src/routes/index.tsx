import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { CameraModal } from "@/components/camera-modal";
import { ActivityKindBadge } from "@/components/activity-kind-badge";
import {
  formatTanggalPanjang,
  profile,
  programs,
  targets,
  type ActivityStatus,
} from "@/lib/mock-data";
import { nowHHMM, updateActivity, useActivities } from "@/lib/activity-store";
import { ScreenLoader } from "@/components/motion";
import { HomeSkeleton } from "@/components/skeletons";
import { toast } from "@/components/motion";
import { useState } from "react";
import {
  BatteryFull,
  Bell,
  CalendarX,
  CaretRight,
  CellSignalFull,
  CheckCircle,
  ClipboardText,
  Crosshair,
  EnvelopeSimple,
  MapPin,
  Money,
  Plus,
  Scales,
  SignOut,
  User,
  Wallet,
  WifiHigh,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Beranda — Sales Tracking" }] }),
  component: Home,
});

const PRIMARY = "#2953A4";
const rp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
    .format(n)
    .replace(/\s/g, "");

type Range = "today" | "week" | "month";

function Home() {
  const [range, setRange] = useState<Range>("today");
  const [checkinId, setCheckinId] = useState<string | null>(null);

  const confirmCheckin = (url?: string) => {
    if (checkinId) {
      updateActivity(checkinId, {
        status: "checked_in",
        checkInTime: nowHHMM(),
        ...(url ? { photoUrl: url } : {}),
      });
      toast("Check-in berhasil · selamat bertugas");
    }
    setCheckinId(null);
  };

  const allActivities = useActivities();
  const todayActivities = allActivities.filter(
    (a) => new Date(a.date).toDateString() === new Date().toDateString(),
  );
  const ongoingProgram = programs.find((p) => p.status === "Berlangsung");

  const lead = targets.leads[range];
  const closing = targets.closingLeads[range];
  const ado = targets.ado[range];
  const grams = targets.grams[range];

  return (
    <MobileShell hideFab>
      <header
        className="relative h-[170px] overflow-visible px-4 pt-[56px] text-white"
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
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#2953A4]">
              <User size={31} weight="fill" />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] leading-4 text-white/90">Selamat datang</p>
              <p className="truncate text-[20px] font-bold leading-5">Sales Gadai Mas</p>
            </div>
          </div>
          <Link
            to="/notifikasi"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#2953A4]"
          >
            <Bell size={22} weight="regular" />
          </Link>
        </div>

        <div className="absolute left-[clamp(16px,5vw,20px)] right-[clamp(16px,5vw,20px)] top-[120px] z-20 text-slate-900">
          <div className="rounded-t-2xl bg-white px-[clamp(12px,4vw,16px)] pb-2 pt-2 shadow-[0_10px_24px_rgba(25,42,77,0.08)]">
            <div className="grid grid-cols-2">
              <div className="min-w-0 overflow-hidden border-r border-slate-200 pr-[clamp(10px,3vw,12px)]">
                <p className="flex min-w-0 items-center gap-1.5 text-[clamp(12px,3.5vw,14px)] leading-4 text-slate-500">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#e9f1fd] text-[#2953A4]">
                    <Wallet size={17} weight="regular" />
                  </span>
                  Booking (Amount)
                </p>
                <p className="mt-1 whitespace-nowrap text-[clamp(17px,5vw,20px)] font-bold leading-tight tracking-tight">
                  {rp(profile.booking)} <span className="font-normal text-slate-400">/</span>
                </p>
                <p className="text-[clamp(13px,3.5vw,15px)] text-slate-400">
                  {rp(profile.bookingEstimate)}
                </p>
              </div>
              <div className="min-w-0 overflow-hidden pl-[clamp(10px,3vw,12px)]">
                <p className="flex min-w-0 items-center gap-1.5 text-[clamp(12px,3.5vw,14px)] leading-4 text-slate-500">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#e9f1fd] text-[#2953A4]">
                    <Scales size={18} weight="regular" />
                  </span>
                  <span className="truncate">Gram (New CIF)</span>
                </p>
                <p className="mt-1 whitespace-nowrap text-[clamp(17px,5vw,20px)] font-bold leading-tight tracking-tight">
                  {grams.current}g{" "}
                  <span className="font-normal text-slate-400">/ {grams.target}g</span>
                </p>
              </div>
            </div>
            <div className="mt-2 border-t border-slate-200 pt-2">
              <p className="flex items-center gap-1.5 text-[clamp(12px,3.5vw,14px)] text-slate-500">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#e9f1fd] text-[#2953A4]">
                  <Money size={17} weight="regular" />
                </span>
                Estimasi Insentif
              </p>
              <p className="mt-1 text-[clamp(18px,5vw,21px)] font-bold leading-tight tracking-tight">
                {rp(profile.estimasiInsentif)}
              </p>
            </div>
          </div>
          <div className="rounded-b-2xl bg-[#eff5fb] px-[clamp(12px,4vw,16px)] py-1.5">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-[clamp(12px,3.5vw,14px)] text-slate-500">
                <EnvelopeSimple size={19} weight="regular" color={PRIMARY} /> ADO
              </p>
              <p className="min-w-0 truncate text-right text-[clamp(14px,4vw,17px)] font-bold">
                {rp(ado.current)}
                <span className="font-normal text-slate-400">/{rp(ado.target)}</span>
              </p>
            </div>
          </div>
        </div>

        <svg
          className="pointer-events-none absolute bottom-0 left-0 h-[70px] w-full"
          viewBox="0 0 440 70"
          preserveAspectRatio="none"
        >
          <path d="M0,38 C110,72 230,72 440,14 L440,70 L0,70 Z" fill="#8fa3d9" opacity="0.5" />
          <path d="M0,48 C130,78 260,76 440,28 L440,70 L0,70 Z" fill="#c3d0f0" opacity="0.75" />
          <path d="M0,56 C140,82 280,80 440,40 L440,70 L0,70 Z" fill="#eef2fd" />
        </svg>
      </header>

      <div className="space-y-6 bg-white px-4 pb-28 pt-[170px]">
        <ScreenLoader skeleton={<HomeSkeleton />}>
          <section>
            <h2 className="text-[18px] font-semibold text-slate-900">Target Leads dan Closing</h2>
            <div className="mt-3 flex gap-2">
              {(
                [
                  ["today", "Hari ini"],
                  ["week", "Minggu ini"],
                  ["month", "Bulan ini"],
                ] as const
              ).map(([r, label]) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`h-9 whitespace-nowrap rounded-full border px-3 text-[13px] font-medium ${
                    range === r
                      ? "border-[#2953A4] bg-[#2953A4] text-white"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <TargetCard
                icon={<Crosshair size={19} weight="regular" color={PRIMARY} />}
                label="Leads"
                current={lead.current}
                target={lead.target}
              />
              <TargetCard
                icon={<User size={19} weight="regular" color={PRIMARY} />}
                label="Closing Leads"
                current={closing.current}
                target={closing.target}
              />
            </div>
          </section>

          <section>
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-slate-900">Program Berlangsung</h2>
              <Link
                to="/program"
                className="inline-flex items-center gap-0.5 text-[14px] font-medium text-slate-500"
              >
                Lihat Semua <CaretRight size={18} weight="regular" />
              </Link>
            </div>
            {ongoingProgram ? (
              <Link
                to="/program"
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(25,42,77,0.05)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold" style={{ color: PRIMARY }}>
                    {formatTanggalPanjang(ongoingProgram.date)}
                  </p>
                  <CaretRight size={21} weight="regular" color={PRIMARY} />
                </div>
                <p className="mt-1 text-[17px] font-bold text-slate-900">{ongoingProgram.name}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Crosshair size={18} weight="regular" color={PRIMARY} />
                    {ongoingProgram.currentLeads}/{ongoingProgram.targetLeads} Leads
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={18} weight="regular" color={PRIMARY} />
                    {ongoingProgram.location}
                  </span>
                </div>
              </Link>
            ) : (
              <EmptyState
                icon={<CalendarX size={48} weight="regular" color="#94a3b8" />}
                title="Belum Ada Program Berlangsung"
                desc="Program yang tersedia akan muncul disini"
              />
            )}
          </section>

          <section>
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-slate-900">Aktivitas Hari Ini</h2>
              <Link
                to="/aktivitas"
                className="inline-flex items-center gap-0.5 text-[14px] font-medium text-slate-500"
              >
                Lihat Semua <CaretRight size={18} weight="regular" />
              </Link>
            </div>
            {todayActivities.length === 0 ? (
              <>
                <EmptyState
                  icon={<ClipboardText size={48} weight="regular" color="#94a3b8" />}
                  title="Belum Ada Aktivitas Hari ini"
                  desc="Aktivitas yang tersedia akan muncul disini"
                />
                <div className="mt-3 flex justify-center">
                  <TambahButton />
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {todayActivities.map((a) => {
                  const status = a.status;
                  return (
                    <div
                      key={a.id}
                      className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_2px_8px_rgba(25,42,77,0.04)]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] text-slate-500">
                          {a.startTime ?? a.timeRange.split(" - ")[0]} WIB
                        </p>
                        <StatusText status={status} />
                      </div>
                      <div className="my-2.5 border-t border-slate-100" />
                      <Link
                        to="/aktivitas/$id"
                        params={{ id: a.id }}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[16px] font-bold text-slate-900">
                            {a.locationName}
                          </p>
                          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                            <p className="min-w-0 truncate text-[13px] text-slate-500">
                              {a.address}
                            </p>
                            <ActivityKindBadge kind={a.kind} />
                          </div>
                        </div>
                        <CaretRight size={22} weight="regular" color={PRIMARY} />
                      </Link>
                      <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5">
                        <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-500">
                          <Crosshair size={18} weight="regular" color={PRIMARY} />
                          {a.leadsCount} Leads
                        </span>
                        {status === "completed" ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-[12px] font-medium text-slate-500">
                            <CheckCircle size={16} weight="regular" /> Finished{" "}
                            {a.checkOutTime ?? ""}
                          </span>
                        ) : status === "checked_in" ? (
                          <button
                            onClick={() => {
                              const t = nowHHMM();
                              updateActivity(a.id, { status: "completed", checkOutTime: t });
                              toast(`Check-out tersimpan · Finished ${t}`);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3.5 py-2 text-[12px] font-semibold text-white transition-transform duration-100 active:scale-[0.98]"
                          >
                            <SignOut size={16} weight="regular" /> Check Out {a.checkInTime ?? ""}
                          </button>
                        ) : (
                          <button
                            onClick={() => setCheckinId(a.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2953A4] px-4 py-2 text-[12px] font-semibold text-white transition-transform duration-100 active:scale-[0.98]"
                          >
                            <MapPin size={16} weight="regular" /> Check In
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-center pt-1">
                  <TambahButton />
                </div>
              </div>
            )}
          </section>
        </ScreenLoader>
      </div>

      {checkinId && (
        <CameraModal
          mode="checkin"
          onClose={() => setCheckinId(null)}
          onSave={confirmCheckin}
          onSkip={confirmCheckin}
        />
      )}
    </MobileShell>
  );
}

function TargetCard({
  icon,
  label,
  hint,
  current,
  target,
  format = String,
}: {
  icon: ReactNode;
  label: string;
  hint?: string;
  current: number;
  target: number;
  format?: (value: number) => string;
}) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-[0_2px_8px_rgba(25,42,77,0.03)]">
      <p className="flex items-center gap-2 text-[16px] text-[#29225f]">
        {icon} {label}
        {hint && <span className="text-[10px] text-slate-400">({hint})</span>}
      </p>
      <p className="mt-2 truncate text-[24px] font-bold leading-none text-slate-900">
        {format(current)}
        <span className="text-[17px] font-normal text-slate-400">/{format(target)}</span>
      </p>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="motion-bar-grow h-full rounded-full bg-[#2953A4]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[14px] text-slate-700">{pct}%</span>
      </div>
    </div>
  );
}

function StatusText({ status }: { status: ActivityStatus }) {
  if (status === "completed") return <span className="text-[13px] text-slate-400">Berakhir</span>;
  if (status === "checked_in")
    return <span className="text-[13px] font-medium text-green-500">Berjalan</span>;
  return <span className="text-[13px] font-medium text-amber-500">Segera</span>;
}

function EmptyState({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
  return (
    <div className="py-6 text-center">
      <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100">
        {icon}
      </span>
      <p className="mt-4 text-[17px] font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-[13px] text-slate-500">{desc}</p>
    </div>
  );
}

function TambahButton() {
  return (
    <Link
      to="/aktivitas/buat"
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#2953A4] bg-white px-4 py-2 text-[14px] font-medium text-[#2953A4] transition-transform duration-100 active:scale-[0.98]"
    >
      <Plus className="h-4 w-4" /> Tambah Aktivitas
    </Link>
  );
}
