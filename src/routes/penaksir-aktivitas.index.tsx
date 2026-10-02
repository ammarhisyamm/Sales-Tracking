import { createFileRoute, Link } from "@tanstack/react-router";
import { CaretDown, Plus } from "@phosphor-icons/react";
import { useState } from "react";
import { MobileShell } from "@/components/mobile-shell";
import { ActivityCard, WEEK_ACTIVITIES } from "@/routes/penaksir";

export const Route = createFileRoute("/penaksir-aktivitas/")({
  head: () => ({ meta: [{ title: "Aktivitas Penaksir" }] }),
  component: PenaksirActivityList,
});

const PERIODS = [
  { value: "today", label: "Hari Ini" },
  { value: "week", label: "Minggu Ini" },
  { value: "month", label: "Bulan Ini" },
  { value: "custom", label: "Custom" },
] as const;

type Period = (typeof PERIODS)[number]["value"];

function PenaksirActivityList() {
  const [period, setPeriod] = useState<Period>("today");
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-01-01");
  const activities = period === "today" ? [] : WEEK_ACTIVITIES;

  return (
    <MobileShell role="penaksir" hideFab>
      <div className="bg-background px-5 pb-2 pt-12">
        <h1 className="text-[22px] font-bold text-slate-900">Aktivitas</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Kelola dan pantau semua kegiatan penaksir
        </p>
      </div>

      <div className="space-y-4 bg-background px-5 pb-8">
        <div className="flex gap-2 overflow-x-auto pb-1 pt-3">
          {PERIODS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setPeriod(item.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                period === item.value
                  ? "border-[#2953A4] bg-[#2953A4] text-white"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {period === "custom" && (
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#eaf2fc] p-3">
            <DateFilter label="Dari Tanggal" value={from} onChange={setFrom} />
            <DateFilter label="Ke Tanggal" value={to} onChange={setTo} />
          </div>
        )}

        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <img
              src="/empty-activity.svg"
              alt=""
              className="mx-auto h-28 w-40 object-contain"
            />
            <p className="mt-4 text-[17px] font-bold text-slate-900">
              Belum Ada Aktivitas Penaksir Kasir
            </p>
            <p className="mt-1 text-[13px] text-slate-500">
              Aktivitas yang tersedia akan muncul disini
            </p>
          </div>
        )}

        <div className="flex justify-center pt-1">
          <Link
            to="/penaksir-aktivitas/buat"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#2953A4] bg-white px-4 py-2 text-[14px] font-medium text-[#2953A4] transition-transform duration-100 active:scale-[0.98]"
          >
            <Plus size={18} weight="regular" /> Tambah Aktivitas
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

function DateFilter({
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
      <span className="mb-1 block text-[13px] text-slate-700">{label}</span>
      <span className="relative block">
        <input
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-[13px] text-slate-800 outline-none"
        />
        <CaretDown
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </span>
    </label>
  );
}
