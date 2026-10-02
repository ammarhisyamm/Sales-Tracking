import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { CameraModal } from "@/components/camera-modal";
import {
  activities,
  fillWaTemplate,
  formatTanggalPanjang,
  getShareCode,
  getShareLink,
  profile,
  STATUS_META,
  WA_TEMPLATES,
  type Contact,
} from "@/lib/mock-data";
import { useLeads } from "@/lib/leads-store";
import { nowHHMM, updateActivity, useActivity } from "@/lib/activity-store";
import { OverlayPortal, ScreenLoader } from "@/components/motion";
import { AktivitasDetailSkeleton } from "@/components/skeletons";
import { toast } from "@/components/motion";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Check,
  Copy,
  Eye,
  Link2,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Share2,
  X,
} from "lucide-react";
import { ClipboardText } from "@phosphor-icons/react";

const PRIMARY = "#2953A4";

export const Route = createFileRoute("/aktivitas/$id")({
  head: () => ({ meta: [{ title: "Detail Aktivitas" }] }),
  component: ActivityDetail,
  notFoundComponent: () => (
    <MobileShell hideNav>
      <div className="flex flex-1 items-center justify-center text-slate-500">Tidak ditemukan</div>
    </MobileShell>
  ),
  loader: ({ params }) => {
    return activities.find((x) => x.id === params.id) ?? null;
  },
});

