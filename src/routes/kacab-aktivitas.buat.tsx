import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { CameraModal } from "@/components/camera-modal";
import { OverlayPortal, Spinner, useMinBusy } from "@/components/motion";
import { createActivity } from "@/lib/activity-store";
import { formatInputDateLong, inputDateToLocalIso, todayInputDate } from "@/lib/date-utils";
import { KELURAHAN_WILAYAH, type Activity, type ActivityType } from "@/lib/mock-data";
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

export const Route = createFileRoute("/kacab-aktivitas/buat")({
  head: () => ({ meta: [{ title: "Tambah Aktivitas KACAB" }] }),
  component: CreateKacabActivity,
});

const KCP_OPTIONS = [
  {
    name: "MAS MONANG-MANING",
    kelurahan: "Pilumpanua",
    address: "Balai Desa Kelurahan Pilumpanua",
    wilayah: "Kec. Wajo, Sulawesi Selatan, 17133",
  },
  {
    name: "MAS RAWAMANGUN",
    kelurahan: "Rawamangun",
    address: "Jl. Balai Pustaka Timur No. 1, Rawamangun",
    wilayah: "Kec. Pulogadung, Jakarta Timur, DKI Jakarta, 13220",
  },
  {
    name: "MAS KEMAYORAN",
    kelurahan: "Kemayoran",
    address: "Jl. Kemayoran Gempol, Kemayoran",
    wilayah: "Kec. Kemayoran, Jakarta Pusat, DKI Jakarta, 10620",
  },
];
const ACTIVITIES: ActivityType[] = [
  "Penyelesaian Case Outlet",
  "Visit Nasabah One Obligor",
  "Evaluasi Pencapaian Target Unit & Sales",
];
const PRIORITIES = ["High", "Low"] as const;
const KELURAHAN_OPTIONS = [
  ...new Set([...Object.keys(KELURAHAN_WILAYAH), ...KCP_OPTIONS.map((item) => item.kelurahan)]),
];
type Picker = "activity" | "priority" | "kelurahan" | null;

