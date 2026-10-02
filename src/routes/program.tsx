import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { ScreenLoader } from "@/components/motion";
import { ProgramSkeleton } from "@/components/skeletons";
import { profile, programHero } from "@/lib/mock-data";
import { Crosshair, ReceiptText } from "lucide-react";

export const Route = createFileRoute("/program")({
  head: () => ({ meta: [{ title: "Program" }] }),
  component: ProgramPage,
});

const METRIC_ICONS = [ReceiptText, Crosshair] as const;

function ProgramPage() {
  const hero = programHero;

  return (
    <MobileShell hideFab>
      <div className="bg-white px-5 pb-2 pt-12">
        <h1 className="text-[22px] font-bold text-slate-900">Program</h1>
      </div>

      <div
        className="px-5 pb-3 pt-3 text-white"
        style={{
          backgroundImage: "url('/program-banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="text-[24px] font-bold leading-tight">{hero.name}</h2>
        <span className="mt-2 inline-block rounded-full bg-white px-3.5 py-1 text-[13px] font-medium text-slate-900">
          {hero.period}
        </span>
      </div>

      <div className="-mt-0 space-y-4 bg-white px-5 pb-8 pt-4">
        <ScreenLoader skeleton={<ProgramSkeleton />}>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[17px] font-bold text-slate-900">{profile.name}</p>
                <p className="mt-0.5 text-[13px] text-slate-500">{profile.branch}</p>
              </div>
              <p className="text-[32px] font-bold leading-none text-slate-900">#{hero.rank}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#2953A4]/10 p-3.5">
                <p className="text-[14px] text-slate-600">Score</p>
                <p className="mt-1 text-[18px] font-semibold text-slate-900">{hero.score}</p>
              </div>
              <div className="rounded-xl bg-[#2953A4]/10 p-3.5">
                <p className="text-[14px] text-slate-600">Predikat</p>
                <p className="mt-1 text-[18px] font-semibold text-slate-900">{hero.predikat}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[17px] font-bold text-slate-900">Progress program</p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
              Fokus metrik utama yang dihitung untuk ranking nasional.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {hero.metrics.map((m, i) => {
                const Icon = METRIC_ICONS[i % METRIC_ICONS.length];
                return (
                  <div key={m.label} className="rounded-xl border border-slate-200 p-3.5">
                    <p className="flex items-center gap-1.5 text-[15px] font-bold text-slate-900">
                      <Icon className="h-4 w-4" /> {m.label}
                    </p>
                    <p className="mt-0.5 text-[12px] text-slate-500">{m.desc}</p>
                    <p className="mt-2 text-[34px] font-bold leading-none text-slate-900">
                      {m.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[13px] text-slate-500">Leaderboard Nasional</p>
            <p className="mt-0.5 text-[17px] font-bold text-slate-900">10 Peringkat Teratas</p>
            <div className="mt-3 space-y-2.5">
              {hero.leaderboard.map((e) => (
                <div
                  key={e.rank}
                  className={`flex items-center gap-2.5 rounded-xl border p-3 ${
                    e.isSelf ? "border-amber-400 bg-amber-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="w-7 flex-shrink-0 text-[13px] text-slate-500">#{e.rank}</span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[14px] font-bold text-slate-900">
                      <span className="truncate">{e.name}</span>
                      {e.isSelf && (
                        <span className="flex-shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-white">
                          Saya
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-slate-500">
                      {e.branch} | {e.company}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-[16px] font-bold text-slate-900">{e.score}</p>
                    <p className="text-[12px] text-slate-500">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScreenLoader>
      </div>
    </MobileShell>
  );
}