function ActivityDetail() {
  const params = Route.useParams();
  const base = Route.useLoaderData();
  // Aktivitas buatan user hanya ada di store client (localStorage)
  const stored = useActivity(params.id);
  const activity = stored ?? base;
  if (!activity) throw notFound();
  const current = activity;
  const checkedIn = current.status === "checked_in";
  const isDone = current.status === "completed";
  const photoUrl = current.photoUrl;
  const checkInAt = current.checkInTime;
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState<"checkin" | "photo">("photo");

  const leads = useLeads(activity.id, activity.type);

  const [waLead, setWaLead] = useState<Contact | null>(null);

  const meta = STATUS_META[isDone ? "completed" : checkedIn ? "checked_in" : "planned"];
  const startTime = activity.startTime ?? activity.timeRange.split(" - ")[0];

  const checkout = () => {
    const t = nowHHMM();
    updateActivity(activity.id, { status: "completed", checkOutTime: t });
    toast(`Check-out tersimpan · Finished ${t}`);
  };

  const openCamera = (m: "checkin" | "photo") => {
    setCameraMode(m);
    setCameraOpen(true);
  };

  const handleCameraSave = (url: string) => {
    updateActivity(activity.id, {
      photoUrl: url,
      ...(cameraMode === "checkin"
        ? { status: "checked_in" as const, checkInTime: nowHHMM() }
        : {}),
    });
    if (cameraMode === "checkin") toast("Check-in berhasil · selamat bertugas");
    setCameraOpen(false);
  };

  const handleCameraSkip = () => {
    if (cameraMode === "checkin") {
      updateActivity(activity.id, { status: "checked_in", checkInTime: nowHHMM() });
      toast("Check-in berhasil · selamat bertugas");
    }
    setCameraOpen(false);
  };

  return (
    <MobileShell hideNav>
      <div className="bg-background px-5 pb-2 pt-12">
        <Link to="/aktivitas" className="inline-flex items-center gap-2 text-slate-900">
          <ArrowLeft className="h-5 w-5" />
          <span className="text-[17px] font-medium">Detail Aktivitas</span>
        </Link>
      </div>

      <div className="space-y-4 bg-background px-5 pb-8 pt-3">
        <ScreenLoader skeleton={<AktivitasDetailSkeleton />}>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12px] font-medium" style={{ color: PRIMARY }}>
                {formatTanggalPanjang(activity.date, startTime)}
              </p>
              <p className={`flex-shrink-0 text-[12px] font-medium ${meta.className}`}>
                {meta.label}
              </p>
            </div>
            <div className="my-2.5 border-t border-slate-100" />
            <p className="text-[15px] font-bold text-slate-900">{activity.locationName}</p>
            <p className="mt-0.5 text-[13px] text-slate-500">
              {activity.kelurahan ? `${activity.kelurahan}, ` : ""}
              {activity.address}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eef5ff] text-[#607b9d]">
              <ClipboardText size={25} weight="regular" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[17px] font-medium text-slate-900">{activity.type}</p>
            </div>
          </div>

          {current.kind === "digital" ? (
            activity.shareCode ? (
              <ShareLinkCard
                activityId={activity.id}
                shareCode={activity.shareCode}
                views={activity.linkViews ?? 0}
                leadsCount={activity.leadsCount}
              />
            ) : null
          ) : isDone ? (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <Check className="h-7 w-7 text-emerald-600" strokeWidth={3} />
              </span>
              <p className="mt-3 text-[15px] font-semibold text-slate-900">
                Anda Telah Melakukan Checkout
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[12px] text-slate-500">
                Finished {activity.checkOutTime ?? ""}
              </span>
            </div>
          ) : checkedIn ? (
            <>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="relative overflow-hidden rounded-lg bg-slate-100">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Foto lokasi" className="h-52 w-full object-cover" />
                  ) : (
                    <div className="flex h-52 flex-col items-center justify-center gap-2 bg-gradient-to-br from-sky-100 to-slate-200 text-slate-400">
                      <Camera className="h-8 w-8" />
                      <p className="text-[12px]">Belum ada foto lokasi</p>
                    </div>
                  )}
                  <button
                    onClick={() => openCamera("photo")}
                    aria-label="Ambil foto lokasi"
                    className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="-mt-0 flex justify-center">
                  <button
                    onClick={checkout}
                    className="inline-flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-red-500 px-5 py-2 text-[13px] font-semibold text-white shadow-lg shadow-red-500/30 transition-transform duration-100 active:scale-95"
                  >
                    <LogOut className="h-4 w-4" /> Check Out {checkInAt ?? ""}
                  </button>
                </div>
                {!photoUrl && (
                  <button
                    onClick={() => openCamera("photo")}
                    className="-mt-2 w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-[13px] font-medium text-slate-500"
                  >
                    + Tambah foto lokasi
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#2953A4]/10">
                <MapPin className="h-7 w-7 text-amber-500" fill="currentColor" />
              </span>
              <p className="mt-3 text-[14px] font-medium text-slate-700">
                Anda Belum Melakukan Check In
              </p>
              <p className="mx-auto mt-1 max-w-[260px] text-[12px] text-slate-400">
                Siapkan kamera — foto bukti check-in diambil langsung saat ini.
              </p>
              <button
                onClick={() => openCamera("checkin")}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-5 py-2 text-[13px] font-semibold text-white transition-transform duration-100 active:scale-[0.98]"
                style={{ background: PRIMARY }}
              >
                <MapPin className="h-4 w-4" /> Check In
              </button>
            </div>
          )}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-slate-900">
                Detail Leads ({leads.length})
              </h3>
              <Link
                to="/tambah-leads/$activityId"
                params={{ activityId: activity.id }}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] font-medium transition-transform duration-100 active:scale-[0.98]"
                style={{ color: PRIMARY, borderColor: PRIMARY }}
              >
                <Plus className="h-4 w-4" /> Tambah Leads
              </Link>
            </div>
            <div className="space-y-2.5">
              {leads.length === 0 ? (
                <div className="flex flex-col items-center px-4 pb-5 pt-7 text-center">
                  <LeadsEmptyStateIcon />
                  <p className="mt-5 text-[18px] font-semibold text-slate-900">
                    Belum Ada Leads Tercatat
                  </p>
                  <p className="mt-1 text-[14px] text-[#45556c]">
                    Tambahkan leads untuk melengkapi hasil aktivitas.
                  </p>
                </div>
              ) : (
                leads.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-slate-900">{c.name}</p>
                      <p className="mt-0.5 truncate text-[12px] text-slate-500">
                        {c.job ? `${c.job} | ${c.status}` : `${c.status} · ${c.lastContact}`}
                      </p>
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      aria-label={`Telepon ${c.name}`}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#2953A4]/10 transition-transform duration-100 active:scale-90"
                      style={{ color: PRIMARY }}
                    >
                      <Phone className="h-4.5 w-4.5" />
                    </a>
                    <button
                      onClick={() => setWaLead(c)}
                      aria-label={`WhatsApp ${c.name}`}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 transition-transform duration-100 active:scale-90"
                    >
                      <MessageCircle className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </ScreenLoader>
      </div>

      {cameraOpen && (
        <CameraModal
          mode={cameraMode}
          onClose={() => setCameraOpen(false)}
          onSave={handleCameraSave}
          onSkip={handleCameraSkip}
        />
      )}

      {waLead && (
        <WaTemplateSheet
          lead={waLead}
          activityName={activity.locationName}
          activityDate={formatTanggalPanjang(activity.date)}
          coupon={getShareCode(activity)}
          onClose={() => setWaLead(null)}
        />
      )}
    </MobileShell>
  );
}

