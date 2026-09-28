import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { OverlayPortal, ScreenLoader } from "@/components/motion";
import { KontakSkeleton } from "@/components/skeletons";
import { contacts, shortLocation } from "@/lib/mock-data";
import { Check, MapPin, MessageCircle, Phone, Search, Ticket, UserRound } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/kontak")({
  head: () => ({ meta: [{ title: "Kontak" }] }),
  component: ContactsPage,
});

const TABS = ["Semua", "Belum Closing", "Closing"] as const;

const STATUS_COLOR: Record<string, string> = {
  Hot: "text-red-500",
  Warm: "text-amber-500",
  Cold: "text-slate-400",
  Closing: "text-green-500",
};

function ContactsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Semua");
  const [q, setQ] = useState("");
  const [voucherFor, setVoucherFor] = useState<string | null>(null);

  const filtered = contacts.filter((c) => {
    if (tab === "Belum Closing" && c.status === "Closing") return false;
    if (tab === "Closing" && c.status !== "Closing") return false;
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const closingCount = contacts.filter((c) => c.status === "Closing").length;

  return (
    <MobileShell hideFab>
      <div className="bg-white px-5 pb-2 pt-12">
        <h1 className="text-[22px] font-bold text-slate-900">Kontak</h1>
      </div>

      <div className="space-y-4 bg-white px-5 pb-8 pt-3">
        <div className="rounded-xl border border-slate-200 p-2">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2.5">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama kontak"
              className="flex-1 bg-transparent text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
            />
            <Search className="h-4.5 w-4.5 text-slate-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#2953A4]/10 p-3.5">
            <p className="text-[14px] text-slate-600">Total Kontak</p>
            <p className="mt-1 text-[18px] font-semibold text-slate-900">{contacts.length}</p>
          </div>
          <div className="rounded-xl bg-[#2953A4]/10 p-3.5">
            <p className="text-[14px] text-slate-600">Closing Kontak</p>
            <p className="mt-1 text-[18px] font-semibold text-slate-900">{closingCount}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
                tab === t
                  ? "border-[#2953A4] bg-[#2953A4] text-white"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-3">
        <ScreenLoader skeleton={<KontakSkeleton />}>
          {filtered.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="p-4 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[16px] font-bold text-slate-900">{c.name}</p>
                  <span className={`flex-shrink-0 text-[14px] font-medium ${STATUS_COLOR[c.status] ?? "text-slate-400"}`}>
                    {c.status}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-slate-500">{c.job ?? "-"}</p>

                <div className="mt-3 rounded-lg border border-slate-200 p-3">
                  <p className="flex items-center gap-1.5 text-[13px] text-slate-500">
                    <UserRound className="h-4 w-4" /> Sumber Kontak
                  </p>
                  <p className="mt-1 text-[15px] font-bold text-slate-900">{c.source}</p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${c.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#2953A4]/10 py-2.5 text-[14px] font-medium text-[#2953A4] transition-transform duration-100 active:scale-[0.98]"
                  >
                    <Phone className="h-4 w-4" /> Telepon
                  </a>
                  <a
                    href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-green-50 py-2.5 text-[14px] font-medium text-green-600 transition-transform duration-100 active:scale-[0.98]"
                  >
                    <MessageCircle className="h-4 w-4" /> Whatsapp
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setVoucherFor(c.name)}
                  className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#2953A4] bg-white py-2.5 text-[14px] font-medium text-[#2953A4] transition-transform duration-100 active:scale-[0.98]"
                >
                  <Ticket className="h-4 w-4" /> Generate Voucher
                </button>
              </div>
              <div className="flex items-center gap-1.5 bg-[#2953A4]/10 px-4 py-2.5 text-[13px] font-medium text-[#2953A4]">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{shortLocation(c)}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-400">
              Tidak ada kontak.
            </div>
          )}
        </ScreenLoader>
        </div>
      </div>

      {voucherFor && (
        <OverlayPortal>
          <div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50"
            onClick={() => setVoucherFor(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90dvh] w-full max-w-[440px] overflow-y-auto rounded-t-3xl bg-white px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-10 text-center"
            >
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400">
                  <Check className="h-6 w-6 text-white" strokeWidth={3} />
                </span>
              </span>
              <h2 className="mt-4 text-[20px] font-bold text-slate-900">Voucher berhasil Dikirim</h2>
              <p className="mt-2 text-[14px] text-slate-500">
                Voucher telah berhasil dikirim ke {voucherFor}.
              </p>
              <button
                type="button"
                onClick={() => setVoucherFor(null)}
                className="mt-6 w-full rounded-xl bg-[#2953A4] py-3.5 text-[15px] font-semibold text-white transition-transform duration-100 active:scale-[0.98]"
              >
                Selesai
              </button>
            </div>
          </div>
        </OverlayPortal>
      )}
    </MobileShell>
  );
}
