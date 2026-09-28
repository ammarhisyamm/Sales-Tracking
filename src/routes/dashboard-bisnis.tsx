import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Ban,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  FileText,
  LayoutGrid,
  LogOut,
  X,
} from "lucide-react";
import { TargetFilters } from "../components/target-filters";
import { formatRupiah } from "../lib/mock-data";

export const Route = createFileRoute("/dashboard-bisnis")({
  head: () => ({ meta: [{ title: "Dashboard Bisnis — Sales Officer" }] }),
  component: DashboardBisnis,
});

type BusinessSalesTarget = {
  salesName: string;
  grade: string;
  unit: string;
  total: number;
  weekly: number;
  daily: number;
  ado: number;
  booking: number;
  gram: number;
  active: boolean;
};

const INITIAL_TARGETS: BusinessSalesTarget[] = [
  {
    salesName: "Udin",
    grade: "Trainee",
    unit: "Rawamangun",
    total: 40,
    weekly: 10,
    daily: 3,
    ado: 32000000,
    booking: 100000000,
    gram: 3,
    active: true,
  },
  {
    salesName: "Akbar",
    grade: "Silver",
    unit: "Rawamangun",
    total: 40,
    weekly: 10,
    daily: 5,
    ado: 32000000,
    booking: 50000000,
    gram: 5,
    active: false,
  },
  {
    salesName: "Marta",
    grade: "Gold",
    unit: "Rawamangun",
    total: 40,
    weekly: 10,
    daily: 5,
    ado: 32000000,
    booking: 40000000,
    gram: 5,
    active: false,
  },
  {
    salesName: "Maldini",
    grade: "Platinum",
    unit: "Rawamangun",
    total: 40,
    weekly: 10,
    daily: 5,
    ado: 32000000,
    booking: 42000000,
    gram: 5,
    active: false,
  },
  {
    salesName: "Ronaldo",
    grade: "-",
    unit: "Rawamangun",
    total: 40,
    weekly: 10,
    daily: 5,
    ado: 32000000,
    booking: 40000000,
    gram: 5,
    active: false,
  },
];

type BusinessEdit = {
  key: string;
  ado: string;
  booking: string;
  gram?: string;
  active: boolean;
};

