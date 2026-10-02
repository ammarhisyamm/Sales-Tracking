import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { Spinner, useMinBusy } from "@/components/motion";
import {
  activities,
  formatTanggalPanjang,
  KELURAHAN_WILAYAH,
  PEKERJAAN_PROMAS,
  shortLocation,
} from "@/lib/mock-data";
import { useActivity } from "@/lib/activity-store";
import { addLead } from "@/lib/leads-store";
import { useState } from "react";
import { ChevronRight, Clock3, MapPin, ScanSearch, ShieldCheck, X } from "lucide-react";

const KELURAHAN = Object.keys(KELURAHAN_WILAYAH);
const PRIMARY = "#2953A4";

export const Route = createFileRoute("/isi/$id")({
  head: () => ({ meta: [{ title: "Formulir Pendaftaran — Gadai Mas" }] }),
  component: PublicLeadForm,
  validateSearch: (s: Record<string, unknown>) => ({ k: (s.k as string) ?? "" }),
  loader: ({ params }) => {
    return activities.find((x) => x.id === params.id) ?? null;
  },
});

function PublicLeadForm() {
  const navigate = useNavigate();
  const params = Route.useParams();
  const base = Route.useLoaderData();
  const fromStore = useActivity(params.id);
  const activity = fromStore ?? base;
  if (!activity) throw notFound();
  // `activity` sudah realtime dari store (localStorage) — ikut check-in sales.
  // SSR: fallback data statis. Nasabah selalu dapat snapshot statis.
  const effective = activity;
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [job, setJob] = useState("");
  const [done, setDone] = useState(false);

  const valid = name.trim() && gender && phone.trim() && kelurahan && job;
  const [busy, runSubmit] = useMinBusy();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || busy) return;
    runSubmit(() => {
      addLead(activity.id, activity.type, {
        id: `c-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        status: "Warm",
        source: activity.type,
        lastContact: "Baru saja",
        hasGold: false,
        interested: true,
        gender: gender as "Laki-Laki" | "Perempuan",
        address: address.trim() || undefined,
        kelurahan,
        wilayah: KELURAHAN_WILAYAH[kelurahan],
        job,
      });
      setDone(true);
    });
  };

  if (activity.kind !== "digital") {
    return (
      <MobileShell hideNav>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
          <ClosedIcon />
          <h1 className="mt-8 text-2xl font-bold text-slate-900">Pendaftaran Telah Ditutup</h1>
          <p className="mt-2 text-sm text-slate-500">
            Link pendaftaran untuk aktivitas ini sudah tidak dapat digunakan.
          </p>
        </div>
      </MobileShell>
    );
  }

  if (effective.status === "planned") {
    return (
      <MobileShell hideNav>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2953A4]/10 text-[#2953A4]">
            <Clock3 className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-lg font-bold text-slate-900">Link Belum Aktif</h1>
          <p className="mt-2 text-sm text-slate-500">
            Aktivitas <b>{activity.locationName}</b> ({formatTanggalPanjang(activity.date)}) belum
            berjalan. Link ini aktif setelah sales check-in di lokasi.
          </p>
        </div>
      </MobileShell>
    );
  }

  if (effective.status === "completed") {
    return (
      <MobileShell hideNav>
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-8 text-center">
          <ClosedIcon />
          <h1 className="mt-8 text-2xl font-bold text-slate-900">Pendaftaran Telah Ditutup</h1>
          <p className="mt-2 text-sm text-slate-500">
            Link pendaftaran untuk aktivitas ini sudah tidak dapat digunakan.
          </p>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell hideNav>
      <div
        className="px-5 pb-8 pt-12 text-white"
        style={{
          backgroundImage: "url('/program-banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-[26px] font-bold leading-tight">Formulir Pendaftaran</h1>
        <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-900">
          <MapPin className="h-4 w-4" />
          {shortLocation(activity)}
        </span>
      </div>

      <form onSubmit={submit} className="space-y-4 bg-white px-5 py-5">
        <div>
          <Label>Nama Calon Nasabah</Label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan Nama Lengkap"
            className={inputCls}
          />
        </div>

        <div>
          <Label>Jenis Kelamin</Label>
          <span className="relative block">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={`${inputCls} appearance-none ${!gender ? "text-slate-400" : ""}`}
            >
              <option value="" disabled>
                Pilih Jenis Kelamin
              </option>
              <option value="Laki-Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
          </span>
        </div>

        <div>
          <Label>Nomor Telepon</Label>
          <input
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Masukkan Nomor Telepon"
            className={inputCls}
          />
        </div>

        <div>
          <Label>Alamat</Label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Masukkan alamat"
            className={inputCls}
          />
        </div>

        <div>
          <Label>Kelurahan</Label>
          <span className="relative block">
            <select
              value={kelurahan}
              onChange={(e) => setKelurahan(e.target.value)}
              className={`${inputCls} appearance-none ${!kelurahan ? "text-slate-400" : ""}`}
            >
              <option value="" disabled>
                Pilih Kelurahan
              </option>
              {KELURAHAN.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </span>
        </div>

        <div>
          <Label>Kecamatan, Kabupaten, Provinsi, Kode Pos</Label>
          <input
            value={kelurahan ? (KELURAHAN_WILAYAH[kelurahan] ?? "") : ""}
            readOnly
            className={`${inputCls} bg-slate-50 text-slate-500`}
          />
        </div>

        <div>
          <Label>Pekerjaan Nasabah</Label>
          <span className="relative block">
            <select
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className={`${inputCls} appearance-none ${!job ? "text-slate-400" : ""}`}
            >
              <option value="" disabled>
                Masukkan Pekerjaan Nasabah
              </option>
              {PEKERJAAN_PROMAS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
          </span>
        </div>

        <button
          type="submit"
          disabled={!valid || busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-[15px] font-semibold text-white disabled:bg-slate-100 disabled:text-slate-400"
          style={valid && !busy ? { background: PRIMARY } : undefined}
        >
          {busy && <Spinner className="h-4 w-4" />}
          {busy ? "Mengirim…" : "Simpan Data"}
        </button>
        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" /> Data aman, hanya untuk pengajuan gadai.
        </p>
      </form>

      {done && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-[353px] rounded-xl bg-white px-4 pb-4 pt-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef2ff]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffd43d] text-4xl font-bold leading-none text-white shadow-[inset_0_-3px_0_#f5a623]">
                ✓
              </span>
            </div>
            <h2 className="mt-5 text-2xl font-bold text-slate-950">Data Anda berhasil Dikirim</h2>
            <p className="mx-auto mt-2 max-w-sm text-base leading-6 text-slate-600">
              Data Anda telah tersimpan dan akan diproses lebih lanjut.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/aktivitas" })}
              className="mt-8 w-full rounded-xl bg-[#315bac] py-3.5 text-lg font-semibold text-white"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[14px] text-slate-800">{children}</label>;
}

function ClosedIcon() {
  return (
    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#d4d4d4] text-white">
      <ScanSearch className="h-14 w-14 stroke-[2.5]" />
      <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#aeb0b8]">
        <X className="h-5 w-5 stroke-[3]" />
      </span>
    </div>
  );
}