function LeadsEmptyStateIcon() {
  return (
    <div className="relative flex h-20 w-20 items-center justify-center rounded-lg bg-[#f1f1f1]">
      <CalendarDays className="h-12 w-12 text-[#607b9d]" strokeWidth={2.5} />
      <span className="absolute -bottom-1 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#aebdd0] text-white">
        <X className="h-6 w-6" strokeWidth={3} />
      </span>
    </div>
  );
}

/* ---------------- Template WA ---------------- */

function WaTemplateSheet({
  lead,
  activityName,
  activityDate,
  coupon,
  onClose,
}: {
  lead: Contact;
  activityName: string;
  activityDate: string;
  coupon: string;
  onClose: () => void;
}) {
  const vars = {
    nama_customer: lead.name,
    nama_sales: profile.name,
    nama_event: activityName,
    tanggal_event: activityDate,
    kode_kupon: coupon,
  };
  return (
    <OverlayPortal>
      <div
        className="motion-backdrop-in fixed inset-0 z-50 flex items-end justify-center bg-black/50"
        onClick={onClose}
      >
        <div
          className="motion-sheet-in max-h-[85dvh] w-full max-w-[440px] overflow-y-auto rounded-t-2xl bg-white px-5 pb-6 pt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-[15px] font-bold text-slate-900">Pilih Template WA</h4>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="rounded-full p-1 text-slate-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2.5">
            {WA_TEMPLATES.map((t) => {
              const text = fillWaTemplate(t.body, vars);
              const href = `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
              return (
                <a
                  key={t.id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl bg-slate-900 p-3.5 text-white"
                >
                  <p className="mb-1.5 text-[13px] font-semibold text-amber-300">{t.title}</p>
                  <p className="whitespace-pre-line text-[12px] leading-relaxed text-slate-200">
                    {text.length > 220 ? text.slice(0, 220) + "…" : text}
                  </p>
                  <span
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white"
                    style={{ background: PRIMARY }}
                  >
                    <Share2 className="h-3.5 w-3.5" /> Kirim via WhatsApp
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}

/* ---------------- Share link (online) ---------------- */

function ShareLinkCard({
  activityId,
  shareCode,
  views,
  leadsCount,
}: {
  activityId: string;
  shareCode?: string;
  views: number;
  leadsCount: number;
}) {
  const [copied, setCopied] = useState(false);
  const link = getShareLink({ id: activityId, shareCode } as { id: string; shareCode?: string });
  // getShareLink sudah absolut di client — jangan tambah origin lagi
  const fullLink = link;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
    } catch {
      /* abaikan */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const waText = encodeURIComponent(
    `Halo! Isi data di link ini ya biar kami bisa bantu pengajuan gadai emasnya:\n${fullLink}`,
  );

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
          <Link2 className="h-4 w-4" style={{ color: PRIMARY }} /> Link Pendaftaran Nasabah
        </p>
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-600">
          Aktif
        </span>
      </div>
      <p className="-mt-1 text-[12px] leading-relaxed text-slate-500">
        Aktivitas sedang berjalan — bagikan link ini ke nasabah. Mereka isi data sendiri, otomatis
        tercatat sebagai leads.
      </p>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
        <p className="flex-1 truncate text-[12px] text-slate-600">{fullLink}</p>
        <button
          onClick={copy}
          className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-semibold text-white"
          style={{ background: PRIMARY }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Tersalin" : "Salin"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg bg-slate-50 p-2.5">
          <p className="inline-flex items-center gap-1 text-[18px] font-bold text-slate-900">
            <Eye className="h-4 w-4 text-slate-400" />
            {views}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Dilihat</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2.5">
          <p className="text-[18px] font-bold text-slate-900">{leadsCount}</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">Mengisi</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-100 py-2.5 text-[13px] font-semibold text-green-700"
        >
          <Share2 className="h-4 w-4" /> Bagikan WA
        </a>
        <Link
          to="/isi/$id"
          params={{ id: activityId }}
          search={{ k: shareCode ?? "" }}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2953A4]/10 py-2.5 text-[13px] font-semibold"
          style={{ color: PRIMARY }}
        >
          <Eye className="h-4 w-4" /> Lihat Formulir
        </Link>
      </div>
    </div>
  );
}
