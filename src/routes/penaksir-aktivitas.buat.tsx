import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BatteryFull,
  CalendarDots,
  CaretDown,
  CellSignalFull,
  Check,
  WifiHigh,
  X,
} from "@phosphor-icons/react";
import { useState, type FormEvent, type ReactNode } from "react";
import { MobileShell } from "@/components/mobile-shell";
import { OverlayPortal, Spinner, useMinBusy } from "@/components/motion";

export const Route = createFileRoute("/penaksir-aktivitas/buat")({
  head: () => ({ meta: [{ title: "Tambah Aktivitas Penaksir" }] }),
  component: CreatePenaksirActivity,
});

const PRIMARY = "#2953A4";
const ACTIVITY_OPTIONS = ["Follow Up RO", "Follow Up OVD"] as const;
const MEDIA_OPTIONS = ["Visit", "Telepon", "Whatsapp"] as const;
const RESULT_OPTIONS = [
  "Deal Transaksi",
  "Masih Dipertimbangkan",
  "Tidak Dapat Dihubungi",
  "Belum Ada Respon",
] as const;
const SBG_OPTIONS = [
  "001568002500007 - Follow Up ke 1",
  "001568002500006 - Follow Up ke 2",
  "001568002500005 - Follow Up ke 1",
  "001568002500002 - Follow Up ke 5",
] as const;

type ActivityName = (typeof ACTIVITY_OPTIONS)[number];
type Picker = "activity" | "media" | "result" | "sbg" | null;