function DashboardBisnis() {
  const [period, setPeriod] = useState("Februari 2026");
  const [unit, setUnit] = useState("Semua Unit");
  const [grade, setGrade] = useState("Semua Grade");
  const [targets, setTargets] = useState(INITIAL_TARGETS);
  const [edit, setEdit] = useState<BusinessEdit | null>(null);
  const [targetMenuOpen, setTargetMenuOpen] = useState(true);
  const visible = targets.filter(
    (item) =>
      (unit === "Semua Unit" || item.unit === unit) &&
      (grade === "Semua Grade" || item.grade === grade),
  );

  const save = () => {
    if (!edit) return;
    setTargets((items) =>
      items.map((item) =>
        `${item.unit}::${item.grade}::${item.salesName}` === edit.key
          ? {
              ...item,
              ado: parseAmount(edit.ado),
              booking: parseAmount(edit.booking),
              ...(edit.gram === undefined ? {} : { gram: parseAmount(edit.gram) }),
              active: edit.active,
            }
          : item,
      ),
    );
    setEdit(null);
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#17182d]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[256px] border-t-2 border-[#199900] bg-[#292663] text-white lg:block">
        <div className="flex h-[90px] items-center gap-4 bg-[#199900] px-6">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#199900]">
            <Building2 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="whitespace-nowrap text-[16px] font-medium">Rawamangun</p>
            <p className="mt-1 whitespace-nowrap text-[14px] text-white/70">Bisnis</p>
          </div>
        </div>
        <nav className="pt-0 text-[14px]">
          <SideItem icon={<LayoutGrid />} label="Dashboard" />
          <button
            type="button"
            onClick={() => setTargetMenuOpen((open) => !open)}
            className="flex h-12 w-full items-center gap-4 border-l-4 border-white bg-[#3d35d9] px-8 text-left text-white hover:bg-[#4840e0]"
          >
            <FileText className="h-6 w-6 shrink-0" />
            <span className="flex-1 whitespace-nowrap">Pencapaian Tim</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${targetMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
          {targetMenuOpen && (
            <div className="bg-[#211f58] py-1 text-white/90">
              <SideSubItem label="Target Aktivitas" active />
              <SideSubItem label="Pencapaian Kepala KCP" />
              <SideSubItem label="Pencapaian Penaksir" muted />
              <SideSubItem label="Pencapaian Sales Officer" muted />
              <SideSubItem label="Pencapaian Sales Agent" muted />
            </div>
          )}
          <SideItem icon={<ClipboardCheck />} label="Pengajuan Event" />
          <SideItem icon={<FileText />} label="Realisasi Event" />
          <SideItem icon={<LogOut />} label="Pengembalian Realisasi" />
          <SideItem icon={<FileText />} label="Riwayat Event" />
          <div className="mt-12">
            <SideItem icon={<LayoutGrid />} label="Ubah Kata Sandi" />
            <SideItem icon={<FileText />} label="Keluar" />
          </div>
        </nav>
      </aside>
      <main className="flex min-h-screen flex-col lg:ml-[256px]">
        <div className="flex-1 mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-12 lg:py-12">
          <div className="flex items-center gap-4 text-[16px] text-slate-500">
            <span>Home</span>
            <span>/</span>
            <strong className="text-slate-900">Pencapaian Tim</strong>
          </div>
          <h1 className="mt-5 text-[32px] font-bold tracking-tight">Target Aktivitas</h1>
          <div className="mt-10 flex gap-10 border-b border-slate-200 text-[17px] font-medium">
            <span className="border-b-4 border-[#199900] px-1 pb-4 text-[#199900]">
              Sales Officer
            </span>
          </div>
          <section className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7">
              <div>
                <h2 className="text-[25px] font-semibold">Daftar Target Aktivitas</h2>
                <p className="mt-1 text-[14px] text-slate-400">{visible.length} Data</p>
              </div>
              <TargetFilters
                period={period}
                onPeriodChange={setPeriod}
                unit={unit}
                units={targets.map((item) => item.unit)}
                onUnitChange={setUnit}
                grade={grade}
                grades={[...new Set(targets.map((item) => item.grade))]}
                onGradeChange={setGrade}
                showUnit={false}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse text-left">
                <thead className="border-y border-slate-200 bg-white text-[14px] text-slate-400">
                  <tr>
                    <th className="whitespace-nowrap px-5 py-5 font-medium">No</th>
                    <th className="whitespace-nowrap px-5 py-5 font-medium">Name</th>
                    <th className="whitespace-nowrap px-5 py-5 font-medium">Grade</th>
                    <th className="whitespace-nowrap px-5 py-5 font-medium">Unit</th>
                    <th className="whitespace-nowrap px-5 py-5 font-medium">Booking Amount</th>
                    <th className="whitespace-nowrap px-5 py-5 font-medium">ADO</th>
                    <th className="whitespace-nowrap px-5 py-5 font-medium">Gram</th>
                    <th className="whitespace-nowrap px-5 py-5 font-medium">Status</th>
                    <th className="sticky right-0 whitespace-nowrap bg-white px-5 py-5 font-medium shadow-[-8px_0_12px_rgba(23,24,45,0.06)]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item, index) => (
                    <tr
                      key={`${item.unit}-${item.grade}-${item.salesName}`}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="whitespace-nowrap px-5 py-6">{index + 1}</td>
                      <td className="whitespace-nowrap px-5 py-6">{item.salesName}</td>
                      <td className="whitespace-nowrap px-5 py-6">{item.grade}</td>
                      <td className="whitespace-nowrap px-5 py-6">{item.unit}</td>
                      <td className="whitespace-nowrap px-5 py-6">
                        {formatRupiahCompact(item.booking)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-6">
                        {formatRupiahCompact(item.ado)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-6">{item.gram}</td>
                      <td className="whitespace-nowrap px-5 py-6">
                        <span
                          className={`inline-flex items-center gap-2 text-[14px] font-medium ${item.active ? "text-[#0a7d2c]" : "text-slate-500"}`}
                        >
                          {item.active ? (
                            <CircleCheck className="h-5 w-5" />
                          ) : (
                            <Ban className="h-5 w-5" />
                          )}
                          {item.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="sticky right-0 whitespace-nowrap bg-white px-5 py-6 shadow-[-8px_0_12px_rgba(23,24,45,0.06)]">
                        <button
                          onClick={() =>
                            setEdit({
                              key: `${item.unit}::${item.grade}::${item.salesName}`,
                              ado: formatAmount(item.ado),
                              booking: formatAmount(item.booking),
                              gram: formatAmount(item.gram),
                              active: item.active,
                            })
                          }
                          className="rounded-lg border border-[#292663] px-5 py-2 text-[14px] font-medium text-[#292663]"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100">
              <div className="flex items-center justify-end gap-4 px-7 py-6 text-[14px] text-slate-400">
                <span className="flex items-center gap-2">
                  Rows per page:
                  <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                    10 <ChevronDown className="h-4 w-4" />
                  </span>
                </span>
                <button disabled className="rounded-lg border border-slate-200 p-2 opacity-50">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="rounded-lg bg-[#199900] px-3 py-2 font-semibold text-white">
                  1
                </span>
                <button className="rounded-lg border border-slate-200 p-2 opacity-50">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </section>
        </div>
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-8 text-[14px] text-slate-500 lg:px-12">
          2021 © Sales Tracking. All rights reserved.
        </footer>
      </main>
      {edit && <BusinessEditModal edit={edit} setEdit={setEdit} onSave={save} />}
    </div>
  );
}

function BusinessEditModal({
  edit,
  setEdit,
  onSave,
}: {
  edit: BusinessEdit;
  setEdit: (value: BusinessEdit | null) => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[520px] rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
          <h2 className="text-[24px] font-bold">Edit Target Bisnis</h2>
          <button onClick={() => setEdit(null)} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        <div className="grid gap-4 px-8 py-6">
          <AmountField
            label="ADO"
            value={edit.ado}
            onChange={(value) => setEdit({ ...edit, ado: value })}
          />
          <AmountField
            label="Booking Amount"
            value={edit.booking}
            onChange={(value) => setEdit({ ...edit, booking: value })}
          />
          <AmountField
            label="Gram (New CIF)"
            value={edit.gram ?? ""}
            onChange={(value) => setEdit({ ...edit, gram: value })}
          />
          <div>
            <p className="text-[14px] font-medium text-slate-700">
              Status<span className="text-red-500">*</span>
            </p>
            <div className="mt-1.5 grid gap-2 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setEdit({ ...edit, active: true })}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-[14px] ${edit.active ? "border-2 border-[#199900] text-[#199900]" : "border-slate-200 text-slate-600"}`}
              >
                <span
                  className={`h-5 w-5 rounded-full border-2 ${edit.active ? "border-[#199900]" : "border-slate-400"}`}
                >
                  {edit.active && (
                    <span className="mx-auto mt-0.5 block h-2.5 w-2.5 rounded-full bg-[#199900]" />
                  )}
                </span>
                Active
              </button>
              <button
                type="button"
                onClick={() => setEdit({ ...edit, active: false })}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-[14px] ${!edit.active ? "border-2 border-slate-500 text-slate-700" : "border-slate-200 text-slate-600"}`}
              >
                <span
                  className={`h-5 w-5 rounded-full border-2 ${!edit.active ? "border-slate-500" : "border-slate-400"}`}
                >
                  {!edit.active && (
                    <span className="mx-auto mt-0.5 block h-2.5 w-2.5 rounded-full bg-slate-500" />
                  )}
                </span>
                Inactive
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 px-8 py-4">
          <button
            onClick={() => setEdit(null)}
            className="rounded-lg border-2 border-[#199900] px-5 py-2.5 text-[14px] font-medium text-[#199900]"
          >
            Batalkan
          </button>
          <button
            onClick={onSave}
            className="rounded-lg bg-[#199900] px-6 py-2.5 text-[14px] font-semibold text-white"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function AmountField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-[14px] font-medium text-slate-700">
      {label}
      <input
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(formatAmountInput(event.target.value))}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] outline-none focus:border-[#199900]"
      />
    </label>
  );
}
function formatRupiahCompact(value: number) {
  return formatRupiah(value).replace(/\s/g, "");
}
function formatAmount(value: number) {
  return value.toLocaleString("id-ID");
}
function formatAmountInput(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("id-ID") : "";
}
function parseAmount(value: string) {
  return Number(value.replace(/\D/g, "")) || 0;
}
function SideItem({
  icon,
  label,
  active = false,
  end,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  end?: React.ReactNode;
}) {
  return (
    <div
      className={`flex h-12 items-center gap-4 border-l-4 px-8 ${active ? "border-white bg-[#3d35d9] text-white" : "border-transparent text-white/75"}`}
    >
      {icon}
      <span className="flex-1 whitespace-nowrap">{label}</span>
      {end}
    </div>
  );
}
function SideSubItem({
  label,
  active = false,
  muted = false,
}: {
  label: string;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`relative flex h-12 items-center pl-16 pr-8 text-[14px] whitespace-nowrap ${muted ? "text-white/60" : ""}`}
    >
      {active && <span className="absolute left-10 h-3 w-3 rounded-full bg-white" />}
      {label}
    </div>
  );
}
