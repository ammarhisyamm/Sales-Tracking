import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { CameraModal } from "@/components/camera-modal";
import { OverlayPortal, Spinner, useMinBusy } from "@/components/motion";
import { createActivity } from "@/lib/activity-store";
import { inputDateToLocalIso, todayInputDate } from "@/lib/date-utils";
import { KELURAHAN_WILAYAH, type Activity, type ActivityType } from "@/lib/mock-data";

export const Route = createFileRoute("/kacab-aktivitas/buat")({
  head: () => ({ meta: [{ title: "Tambah Aktivitas KACAB" }] }),
  component: CreateKacabActivity,
});

const ACTIVITIES: ActivityType[] = ["Sosialisasi", "Video Konten Promosi", "Market Sore/Malam"];
const KELURAHAN_OPTIONS = Object.keys(KELURAHAN_WILAYAH);
type Picker = "activity" | "kelurahan" | null;

function CreateKacabActivity() {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [ptm, setPtm] = useState<"Dalam PTM" | "Luar PTM" | "">("");
  const [date] = useState(todayInputDate);
  const [locationName, setLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [targetLeads, setTargetLeads] = useState("5");
  const [photoName, setPhotoName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [picker, setPicker] = useState<Picker>(null);
  const [kelurahanSearch, setKelurahanSearch] = useState("");
  const [created, setCreated] = useState<Activity | null>(null);
  const [busy, runSave] = useMinBusy();

  const filteredKelurahan = useMemo(
    () =>
      KELURAHAN_OPTIONS.filter((item) =>
        item.toLowerCase().includes(kelurahanSearch.toLowerCase()),
      ),
    [kelurahanSearch],
  );
  const valid =
    selectedTypes.length > 0 &&
    ptm &&
    locationName.trim() &&
    address.trim() &&
    kelurahan &&
    Number(targetLeads) > 0;

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || busy) return;
    runSave(() => {
      const activity = createActivity({
        type: selectedTypes[0],
        activityTypes: selectedTypes,
        kind: "lapangan",
        ptm: ptm as "Dalam PTM" | "Luar PTM",
        locationName: locationName.trim(),
        address: address.trim(),
        kelurahan,
        wilayah: KELURAHAN_WILAYAH[kelurahan],
        date: inputDateToLocalIso(date),
        timeRange: "08:00 - 10:00",
        leadsTarget: Number(targetLeads),
        photoUrl: photoUrl || undefined,
      });
      setCreated(activity);
    });
  };

  return (
    <MobileShell role="kacab" hideNav>
      <header className="bg-background px-5 pb-3 pt-12">
        <button
          onClick={() => navigate({ to: "/kacab-aktivitas" })}
          className="inline-flex items-center gap-2 text-slate-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-[17px] font-medium">Tambah Aktivitas</span>
        </button>
      </header>

      <form onSubmit={save} className="space-y-4 bg-background px-5 pb-8 pt-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900">Tambah Aktivitas Hari Ini</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Isi detail kegiatan aktivitas dan target leads Anda.
          </p>
        </div>

        <Field label="Tanggal Pelaksanaan">
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left text-[14px] text-slate-700 disabled:opacity-100"
          >
            {formatInputDate(date)}
            <CalendarDays className="h-4 w-4 text-slate-500" />
          </button>
        </Field>

        <Field label="Aktivitas">
          <button
            type="button"
            onClick={() => setPicker("activity")}
            className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-[14px] ${selectedTypes.length ? "text-slate-900" : "text-slate-400"}`}
          >
            <span>{selectedTypes[0] || "Pilih Aktivitas"}</span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </Field>

        <Field label="Jenis PTM" hint="Dalam PTM = radius ≤ 5km | Luar PTM > 5km">
          <div className="grid grid-cols-2 gap-2.5">
            {(["Dalam PTM", "Luar PTM"] as const).map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setPtm(value)}
                className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-left text-[14px] ${ptm === value ? "border-[#2953A4] text-slate-800" : "border-slate-200 text-slate-500"}`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${ptm === value ? "border-[#2953A4]" : "border-slate-300"}`}
                >
                  {ptm === value && <span className="h-2.5 w-2.5 rounded-full bg-[#2953A4]" />}
                </span>
                {value}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Nama Lokasi">
          <input
            value={locationName}
            onChange={(event) => setLocationName(event.target.value)}
            placeholder="Masukkan nama lokasi"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
          />
        </Field>

        <Field label="Alamat">
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Masukkan alamat"
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none placeholder:text-slate-400"
          />
        </Field>

        <Field label="Kelurahan">
          <button
            type="button"
            onClick={() => setPicker("kelurahan")}
            className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-[14px] ${kelurahan ? "text-slate-900" : "text-slate-400"}`}
          >
            {kelurahan || "Pilih Kelurahan"}
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </button>
        </Field>

        <Field label="Kecamatan, Kabupaten, Provinsi, Kode Pos">
          <div className="truncate rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-[14px] text-slate-600">
            {kelurahan ? KELURAHAN_WILAYAH[kelurahan] : "Alamat akan terisi otomatis"}
          </div>
        </Field>

        <Field label="Target Leads">
          <input
            type="number"
            min="1"
            inputMode="numeric"
            value={targetLeads}
            onChange={(event) => setTargetLeads(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none"
          />
        </Field>

        <Field label="Foto Kegiatan">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white">
            <label className="flex min-w-0 flex-1 cursor-pointer items-center px-3.5 py-3 text-[14px] text-slate-500">
              <span className={`truncate ${photoName ? "text-[#2953A4]" : ""}`}>
                {photoName || "Unggah Foto Kegiatan"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) =>
                  readPhotoFile(event.target.files?.[0], setPhotoName, setPhotoUrl)
                }
              />
            </label>
            <button
              type="button"
              onClick={() => setCameraOpen(true)}
              className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center text-[#2953A4]"
              aria-label="Ambil foto"
            >
              <Camera className="h-5 w-5" />
            </button>
          </div>
        </Field>

        <div className="sticky bottom-0 -mx-5 mt-2 bg-white px-5 pb-4 pt-3">
          <button
            type="submit"
            disabled={!valid || busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2953A4] py-3.5 text-[15px] font-semibold text-white disabled:bg-slate-100 disabled:text-slate-400"
          >
            {busy && <Spinner className="h-4 w-4" />}
            {busy ? "Menyimpan…" : "Simpan Aktivitas"}
          </button>
        </div>
      </form>

      {picker && (
        <PickerOverlay
          picker={picker}
          selectedTypes={selectedTypes}
          kelurahan={kelurahan}
          search={kelurahanSearch}
          filteredKelurahan={filteredKelurahan}
          setSearch={setKelurahanSearch}
          onClose={() => setPicker(null)}
          onActivity={(value) => setSelectedTypes([value])}
          onKelurahan={(value) => {
            setKelurahan(value);
            setPicker(null);
          }}
        />
      )}

      {cameraOpen && (
        <CameraModal
          mode="photo"
          onClose={() => setCameraOpen(false)}
          onSave={(url) => {
            setPhotoUrl(url || "");
            setPhotoName("Foto kegiatan tersimpan");
            setCameraOpen(false);
          }}
          onSkip={() => setCameraOpen(false)}
        />
      )}

      {created && (
        <OverlayPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
            <div className="w-full max-w-[360px] rounded-2xl bg-white px-5 pb-5 pt-8 text-center shadow-2xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef2ff]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffd43d] text-4xl font-bold leading-none text-white">
                  ✓
                </span>
              </div>
              <h2 className="mt-5 text-[22px] font-bold text-slate-950">
                Aktivitas Berhasil Dibuat
              </h2>
              <p className="mt-2 text-[14px] leading-5 text-slate-500">
                Aktivitas monitoring sudah tersimpan.
              </p>
              <button
                type="button"
                onClick={() => navigate({ to: "/kacab-aktivitas" })}
                className="mt-6 w-full rounded-xl bg-[#315bac] py-3.5 text-[15px] font-semibold text-white"
              >
                Lihat Aktivitas
              </button>
            </div>
          </div>
        </OverlayPortal>
      )}
    </MobileShell>
  );
}

function PickerOverlay({
  picker,
  selectedTypes,
  kelurahan,
  search,
  filteredKelurahan,
  setSearch,
  onClose,
  onActivity,
  onKelurahan,
}: {
  picker: Exclude<Picker, null>;
  selectedTypes: ActivityType[];
  kelurahan: string;
  search: string;
  filteredKelurahan: string[];
  setSearch: (value: string) => void;
  onClose: () => void;
  onActivity: (value: ActivityType) => void;
  onKelurahan: (value: string) => void;
}) {
  const title = picker === "activity" ? "Aktivitas" : "Kelurahan";
  return (
    <OverlayPortal>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
        onClick={onClose}
      >
        <div
          className="motion-backdrop-in w-full max-w-[440px] rounded-t-2xl bg-white px-5 pb-6 pt-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-slate-900">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Tutup">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          {picker === "kelurahan" && (
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari kelurahan/kode pos"
                className="w-full rounded-lg border border-slate-200 py-3 pl-9 pr-3 text-[13px] outline-none"
              />
            </div>
          )}
          <div className="mt-3 max-h-[45vh] overflow-y-auto">
            {picker === "activity" &&
              ACTIVITIES.map((item) => (
                <PickerRow
                  key={item}
                  label={item}
                  selected={selectedTypes.includes(item)}
                  onClick={() => onActivity(item)}
                />
              ))}
            {picker === "activity" && (
              <button
                type="button"
                onClick={onClose}
                disabled={!selectedTypes.length}
                className="mt-4 w-full rounded-xl bg-[#2953A4] py-3 text-[14px] font-semibold text-white disabled:bg-slate-100 disabled:text-slate-400"
              >
                Pilih Kegiatan
              </button>
            )}
            {picker === "kelurahan" &&
              filteredKelurahan.map((item) => (
                <PickerRow
                  key={item}
                  label={item}
                  detail={KELURAHAN_WILAYAH[item]}
                  selected={kelurahan === item}
                  onClick={() => onKelurahan(item)}
                />
              ))}
          </div>
        </div>
      </div>
    </OverlayPortal>
  );
}

function PickerRow({
  label,
  detail,
  selected,
  onClick,
}: {
  label: string;
  detail?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-slate-100 py-3 text-left"
    >
      <span>
        <span className="block text-[14px] text-slate-800">{label}</span>
        {detail && <span className="mt-0.5 block text-[12px] text-slate-500">{detail}</span>}
      </span>
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? "border-[#2953A4] bg-[#2953A4] text-white" : "border-[#93a8c8]"}`}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
    </button>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[14px] text-slate-800">{label}</label>
      {children}
      {hint && <p className="mt-1.5 text-[12px] text-[#2953A4]">{hint}</p>}
    </div>
  );
}

function formatInputDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function readPhotoFile(
  file: File | undefined,
  setName: (value: string) => void,
  setUrl: (value: string) => void,
) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    setName(file.name);
    setUrl(typeof reader.result === "string" ? reader.result : "");
  };
  reader.readAsDataURL(file);
}