function CreatePenaksirActivity() {
  const navigate = useNavigate();
  const [activity, setActivity] = useState<ActivityName | "">("");
  const [cif, setCif] = useState("");
  const [date, setDate] = useState("");
  const [media, setMedia] = useState<(typeof MEDIA_OPTIONS)[number] | "">("");
  const [result, setResult] = useState<(typeof RESULT_OPTIONS)[number] | "">("");
  const [selectedSbg, setSelectedSbg] = useState<string[]>([]);
  const [picker, setPicker] = useState<Picker>(null);
  const [saved, setSaved] = useState(false);
  const [busy, runSave] = useMinBusy();

  const isOvd = activity === "Follow Up OVD";
  const valid = Boolean(
    activity && cif.trim() && date && media && result && (!isOvd || selectedSbg.length),
  );

  const chooseActivity = (value: ActivityName) => {
    setActivity(value);
    setResult("");
    setSelectedSbg([]);
    setPicker(null);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!valid || busy) return;
    runSave(() => setSaved(true));
  };

  return (
    <MobileShell hideNav>
      <header className="bg-white px-4 pb-4 pt-4">
        <div className="flex items-center justify-between text-[#131324]">
          <span className="text-[15px] font-semibold tracking-tight">9:41</span>
          <span className="flex items-center gap-1.5">
            <CellSignalFull size={17} weight="bold" />
            <WifiHigh size={18} weight="bold" />
            <BatteryFull size={20} weight="bold" />
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/penaksir" })}
          className="mt-8 inline-flex items-center gap-3 text-[20px] font-medium leading-none text-[#131324]"
        >
          <ArrowLeft size={31} weight="regular" />
          Tambah Aktivitas
        </button>
      </header>

      <form onSubmit={save} className="bg-white px-4 pb-32 pt-7">
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold leading-7 text-[#131324]">Buat Aktivitas</h1>
          <p className="mt-1 text-[16px] text-[#5a5a66]">Isi detail kegiatan</p>
        </div>

        <div className="space-y-5">
          <Field label="Aktivitas">
            <PickerField
              value={activity}
              placeholder="Pilih Aktivitas"
              onClick={() => setPicker("activity")}
            />
          </Field>

          <Field label="CIF (Nama Nasabah)">
            <input
              value={cif}
              onChange={(event) => setCif(event.target.value)}
              placeholder="Masukkan CIF"
              className="h-14 w-full rounded-[14px] border border-[#dfe7f2] bg-white px-4 text-[16px] text-[#131324] outline-none placeholder:text-[#90a1b9] focus:border-[#2953A4]"
            />
          </Field>

          <Field label="Follow Up Ke">
            <div className="flex h-14 items-center rounded-[14px] border border-[#dfe7f2] bg-white px-4 text-[16px] text-[#90a1b9]">
              [auto fill]
            </div>
          </Field>

          {isOvd && (
            <Field label="Nomor SBG">
              <PickerField
                value={selectedSbg.length ? `${selectedSbg.length} nomor SBG dipilih` : ""}
                placeholder="Pilih Nomor SBG"
                onClick={() => setPicker("sbg")}
              />
              {selectedSbg.length > 0 && (
                <div className="mt-2 space-y-2">
                  {selectedSbg.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-lg bg-[#eef5ff] px-3 py-2 text-[13px] text-[#415574]"
                    >
                      <span className="truncate pr-2">{item}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSbg((current) => current.filter((value) => value !== item))
                        }
                        className="shrink-0 rounded-full p-1 text-[#62748e] hover:bg-[#dce9fb]"
                        aria-label={`Hapus ${item}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
          )}

          <Field label="Tanggal Pelaksanaan">
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className={`penaksir-date-input h-14 w-full appearance-none rounded-[14px] border border-[#dfe7f2] bg-[#f8fafc] px-4 pr-12 text-[16px] outline-none focus:border-[#2953A4] ${date ? "text-[#131324]" : "text-[#90a1b9]"}`}
              />
              <CalendarDots
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#62748e]"
                size={22}
              />
            </div>
          </Field>

          <Field label="Media Follow Up">
            <PickerField value={media} placeholder="Pilih Media" onClick={() => setPicker("media")} />
          </Field>

          <Field label="Hasil Aktivitas">
            <PickerField value={result} placeholder="Pilih Hasil" onClick={() => setPicker("result")} />
          </Field>
        </div>

        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 border-t border-[#f1f5f9] bg-white px-4 pb-6 pt-3">
          <button
            type="submit"
            disabled={!valid || busy}
            className="flex h-12 w-full items-center justify-center rounded-lg text-[15px] font-semibold transition-colors disabled:bg-[#f1f5f9] disabled:text-[#62748e]"
            style={valid && !busy ? { backgroundColor: PRIMARY, color: "white" } : undefined}
          >
            {busy && <Spinner className="mr-2 h-4 w-4" />}
            {busy ? "Menyimpan…" : "Simpan Aktivitas"}
          </button>
          <div className="mx-auto mt-4 h-1 w-32 rounded-full bg-[#131324]" />
        </div>
      </form>

      {picker && (
        <PickerSheet
          picker={picker}
          activity={activity}
          media={media}
          result={result}
          selectedSbg={selectedSbg}
          onClose={() => setPicker(null)}
          onActivity={chooseActivity}
          onMedia={(value) => {
            setMedia(value);
            setPicker(null);
          }}
          onResult={(value) => {
            setResult(value);
            setPicker(null);
          }}
          onSbg={setSelectedSbg}
        />
      )}

      {saved && (
        <OverlayPortal>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5">
            <div className="motion-modal-in w-full max-w-[360px] rounded-2xl bg-white px-5 pb-5 pt-7 text-center shadow-2xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf1ff] text-[#2953A4]">
                <Check size={30} weight="bold" />
              </div>
              <h2 className="mt-4 text-[19px] font-semibold text-[#131324]">
                Aktivitas Berhasil Disimpan
              </h2>
              <p className="mt-2 text-[13px] leading-5 text-[#62748e]">
                Aktivitas Penaksir sudah tersimpan.
              </p>
              <button
                type="button"
                onClick={() => navigate({ to: "/penaksir" })}
                className="mt-5 h-12 w-full rounded-lg bg-[#2953A4] text-[14px] font-semibold text-white"
              >
                Kembali ke Penaksir
              </button>
            </div>
          </div>
        </OverlayPortal>
      )}
    </MobileShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[16px] leading-5 text-[#131324]">{label}</span>
      {children}
    </label>
  );
}

function PickerField({
  value,
  placeholder,
  onClick,
}: {
  value: string;
  placeholder: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-14 w-full items-center justify-between rounded-[14px] border border-[#dfe7f2] bg-white px-4 text-left text-[16px] ${value ? "text-[#131324]" : "text-[#90a1b9]"}`}
    >
      <span className="truncate">{value || placeholder}</span>
      <CaretDown className="ml-3 shrink-0 text-[#62748e]" size={22} />
    </button>
  );
}

function PickerSheet({
  picker,
  activity,
  media,
  result,
  selectedSbg,
  onClose,
  onActivity,
  onMedia,
  onResult,
  onSbg,
}: {
  picker: Exclude<Picker, null>;
  activity: ActivityName | "";
  media: (typeof MEDIA_OPTIONS)[number] | "";
  result: (typeof RESULT_OPTIONS)[number] | "";
  selectedSbg: string[];
  onClose: () => void;
  onActivity: (value: ActivityName) => void;
  onMedia: (value: (typeof MEDIA_OPTIONS)[number]) => void;
  onResult: (value: (typeof RESULT_OPTIONS)[number]) => void;
  onSbg: (values: string[]) => void;
}) {
  const title =
    picker === "activity"
      ? "Aktivitas"
      : picker === "media"
        ? "Media Follow Up"
        : picker === "result"
          ? "Hasil Aktivitas"
          : "Nomor SBG";
  const options =
    picker === "activity"
      ? ACTIVITY_OPTIONS
      : picker === "media"
        ? MEDIA_OPTIONS
        : picker === "result"
          ? RESULT_OPTIONS
          : SBG_OPTIONS;

  return (
    <OverlayPortal>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/45"
        onClick={onClose}
      >
        <div
          className="motion-sheet-in w-full max-w-[440px] rounded-t-2xl bg-white px-5 pb-7 pt-5"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-[#131324]">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="rounded-full p-1 text-[#62748e]"
            >
              <X size={20} />
            </button>
          </div>
          <div className="max-h-[48vh] overflow-y-auto">
            {options.map((option) => {
              const selected =
                picker === "sbg"
                  ? selectedSbg.includes(option)
                  : option ===
                    (picker === "activity" ? activity : picker === "media" ? media : result);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    if (picker === "activity") onActivity(option as ActivityName);
                    else if (picker === "media") onMedia(option as (typeof MEDIA_OPTIONS)[number]);
                    else if (picker === "result")
                      onResult(option as (typeof RESULT_OPTIONS)[number]);
                    else
                      onSbg(
                        selected
                          ? selectedSbg.filter((item) => item !== option)
                          : [...selectedSbg, option],
                      );
                  }}
                  className="flex w-full items-center justify-between border-b border-[#f1f5f9] py-3.5 text-left text-[14px] text-[#131324]"
                >
                  {option}
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-[#2953A4] bg-[#2953A4] text-white" : "border-[#b8c4d4]"}`}
                  >
                    {selected && <Check size={13} weight="bold" />}
                  </span>
                </button>
              );
            })}
          </div>
          {picker === "sbg" && (
            <button
              type="button"
              onClick={onClose}
              disabled={!selectedSbg.length}
              className="mt-5 h-12 w-full rounded-lg bg-[#2953A4] text-[14px] font-semibold text-white disabled:bg-[#f1f5f9] disabled:text-[#62748e]"
            >
              Pilih Nomor SBG
            </button>
          )}
        </div>
      </div>
    </OverlayPortal>
  );
}