function CreateKacabActivity() {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<ActivityType[]>([]);
  const [priority, setPriority] = useState<(typeof PRIORITIES)[number] | "">("");
  const [date] = useState(todayInputDate);
  const [kcpName, setKcpName] = useState("");
  const [place, setPlace] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [from, setFrom] = useState("08:00");
  const [to, setTo] = useState("10:00");
  const [photoName, setPhotoName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [picker, setPicker] = useState<Picker>(null);
  const [kelurahanSearch, setKelurahanSearch] = useState("");
  const [created, setCreated] = useState<Activity | null>(null);
  const [busy, runSave] = useMinBusy();
  const kcp = KCP_OPTIONS.find((item) => item.name === kcpName);
  const filteredKelurahan = useMemo(
    () =>
      KELURAHAN_OPTIONS.filter((item) =>
        item.toLowerCase().includes(kelurahanSearch.toLowerCase()),
      ),
    [kelurahanSearch],
  );
  const valid = selectedTypes.length > 0 && priority && date && kcpName && kelurahan;

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || busy || !kcp) return;
    runSave(() => {
      const activity = createActivity({
        type: selectedTypes[0],
        activityTypes: selectedTypes,
        kind: "lapangan",
        ptm: "Dalam PTM",
        locationName: kcp.name,
        address: place.trim() || kcp.address,
        kelurahan,
        wilayah: KELURAHAN_WILAYAH[kelurahan] || kcp.wilayah,
        date: inputDateToLocalIso(date),
        timeRange: `${from} - ${to}`,
        startTime: from,
        endTime: to,
        photoUrl: photoUrl || undefined,
      });
      setCreated(activity);
    });
  };

  const chooseKcp = (value: string) => {
    const next = KCP_OPTIONS.find((item) => item.name === value);
    setKcpName(value);
    setPlace("");
    setKelurahan(next?.kelurahan ?? "");
  };

  return (
    <MobileShell role="kacab" hideNav>
      <header className="bg-white px-5 pb-3 pt-12">
        <button
          onClick={() => navigate({ to: "/kacab-aktivitas" })}
          className="inline-flex items-center gap-2 text-slate-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-[17px] font-medium">Tambah Aktivitas</span>
        </button>
      </header>
      <form onSubmit={save} className="space-y-4 bg-white px-5 pb-8 pt-4">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900">Buat Aktivitas</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">Isi detail kegiatan monitoring KCP</p>
        </div>

        <Field label="Kegiatan">
          <button
            type="button"
            onClick={() => setPicker("activity")}
            className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-[14px] ${selectedTypes.length ? "text-slate-900" : "text-slate-400"}`}
          >
            <span>{selectedTypes.length ? "Tambah Kegiatan" : "Pilih Kegiatan"}</span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
          {selectedTypes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTypes.map((value) => (
                <span
                  key={value}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#eef3ff] px-3 py-1.5 text-[12px] font-medium text-[#2953A4]"
                >
                  {value}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedTypes((current) => current.filter((item) => item !== value))
                    }
                    className="rounded-full p-0.5 hover:bg-[#dce7ff]"
                    aria-label={`Hapus ${value}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        <Field label="Priority">
          <button
            type="button"
            onClick={() => setPicker("priority")}
            className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left text-[14px] ${priority ? "text-slate-900" : "text-slate-400"}`}
          >
            {priority || "Pilih Priority"}
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
        </Field>
        <Field label="Tanggal Pelaksanaan">
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left text-[14px] text-slate-700 disabled:opacity-100"
          >
            {formatInputDateLong(date)}
            <CalendarDays className="h-4 w-4 text-slate-500" />
          </button>
        </Field>
        <Field label="Nama KCP">
          <span className="relative block">
            <select
              required
              value={kcpName}
              onChange={(event) => chooseKcp(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-[14px] text-slate-800 outline-none"
            >
              <option value="" disabled>
                Pilih KCP
              </option>
              {KCP_OPTIONS.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </span>
        </Field>
        <Field label="Tempat Kegiatan (Opsional)">
          <input
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            placeholder={kcp?.address ?? "Contoh: Balai Desa"}
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
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-[14px] text-slate-600">
            {kelurahan
              ? KELURAHAN_WILAYAH[kelurahan] || kcp?.wilayah
              : "Alamat akan terisi otomatis"}
          </div>
        </Field>
        <Field label="Foto Kegiatan (Opsional)">
          <div className="flex gap-2">
            <label className="flex min-w-0 flex-1 cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3.5 py-3 text-[14px] text-slate-500">
              <span className={`truncate ${photoName ? "text-[#2953A4]" : ""}`}>
                {photoName || "Unggah foto"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => setPhotoName(event.target.files?.[0]?.name || "")}
              />
            </label>
            <button
              type="button"
              onClick={() => setCameraOpen(true)}
              className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 text-[#2953A4]"
              aria-label="Ambil foto"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          {photoUrl && (
            <button
              type="button"
              onClick={() => setCameraOpen(true)}
              className="mt-2 block overflow-hidden rounded-xl border border-slate-200"
            >
              <img
                src={photoUrl}
                alt="Preview foto kegiatan"
                className="h-28 w-full object-cover"
              />
            </button>
          )}
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
          priority={priority}
          kelurahan={kelurahan}
          search={kelurahanSearch}
          setSearch={setKelurahanSearch}
          onClose={() => setPicker(null)}
          onActivity={(value) =>
            setSelectedTypes((current) =>
              current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
            )
          }
          onPriority={(value) => {
            setPriority(value);
          }}
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
  priority,
  kelurahan,
  search,
  setSearch,
  onClose,
  onActivity,
  onPriority,
  onKelurahan,
}: {
  picker: Exclude<Picker, null>;
  selectedTypes: ActivityType[];
  priority: (typeof PRIORITIES)[number] | "";
  kelurahan: string;
  search: string;
  setSearch: (value: string) => void;
  onClose: () => void;
  onActivity: (value: ActivityType) => void;
  onPriority: (value: (typeof PRIORITIES)[number]) => void;
  onKelurahan: (value: string) => void;
}) {
  const title =
    picker === "activity" ? "Kegiatan" : picker === "priority" ? "Priority" : "Kelurahan";
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
            {picker === "priority" &&
              PRIORITIES.map((item) => (
                <PickerRow
                  key={item}
                  label={item}
                  selected={priority === item}
                  onClick={() => onPriority(item)}
                />
              ))}
            {picker === "priority" && (
              <button
                type="button"
                onClick={onClose}
                disabled={!priority}
                className="mt-4 w-full rounded-xl bg-[#2953A4] py-3 text-[14px] font-semibold text-white disabled:bg-slate-100 disabled:text-slate-400"
              >
                Pilih Priority
              </button>
            )}
            {picker === "kelurahan" &&
              KELURAHAN_OPTIONS.filter((item) =>
                item.toLowerCase().includes(search.toLowerCase()),
              ).map((item) => (
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
