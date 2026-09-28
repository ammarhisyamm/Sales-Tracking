import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  Pencil,
  Settings2,
  ShieldCheck,
  Target,
  UsersRound,
  X,
} from "lucide-react";
import { TargetFilters } from "../components/target-filters";
import { formatRupiah } from "../lib/mock-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Target Aktivitas" }] }),
  component: Dashboard,
});

type TargetRow = {
  unit: string;
  total: number;
  monthly: number;
  weekly: number;
  daily: number;
  configured: boolean;
};
type EditTarget = {
  unit: string;
  total: string;
  monthly?: string;
  weekly: string;
  daily: string;
  active: boolean;
  ado?: string;
  gram?: string;
  so?: string;
  leads?: string;
  closingLeads?: string;
  leadsMonthly?: string;
  closingMonthly?: string;
  leadsWeekly?: string;
  closingWeekly?: string;
  leadsDaily?: string;
  closingDaily?: string;
};
type PenaksirTarget = TargetRow & { grade: string };
type SalesOfficerTarget = TargetRow & {
  salesName: string;
  so: string;
  grade: string;
  booking: string;
  ado: string;
  gram: number;
  leads: number;
  closingLeads: number;
  leadsMonthly: number;
  closingMonthly: number;
  leadsWeekly: number;
  closingWeekly: number;
  leadsDaily: number;
  closingDaily: number;
};

const INITIAL_TARGETS: TargetRow[] = [
  { unit: "Rawamangun", total: 40, monthly: 40, weekly: 10, daily: 0, configured: true },
  { unit: "Monang-Maning", total: 40, monthly: 40, weekly: 10, daily: 5, configured: false },
  { unit: "Kemayoran", total: 40, monthly: 40, weekly: 10, daily: 5, configured: false },
];

const INITIAL_PENAKSIR_TARGETS: PenaksirTarget[] = [
  { unit: "Rawamangun", grade: "A", total: 40, monthly: 40, weekly: 0, daily: 2, configured: true },
];

const INITIAL_SALES_TARGETS: SalesOfficerTarget[] = [
  {
    salesName: "Udin",
    so: "Trainee",
    unit: "Rawamangun",
    grade: "Trainee",
    booking: "Rp32.000.000",
    total: 40,
    monthly: 40,
    weekly: 10,
    daily: 3,
    leads: 12,
    closingLeads: 8,
    leadsMonthly: 12,
    closingMonthly: 8,
    leadsWeekly: 3,
    closingWeekly: 2,
    leadsDaily: 1,
    closingDaily: 1,
    ado: formatRupiah(10),
    gram: 3,
    configured: true,
  },
  {
    salesName: "Akbar",
    so: "Silver",
    unit: "Rawamangun",
    grade: "Silver",
    booking: "Rp32.000.000",
    total: 40,
    monthly: 40,
    weekly: 10,
    daily: 5,
    leads: 16,
    closingLeads: 10,
    leadsMonthly: 16,
    closingMonthly: 10,
    leadsWeekly: 4,
    closingWeekly: 3,
    leadsDaily: 1,
    closingDaily: 1,
    ado: formatRupiah(10),
    gram: 5,
    configured: false,
  },
  {
    salesName: "Marta",
    so: "Gold",
    unit: "Rawamangun",
    grade: "Gold",
    booking: "Rp32.000.000",
    total: 40,
    monthly: 40,
    weekly: 10,
    daily: 5,
    leads: 20,
    closingLeads: 12,
    leadsMonthly: 20,
    closingMonthly: 12,
    leadsWeekly: 5,
    closingWeekly: 3,
    leadsDaily: 2,
    closingDaily: 1,
    ado: formatRupiah(10),
    gram: 5,
    configured: false,
  },
  {
    salesName: "Maldini",
    so: "Platinum",
    unit: "Rawamangun",
    grade: "Platinum",
    booking: "Rp32.000.000",
    total: 40,
    monthly: 40,
    weekly: 10,
    daily: 5,
    leads: 24,
    closingLeads: 16,
    leadsMonthly: 24,
    closingMonthly: 16,
    leadsWeekly: 6,
    closingWeekly: 4,
    leadsDaily: 2,
    closingDaily: 1,
    ado: formatRupiah(10),
    gram: 5,
    configured: false,
  },
  {
    salesName: "Ronaldo",
    so: "-",
    unit: "Rawamangun",
    grade: "-",
    booking: "Rp32.000.000",
    total: 40,
    monthly: 40,
    weekly: 10,
    daily: 5,
    leads: 12,
    closingLeads: 8,
    leadsMonthly: 12,
    closingMonthly: 8,
    leadsWeekly: 3,
    closingWeekly: 2,
    leadsDaily: 1,
    closingDaily: 1,
    ado: formatRupiah(10),
    gram: 5,
    configured: false,
  },
];

const EDITABLE_FROM_MONTH = 8;
const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function isEditableTargetPeriod(period: string) {
  const [month, yearText] = period.split(" ");
  const year = Number(yearText);
  return year > 2026 || (year === 2026 && MONTH_NAMES.indexOf(month) >= EDITABLE_FROM_MONTH);
}

function Dashboard() {
  const [tab, setTab] = useState("Kepala KCP");
  const [unit, setUnit] = useState("Semua Unit");
  const [period, setPeriod] = useState("Februari 2026");
  const [targets, setTargets] = useState(INITIAL_TARGETS);
  const [penaksirTargets, setPenaksirTargets] = useState(INITIAL_PENAKSIR_TARGETS);
  const [salesTargets, setSalesTargets] = useState(INITIAL_SALES_TARGETS);
  const [edit, setEdit] = useState<EditTarget | null>(null);
  const [successUnit, setSuccessUnit] = useState<string | null>(null);
  const [targetMenuOpen, setTargetMenuOpen] = useState(true);
  const [salesGrade, setSalesGrade] = useState("Semua Grade");
  const visible = useMemo(() => targets, [targets]);
  const configured = targets.filter((item) => item.configured).length;
  const canEditTarget = isEditableTargetPeriod(period);

  const saveTarget = () => {
    if (!edit || !canEditTarget) return;
    if (tab === "Penaksir") {
      setPenaksirTargets((items) =>
        items.map((item) =>
          item.unit === edit.unit
            ? {
                ...item,
                total: Number(edit.monthly ?? edit.total) || 0,
                monthly: Number(edit.monthly ?? edit.total) || 0,
                weekly: Number(edit.weekly) || 0,
                daily: Number(edit.daily) || 0,
                configured: edit.active,
              }
            : item,
        ),
      );
    } else if (tab === "Sales Officer") {
      const [salesUnit, salesSo] = edit.unit.split("::");
      setSalesTargets((items) =>
        items.map((item) =>
          item.unit === salesUnit && item.so === salesSo
            ? {
                ...item,
                leadsMonthly: Number(edit.leadsMonthly) || 0,
                closingMonthly: Number(edit.closingMonthly) || 0,
                leadsWeekly: Number(edit.leadsWeekly) || 0,
                closingWeekly: Number(edit.closingWeekly) || 0,
                leadsDaily: Number(edit.leadsDaily) || 0,
                closingDaily: Number(edit.closingDaily) || 0,
                leads: Number(edit.leadsMonthly) || 0,
                closingLeads: Number(edit.closingMonthly) || 0,
                configured: edit.active,
              }
            : item,
        ),
      );
    } else {
      setTargets((items) =>
        items.map((item) =>
          item.unit === edit.unit
            ? {
                ...item,
                total: Number(edit.monthly ?? edit.total) || 0,
                monthly: Number(edit.monthly ?? edit.total) || 0,
                weekly: Number(edit.weekly) || 0,
                configured: edit.active,
              }
            : item,
        ),
      );
    }
    setEdit(null);
    setSuccessUnit(edit.unit);
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
            <p className="mt-1 whitespace-nowrap text-[14px] text-white/70">Kepala Cabang</p>
          </div>
        </div>
        <nav className="pt-0 text-[14px]">
          <NavItem icon={<LayoutGrid />} label="Dashboard" />
          <button
            type="button"
            onClick={() => setTargetMenuOpen((open) => !open)}
            className="flex h-12 w-full items-center gap-4 border-l-4 border-white bg-[#3d35d9] px-8 text-left text-white transition-colors hover:bg-[#4840e0]"
          >
            <FileText className="h-6 w-6 shrink-0" />
            <span className="flex-1 whitespace-nowrap">Pencapaian Tim</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${targetMenuOpen ? "rotate-180" : ""}`}
            />
          </button>
          {targetMenuOpen && (
            <div className="bg-[#211f58] py-1 text-white/90">
              <SidebarSubItem label="Target Aktivitas" active />
              <SidebarSubItem label="Pencapaian Kepala KCP" />
              <SidebarSubItem label="Pencapaian Penaksir" muted />
              <SidebarSubItem label="Pencapaian Sales Officer" muted />
              <SidebarSubItem label="Pencapaian Sales Agent" muted />
            </div>
          )}
          <NavItem icon={<ClipboardCheck />} label="Pengajuan Event" />
          <NavItem icon={<FileText />} label="Realisasi Event" />
          <NavItem icon={<LogOut />} label="Pengembalian Realisasi" />
          <NavItem icon={<FileText />} label="Riwayat Event" />
          <div className="mt-12">
            <NavItem icon={<LayoutGrid />} label="Ubah Kata Sandi" />
            <NavItem icon={<FileText />} label="Keluar" />
          </div>
        </nav>
      </aside>

      <main
        className={`flex min-h-screen flex-col lg:ml-[256px] ${tab === "Sales Officer" ? "sales-view" : ""} ${tab !== "Kepala KCP" ? "non-kcp-view" : ""} ${canEditTarget ? "" : "target-period-locked"}`}
      >
        <div className="flex-1 mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-12 lg:py-12">
          <div className="flex items-center gap-4 text-[16px] text-slate-500">
            <span>Home</span>
            <span>/</span>
            <strong className="text-slate-900">Pencapaian Tim</strong>
          </div>
          <div className="mt-5">
            <h1 className="text-[32px] font-bold tracking-tight">Target Aktivitas</h1>
          </div>

          <div className="mt-10 flex gap-10 border-b border-slate-200 text-[17px] font-medium">
            <button
              onClick={() => setTab("Kepala KCP")}
              className={`border-b-4 px-1 pb-4 ${tab === "Kepala KCP" ? "border-[#199900] text-[#199900]" : "border-transparent text-slate-500"}`}
            >
              Kepala KCP
            </button>
            <button
              onClick={() => setTab("Penaksir")}
              className={`border-b-4 px-1 pb-4 ${tab === "Penaksir" ? "border-[#199900] text-[#199900]" : "border-transparent text-slate-500"}`}
            >
              Penaksir
            </button>
            <button
              onClick={() => setTab("Sales Officer")}
              className={`border-b-4 px-1 pb-4 ${tab === "Sales Officer" ? "border-[#199900] text-[#199900]" : "border-transparent text-slate-500"}`}
            >
              Sales Officer
            </button>
          </div>

          <section className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7">
              <div>
                <h2 className="text-[25px] font-semibold">Daftar Target Aktivitas</h2>
                <p className="mt-1 text-[14px] text-slate-400">
                  {tab === "Penaksir"
                    ? `${penaksirTargets.length} Data`
                    : `${configured} dari ${targets.length} KCP sudah disetting`}
                </p>
              </div>
              <TargetFilters
                period={period}
                onPeriodChange={setPeriod}
                unit={unit}
                units={(tab === "Penaksir" ? penaksirTargets : targets).map((item) => item.unit)}
                onUnitChange={setUnit}
                showUnit={false}
              />
            </div>
            {tab === "Penaksir" && (
              <PenaksirTable
                targets={penaksirTargets}
                unit={unit}
                onEdit={(item) =>
                  setEdit({
                    unit: item.unit,
                    total: String(item.monthly),
                    monthly: String(item.monthly),
                    weekly: String(item.weekly),
                    daily: String(item.daily),
                    active: item.configured,
                  })
                }
              />
            )}
            <div className={`${tab === "Penaksir" ? "hidden" : ""} overflow-x-auto`}>
              <table className="w-full min-w-[950px] border-collapse text-left">
                <thead className="border-y border-slate-200 text-[14px] text-slate-400">
                  <tr>
                    <th className="px-7 py-5 font-medium">No</th>
                    <th className="px-5 py-5 font-medium">Unit</th>
                    <th className="px-5 py-5 font-medium">Target Bulanan</th>
                    <th className="px-5 py-5 font-medium">Target Mingguan</th>
                    <th className="px-5 py-5 font-medium">Status</th>
                    <th className="px-7 py-5 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item, index) => (
                    <tr key={item.unit} className="border-b border-slate-100 last:border-0">
                      <td className="px-7 py-6">{index + 1}</td>
                      <td className="px-5 py-6 font-medium">{item.unit}</td>
                      <td className="px-5 py-6 font-semibold">{item.monthly}</td>
                      <td className="px-5 py-6">{item.weekly}</td>
                      <td className="px-5 py-6">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[14px] ${item.configured ? "text-green-700" : "text-slate-500"}`}
                        >
                          {item.configured ? (
                            <ShieldCheck className="h-4 w-4" />
                          ) : (
                            <Target className="h-4 w-4" />
                          )}
                          {item.configured ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-7 py-6 text-right">
                        <button
                          onClick={() =>
                            setEdit({
                              unit: item.unit,
                              total: String(item.monthly),
                              monthly: String(item.monthly),
                              weekly: String(item.weekly),
                              daily: String(item.daily),
                              active: item.configured,
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]"
                        >
                          <Pencil className="h-4 w-4" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className={`${tab === "Penaksir" ? "hidden" : ""} flex items-center justify-end gap-5 px-7 py-6 text-[14px] text-slate-400`}
            >
              <span>
                Rows per page: <strong className="ml-2 text-slate-600">10</strong>
              </span>
              <button disabled className="rounded-lg border border-slate-200 p-2">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white">1</span>
              <button className="rounded-lg border border-slate-200 p-2">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-[22px] font-semibold">Visit KACAB</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <VisitCard label="KPI Watch List" value="Belum disetting" />
              <VisitCard label="Grade Audit" value="Belum disetting" />
              <VisitCard label="Operational Score" value="Belum disetting" />
            </div>
          </section>
          {tab === "Sales Officer" && (
            <SalesOfficerKacabTable
              targets={salesTargets}
              period={period}
              onPeriodChange={setPeriod}
              unit={unit}
              onUnitChange={setUnit}
              grade={salesGrade}
              onGradeChange={setSalesGrade}
              onEdit={(item) =>
                setEdit({
                  unit: `${item.unit}::${item.so}`,
                  total: String(item.leadsMonthly),
                  monthly: String(item.leadsMonthly),
                  weekly: String(item.leadsWeekly),
                  daily: String(item.leadsDaily),
                  leadsMonthly: String(item.leadsMonthly),
                  closingMonthly: String(item.closingMonthly),
                  leadsWeekly: String(item.leadsWeekly),
                  closingWeekly: String(item.closingWeekly),
                  leadsDaily: String(item.leadsDaily),
                  closingDaily: String(item.closingDaily),
                  active: item.configured,
                })
              }
            />
          )}
        </div>
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-8 text-[14px] text-slate-500 lg:px-12">
          2021 © Sales Tracking. All rights reserved.
        </footer>
      </main>
      {edit &&
        (tab === "Sales Officer" ? (
          <SalesEditModalFlowKacabNoGram edit={edit} setEdit={setEdit} onSave={saveTarget} />
        ) : (
          <EditModalFlow
            edit={edit}
            setEdit={setEdit}
            onSave={saveTarget}
            includeDaily={tab === "Penaksir"}
          />
        ))}
      {successUnit && <SuccessModalFlow unit={successUnit} onClose={() => setSuccessUnit(null)} />}
    </div>
  );
}

function SalesOfficerKacabTable({
  targets,
  period,
  onPeriodChange,
  unit,
  onUnitChange,
  grade,
  onGradeChange,
  onEdit,
}: {
  targets: SalesOfficerTarget[];
  period: string;
  onPeriodChange: (value: string) => void;
  unit: string;
  onUnitChange: (value: string) => void;
  grade: string;
  onGradeChange: (value: string) => void;
  onEdit: (item: SalesOfficerTarget) => void;
}) {
  const visible = targets.filter((item) => grade === "Semua Grade" || item.so === grade);
  return (
    <section className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7">
        <div>
          <h2 className="text-[25px] font-semibold">Daftar Target Aktivitas</h2>
          <p className="mt-1 text-[14px] text-slate-400">{visible.length} Data</p>
        </div>
        <TargetFilters
          period={period}
          onPeriodChange={onPeriodChange}
          unit={unit}
          units={targets.map((item) => item.unit)}
          onUnitChange={onUnitChange}
          grade={grade}
          grades={[...new Set(targets.map((item) => item.so))]}
          onGradeChange={onGradeChange}
          showUnit={false}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1500px] border-collapse text-left">
          <thead className="border-y border-slate-200 bg-white text-[14px] text-slate-400">
            <tr>
              <th className="whitespace-nowrap px-5 py-5 font-medium">No</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Name</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Grade</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Unit</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Leads Bulanan</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Closing Bulanan</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Leads Mingguan</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Closing Mingguan</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Leads Harian</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Closing Harian</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Status</th>
              <th className="sticky right-0 whitespace-nowrap bg-white px-5 py-5 font-medium shadow-[-8px_0_12px_rgba(23,24,45,0.06)]">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item, index) => (
              <tr
                key={`${item.unit}-${item.so}-${item.salesName}`}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="whitespace-nowrap px-5 py-6">{index + 1}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.salesName}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.so}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.unit}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.leadsMonthly}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.closingMonthly}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.leadsWeekly}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.closingWeekly}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.leadsDaily}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.closingDaily}</td>
                <td className="whitespace-nowrap px-5 py-6">
                  <span
                    className={`inline-flex items-center gap-2 text-[14px] font-medium ${item.configured ? "text-[#0a7d2c]" : "text-slate-500"}`}
                  >
                    {item.configured ? (
                      <CircleCheck className="h-5 w-5" />
                    ) : (
                      <Ban className="h-5 w-5" />
                    )}
                    {item.configured ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="sticky right-0 whitespace-nowrap bg-white px-5 py-6 shadow-[-8px_0_12px_rgba(23,24,45,0.06)]">
                  <button
                    onClick={() => onEdit(item)}
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
          <span className="rounded-lg bg-[#199900] px-3 py-2 font-semibold text-white">1</span>
          <button className="rounded-lg border border-slate-200 p-2 opacity-50">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function SalesSection({
  targets,
  period,
  onPeriodChange,
  unit,
  onUnitChange,
  onEdit,
}: {
  targets: SalesOfficerTarget[];
  period: string;
  onPeriodChange: (value: string) => void;
  unit: string;
  onUnitChange: (value: string) => void;
  onEdit: (item: SalesOfficerTarget) => void;
}) {
  const visible = unit === "Semua Unit" ? targets : targets.filter((item) => item.unit === unit);
  return (
    <section className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7">
        <div>
          <h2 className="text-[25px] font-semibold">Daftar Target Aktivitas</h2>
          <p className="mt-1 text-[14px] text-slate-400">{targets.length} Data</p>
        </div>
        <TargetFilters
          period={period}
          onPeriodChange={onPeriodChange}
          unit={unit}
          units={targets.map((item) => item.unit)}
          onUnitChange={onUnitChange}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1320px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[64px]" />
            <col className="w-[150px]" />
            <col className="w-[190px]" />
            <col className="w-[150px]" />
            <col className="w-[150px]" />
            <col className="w-[150px]" />
            <col className="w-[190px]" />
            <col className="w-[110px]" />
            <col className="w-[150px]" />
            <col className="w-[120px]" />
          </colgroup>
          <thead className="border-y border-slate-200 text-[14px] text-slate-400">
            <tr>
              <th className="whitespace-nowrap px-5 py-5 font-medium">No</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">SO</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Unit</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Total Activity</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Weekly Activity</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Daily Activity</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">ADO</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Gram</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Status</th>
              <th className="whitespace-nowrap px-5 py-5 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item, index) => (
              <tr
                key={`${item.unit}-${item.so}`}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="whitespace-nowrap px-5 py-7">{index + 1}</td>
                <td className="whitespace-nowrap px-5 py-7 font-medium">{item.so}</td>
                <td className="whitespace-nowrap px-5 py-7">{item.unit}</td>
                <td className="whitespace-nowrap px-5 py-7 font-semibold">{item.total}</td>
                <td className="whitespace-nowrap px-5 py-7">{item.weekly}</td>
                <td className="whitespace-nowrap px-5 py-7">{item.daily}</td>
                <td className="whitespace-nowrap px-5 py-7">{item.booking}</td>
                <td className="whitespace-nowrap px-5 py-7">{item.gram}</td>
                <td
                  className={`whitespace-nowrap px-5 py-7 text-[14px] ${item.configured ? "text-green-700" : "text-slate-500"}`}
                >
                  {item.configured ? "Active" : "Inactive"}
                </td>
                <td className="whitespace-nowrap px-5 py-7 text-right">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-5 px-7 py-6 text-[14px] text-slate-400">
        <span>
          Rows per page: <strong className="ml-2 text-slate-600">10</strong>
        </span>
        <button disabled className="rounded-lg border border-slate-200 p-2">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white">1</span>
        <button className="rounded-lg border border-slate-200 p-2">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function SalesSectionLegacy2({
  targets,
  period,
  onPeriodChange,
  unit,
  onUnitChange,
  onEdit,
}: {
  targets: SalesOfficerTarget[];
  period: string;
  onPeriodChange: (value: string) => void;
  unit: string;
  onUnitChange: (value: string) => void;
  onEdit: (item: SalesOfficerTarget) => void;
}) {
  const visible = unit === "Semua Unit" ? targets : targets.filter((item) => item.unit === unit);
  return (
    <section className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7">
        <div>
          <h2 className="text-[25px] font-semibold">Daftar Target Aktivitas</h2>
          <p className="mt-1 text-[14px] text-slate-400">{targets.length} Data</p>
        </div>
        <TargetFilters
          period={period}
          onPeriodChange={onPeriodChange}
          unit={unit}
          units={targets.map((item) => item.unit)}
          onUnitChange={onUnitChange}
        />
      </div>
      <div className="overflow-x-auto px-5">
        <table className="w-full min-w-[1320px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[64px]" />
            <col className="w-[190px]" />
            <col className="w-[260px]" />
            <col className="w-[120px]" />
            <col className="w-[170px]" />
            <col className="w-[170px]" />
            <col className="w-[150px]" />
            <col className="w-[140px]" />
            <col className="w-[120px]" />
          </colgroup>
          <thead className="border-y border-slate-200 text-[14px] text-slate-400">
            <tr>
              <th className="whitespace-nowrap px-5 py-5 font-medium">No</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Unit</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Total Activity/Booking</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">ADO</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Gram (New CIF)</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Weekly Activity</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Daily Activity</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Status</th>
              <th className="whitespace-nowrap px-5 py-5 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item, index) => (
              <tr key={item.unit} className="border-b border-slate-100 last:border-0">
                <td className="whitespace-nowrap px-5 py-7">{index + 1}</td>
                <td className="whitespace-nowrap px-5 py-7 font-medium">{item.unit}</td>
                <td className="whitespace-nowrap px-5 py-7 font-semibold">
                  {item.total}/{item.booking}
                </td>
                <td className="whitespace-nowrap px-5 py-7">{item.ado}</td>
                <td className="whitespace-nowrap px-5 py-7">{item.gram}</td>
                <td className="whitespace-nowrap px-5 py-7">{item.weekly}</td>
                <td className="whitespace-nowrap px-5 py-7">{item.daily}</td>
                <td
                  className={`whitespace-nowrap px-5 py-7 text-[14px] ${item.configured ? "text-green-700" : "text-slate-500"}`}
                >
                  {item.configured ? "Active" : "Inactive"}
                </td>
                <td className="whitespace-nowrap px-5 py-7 text-right">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-5 px-7 py-6 text-[14px] text-slate-400">
        <span>
          Rows per page: <strong className="ml-2 text-slate-600">10</strong>
        </span>
        <button disabled className="rounded-lg border border-slate-200 p-2">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white">1</span>
        <button className="rounded-lg border border-slate-200 p-2">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function SalesSectionLegacy({
  targets,
  period,
  onPeriodChange,
  unit,
  onUnitChange,
  onEdit,
}: {
  targets: SalesOfficerTarget[];
  period: string;
  onPeriodChange: (value: string) => void;
  unit: string;
  onUnitChange: (value: string) => void;
  onEdit: (item: SalesOfficerTarget) => void;
}) {
  const visible = unit === "Semua Unit" ? targets : targets.filter((item) => item.unit === unit);
  return (
    <section className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7">
        <div>
          <h2 className="text-[25px] font-semibold">Daftar Target Aktivitas</h2>
          <p className="mt-1 text-[14px] text-slate-400">{targets.length} Data</p>
        </div>
        <TargetFilters
          period={period}
          onPeriodChange={onPeriodChange}
          unit={unit}
          units={targets.map((item) => item.unit)}
          onUnitChange={onUnitChange}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left">
          <thead className="border-y border-slate-200 text-[14px] text-slate-400">
            <tr>
              <th className="whitespace-nowrap px-7 py-5 font-medium">No</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Unit</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Total Activity/Booking</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">ADO</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Gram (New CIF)</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Weekly Activity</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Daily Activity</th>
              <th className="whitespace-nowrap px-5 py-5 font-medium">Status</th>
              <th className="whitespace-nowrap px-7 py-5 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item, index) => (
              <tr key={item.unit} className="border-b border-slate-100 last:border-0">
                <td className="whitespace-nowrap px-7 py-6">{index + 1}</td>
                <td className="whitespace-nowrap px-5 py-6 font-medium">{item.unit}</td>
                <td className="whitespace-nowrap px-5 py-6 font-semibold">
                  {item.total}/{item.booking}
                </td>
                <td className="whitespace-nowrap px-5 py-6">{item.ado}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.gram}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.weekly}</td>
                <td className="whitespace-nowrap px-5 py-6">{item.daily}</td>
                <td
                  className={`whitespace-nowrap px-5 py-6 text-[14px] ${item.configured ? "text-green-700" : "text-slate-500"}`}
                >
                  {item.configured ? "Active" : "Inactive"}
                </td>
                <td className="whitespace-nowrap px-7 py-6 text-right">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-5 px-7 py-6 text-[14px] text-slate-400">
        <span>
          Rows per page: <strong className="ml-2 text-slate-600">10</strong>
        </span>
        <button disabled className="rounded-lg border border-slate-200 p-2">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white">1</span>
        <button className="rounded-lg border border-slate-200 p-2">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function LegacySalesSection({
  targets,
  period,
  onPeriodChange,
  unit,
  onUnitChange,
  onEdit,
}: {
  targets: SalesOfficerTarget[];
  period: string;
  onPeriodChange: (value: string) => void;
  unit: string;
  onUnitChange: (value: string) => void;
  onEdit: (item: SalesOfficerTarget) => void;
}) {
  const visible = unit === "Semua Unit" ? targets : targets.filter((item) => item.unit === unit);
  return (
    <section className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-5 px-7 py-7">
        <div>
          <h2 className="text-[25px] font-semibold">Daftar Target Aktivitas</h2>
          <p className="mt-1 text-[14px] text-slate-400">{targets.length} Data</p>
        </div>
        <TargetFilters
          period={period}
          onPeriodChange={onPeriodChange}
          unit={unit}
          units={targets.map((item) => item.unit)}
          onUnitChange={onUnitChange}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead className="border-y border-slate-200 text-[14px] text-slate-400">
            <tr>
              <th className="px-7 py-5 font-medium">No</th>
              <th className="px-5 py-5 font-medium">Unit</th>
              <th className="px-5 py-5 font-medium">Grade</th>
              <th className="px-5 py-5 font-medium">Total Activity/Booking</th>
              <th className="px-5 py-5 font-medium">ADO</th>
              <th className="px-5 py-5 font-medium">Gram (New CIF)</th>
              <th className="px-5 py-5 font-medium">Weekly Activity</th>
              <th className="px-5 py-5 font-medium">Daily Activity</th>
              <th className="px-5 py-5 font-medium">Status</th>
              <th className="px-7 py-5 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item, index) => (
              <tr key={item.unit} className="border-b border-slate-100 last:border-0">
                <td className="px-7 py-6">{index + 1}</td>
                <td className="px-5 py-6 font-medium">{item.unit}</td>
                <td className="px-5 py-6">{item.grade}</td>
                <td className="px-5 py-6 font-semibold">
                  {item.total}/{item.booking}
                </td>
                <td className="px-5 py-6">{item.ado}</td>
                <td className="px-5 py-6">{item.gram}</td>
                <td className="px-5 py-6">{item.weekly}</td>
                <td className="px-5 py-6">{item.daily}</td>
                <td
                  className={`px-5 py-6 text-[14px] ${item.configured ? "text-green-700" : "text-slate-500"}`}
                >
                  {item.configured ? "Active" : "Inactive"}
                </td>
                <td className="px-7 py-6 text-right">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-5 px-7 py-6 text-[14px] text-slate-400">
        <span>
          Rows per page: <strong className="ml-2 text-slate-600">10</strong>
        </span>
        <button disabled className="rounded-lg border border-slate-200 p-2">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white">1</span>
        <button className="rounded-lg border border-slate-200 p-2">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

function PenaksirTable({
  targets,
  unit,
  onEdit,
}: {
  targets: PenaksirTarget[];
  unit: string;
  onEdit: (item: PenaksirTarget) => void;
}) {
  const visible = targets;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] border-collapse text-left">
        <thead className="border-y border-slate-200 text-[14px] text-slate-400">
          <tr>
            <th className="whitespace-nowrap px-7 py-5 font-medium">No</th>
            <th className="whitespace-nowrap px-5 py-5 font-medium">Unit</th>
            <th className="whitespace-nowrap px-5 py-5 font-medium">Target Bulanan</th>
            <th className="whitespace-nowrap px-5 py-5 font-medium">Target Mingguan</th>
            <th className="whitespace-nowrap px-5 py-5 font-medium">Target Harian</th>
            <th className="whitespace-nowrap px-5 py-5 font-medium">Status</th>
            <th className="whitespace-nowrap px-7 py-5 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item, index) => (
            <tr key={item.unit} className="border-b border-slate-100 last:border-0">
              <td className="whitespace-nowrap px-7 py-6">{index + 1}</td>
              <td className="whitespace-nowrap px-5 py-6 font-medium">{item.unit}</td>
              <td className="whitespace-nowrap px-5 py-6 font-semibold">{item.monthly}</td>
              <td className="whitespace-nowrap px-5 py-6">{item.weekly}</td>
              <td className="whitespace-nowrap px-5 py-6">{item.daily}</td>
              <td
                className={`whitespace-nowrap px-5 py-6 text-[14px] ${item.configured ? "text-green-700" : "text-slate-500"}`}
              >
                {item.configured ? "Active" : "Inactive"}
              </td>
              <td className="whitespace-nowrap px-7 py-6 text-right">
                <button
                  onClick={() => onEdit(item)}
                  className="rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-end gap-5 px-7 py-6 text-[14px] text-slate-400">
        <span>
          Rows per page: <strong className="ml-2 text-slate-600">10</strong>
        </span>
        <button disabled className="rounded-lg border border-slate-200 p-2">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white">1</span>
        <button className="rounded-lg border border-slate-200 p-2">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function LegacyPenaksirTableUnused({
  targets,
  unit,
  onEdit,
}: {
  targets: PenaksirTarget[];
  unit: string;
  onEdit: (item: PenaksirTarget) => void;
}) {
  const visible = unit === "Semua Unit" ? targets : targets.filter((item) => item.unit === unit);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] border-collapse text-left">
        <thead className="border-y border-slate-200 text-[14px] text-slate-400">
          <tr>
            <th className="px-7 py-5 font-medium">No</th>
            <th className="px-5 py-5 font-medium">Unit</th>
            <th className="px-5 py-5 font-medium">Grade</th>
            <th className="px-5 py-5 font-medium">Total Activity</th>
            <th className="px-5 py-5 font-medium">Weekly Activity</th>
            <th className="px-5 py-5 font-medium">Daily Activity</th>
            <th className="px-5 py-5 font-medium">Status</th>
            <th className="px-7 py-5 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item, index) => (
            <tr key={item.unit} className="border-b border-slate-100 last:border-0">
              <td className="px-7 py-6">{index + 1}</td>
              <td className="px-5 py-6 font-medium">{item.unit}</td>
              <td className="px-5 py-6">{item.grade}</td>
              <td className="px-5 py-6 font-semibold">{item.total}</td>
              <td className="px-5 py-6">{item.weekly}</td>
              <td className="px-5 py-6">{item.daily}</td>
              <td
                className={`px-5 py-6 text-[14px] ${item.configured ? "text-green-700" : "text-slate-500"}`}
              >
                {item.configured ? "Active" : "Inactive"}
              </td>
              <td className="px-7 py-6 text-right">
                <button
                  onClick={() => onEdit(item)}
                  className="rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-end gap-5 px-7 py-6 text-[14px] text-slate-400">
        <span>
          Rows per page: <strong className="ml-2 text-slate-600">10</strong>
        </span>
        <button disabled className="rounded-lg border border-slate-200 p-2">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white">1</span>
        <button className="rounded-lg border border-slate-200 p-2">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function LegacyPenaksirTable({
  targets,
  unit,
  onEdit,
}: {
  targets: PenaksirTarget[];
  unit: string;
  onEdit: (item: PenaksirTarget) => void;
}) {
  const visible = unit === "Semua Unit" ? targets : targets.filter((item) => item.unit === unit);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] border-collapse text-left">
        <thead className="border-y border-slate-200 text-[14px] text-slate-400">
          <tr>
            <th className="px-7 py-5 font-medium">No</th>
            <th className="px-5 py-5 font-medium">Unit</th>
            <th className="px-5 py-5 font-medium">Grade</th>
            <th className="px-5 py-5 font-medium">Total Activity</th>
            <th className="px-5 py-5 font-medium">Weekly Activity</th>
            <th className="px-5 py-5 font-medium">Daily Activity</th>
            <th className="px-7 py-5 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((item, index) => (
            <tr key={item.unit} className="border-b border-slate-100 last:border-0">
              <td className="px-7 py-6">{index + 1}</td>
              <td className="px-5 py-6 font-medium">{item.unit}</td>
              <td className="px-5 py-6">{item.grade}</td>
              <td className="px-5 py-6 font-semibold">{item.total}</td>
              <td className="px-5 py-6">{item.weekly}</td>
              <td className="px-5 py-6">{item.daily}</td>
              <td className="px-7 py-6 text-right">
                <button
                  onClick={() => onEdit(item)}
                  className="rounded-lg border border-[#292663] px-5 py-2.5 text-[14px] font-medium text-[#292663]"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-end gap-5 px-7 py-6 text-[14px] text-slate-400">
        <span>
          Rows per page: <strong className="ml-2 text-slate-600">10</strong>
        </span>
        <button disabled className="rounded-lg border border-slate-200 p-2">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="rounded-lg bg-green-600 px-3 py-2 font-semibold text-white">1</span>
        <button className="rounded-lg border border-slate-200 p-2">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function NavItem({
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
function SidebarSubItem({
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
function VisitCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-[14px] text-slate-500">{label}</p>
      <p className="mt-3 text-[20px] font-semibold text-amber-700">{value}</p>
      <p className="mt-1 text-[13px] text-slate-400">Atur melalui menu konfigurasi visit KACAB.</p>
    </div>
  );
}
function targetValidationError(edit: EditTarget, includeDaily: boolean) {
  const monthly = Number(edit.monthly ?? edit.total) || 0;
  const weekly = Number(edit.weekly) || 0;
  const daily = Number(edit.daily) || 0;
  const leads = Number(edit.leads) || 0;
  const closingLeads = Number(edit.closingLeads) || 0;
  if (weekly > monthly) return "Target mingguan tidak boleh lebih besar dari target bulanan.";
  if (includeDaily && daily > weekly)
    return "Target harian tidak boleh lebih besar dari target mingguan.";
  if (edit.leads !== undefined && closingLeads > leads)
    return "Closing Leads tidak boleh lebih besar dari Leads.";
  return "";
}
function salesLeadsValidationError(edit: EditTarget) {
  const leadsMonthly = Number(edit.leadsMonthly) || 0;
  const leadsWeekly = Number(edit.leadsWeekly) || 0;
  const leadsDaily = Number(edit.leadsDaily) || 0;
  const closingMonthly = Number(edit.closingMonthly) || 0;
  const closingWeekly = Number(edit.closingWeekly) || 0;
  const closingDaily = Number(edit.closingDaily) || 0;
  if (leadsWeekly > leadsMonthly)
    return "Leads Mingguan tidak boleh lebih besar dari Leads Bulanan.";
  if (leadsDaily > leadsWeekly) return "Leads Harian tidak boleh lebih besar dari Leads Mingguan.";
  if (closingWeekly > closingMonthly)
    return "Closing Mingguan tidak boleh lebih besar dari Closing Bulanan.";
  if (closingDaily > closingWeekly)
    return "Closing Harian tidak boleh lebih besar dari Closing Mingguan.";
  const pairs: Array<[string | undefined, string | undefined, string]> = [
    [edit.leadsMonthly, edit.closingMonthly, "Bulanan"],
    [edit.leadsWeekly, edit.closingWeekly, "Mingguan"],
    [edit.leadsDaily, edit.closingDaily, "Harian"],
  ];
  for (const [leads, closing, label] of pairs) {
    if (leads !== undefined && closing !== undefined && Number(closing) > Number(leads)) {
      return `Closing ${label} tidak boleh lebih besar dari Leads ${label}.`;
    }
  }
  return "";
}
function SalesEditModalFlowKacabNoGram({
  edit,
  setEdit,
  onSave,
}: {
  edit: EditTarget;
  setEdit: (value: EditTarget | null) => void;
  onSave: () => void;
}) {
  const [step, setStep] = useState<"form" | "confirm">("form");
  const validationError = salesLeadsValidationError(edit);
  if (step === "confirm")
    return <ConfirmTargetModal onCancel={() => setStep("form")} onConfirm={onSave} />;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="relative max-h-[calc(100vh-32px)] w-full max-w-[620px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
          <h2 className="text-[24px] font-bold">Edit Target Sales Officer</h2>
          <button onClick={() => setEdit(null)} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        <div className="max-h-[calc(100vh-220px)] space-y-4 overflow-y-auto px-8 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Leads Bulanan"
              required
              value={edit.leadsMonthly ?? ""}
              onChange={(value) => setEdit({ ...edit, leadsMonthly: value })}
            />
            <Input
              label="Closing Bulanan"
              required
              value={edit.closingMonthly ?? ""}
              onChange={(value) => setEdit({ ...edit, closingMonthly: value })}
            />
            <Input
              label="Leads Mingguan"
              required
              value={edit.leadsWeekly ?? ""}
              onChange={(value) => setEdit({ ...edit, leadsWeekly: value })}
            />
            <Input
              label="Closing Mingguan"
              required
              value={edit.closingWeekly ?? ""}
              onChange={(value) => setEdit({ ...edit, closingWeekly: value })}
            />
            <Input
              label="Leads Harian"
              required
              value={edit.leadsDaily ?? ""}
              onChange={(value) => setEdit({ ...edit, leadsDaily: value })}
            />
            <Input
              label="Closing Harian"
              required
              value={edit.closingDaily ?? ""}
              onChange={(value) => setEdit({ ...edit, closingDaily: value })}
            />
          </div>
          {validationError && (
            <p className="text-[13px] font-medium text-red-600">{validationError}</p>
          )}
          <StatusFields active={edit.active} onChange={(active) => setEdit({ ...edit, active })} />
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 px-8 py-4">
          <button
            onClick={() => setEdit(null)}
            className="rounded-lg border-2 border-[#199900] px-5 py-2.5 text-[14px] font-medium text-[#199900]"
          >
            Batalkan
          </button>
          <button
            onClick={() => setStep("confirm")}
            disabled={Boolean(validationError)}
            className="rounded-lg bg-[#199900] px-6 py-2.5 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
function SalesEditModalFlowKacab({
  edit,
  setEdit,
  onSave,
}: {
  edit: EditTarget;
  setEdit: (value: EditTarget | null) => void;
  onSave: () => void;
}) {
  const [step, setStep] = useState<"form" | "confirm">("form");
  if (step === "confirm")
    return <ConfirmTargetModal onCancel={() => setStep("form")} onConfirm={onSave} />;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="relative max-h-[calc(100vh-32px)] w-full max-w-[620px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
          <h2 className="text-[24px] font-bold">Edit Target Sales Officer</h2>
          <button onClick={() => setEdit(null)} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        <div className="space-y-4 px-8 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Total Activity"
              required
              value={edit.total}
              onChange={(value) => setEdit({ ...edit, total: value })}
            />
            <Input
              label="Gram (New CIF)"
              required
              value={edit.gram ?? ""}
              onChange={(value) => setEdit({ ...edit, gram: value })}
            />
            <Input
              label="Weekly Activity"
              required
              value={edit.weekly}
              onChange={(value) => setEdit({ ...edit, weekly: value })}
            />
            <Input
              label="Daily Activity"
              required
              value={edit.daily}
              onChange={(value) => setEdit({ ...edit, daily: value })}
            />
          </div>
          <StatusFields active={edit.active} onChange={(active) => setEdit({ ...edit, active })} />
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 px-8 py-4">
          <button
            onClick={() => setEdit(null)}
            className="rounded-lg border-2 border-[#199900] px-5 py-2.5 text-[14px] font-medium text-[#199900]"
          >
            Batalkan
          </button>
          <button
            onClick={() => setStep("confirm")}
            className="rounded-lg bg-[#199900] px-6 py-2.5 text-[14px] font-semibold text-white"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
function SalesEditModalFlow({
  edit,
  setEdit,
  onSave,
}: {
  edit: EditTarget;
  setEdit: (value: EditTarget | null) => void;
  onSave: () => void;
}) {
  const [step, setStep] = useState<"form" | "confirm">("form");
  if (step === "confirm")
    return <ConfirmTargetModal onCancel={() => setStep("form")} onConfirm={onSave} />;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="relative max-h-[calc(100vh-32px)] w-full max-w-[620px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5">
          <h2 className="text-[24px] font-bold">Edit Target Sales Officer</h2>
          <button onClick={() => setEdit(null)} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        <div className="space-y-4 px-8 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Total Activity"
              required
              value={edit.total}
              onChange={(value) => setEdit({ ...edit, total: value })}
            />
            <Input
              label="ADO"
              required
              value={edit.ado ?? ""}
              onChange={(value) => setEdit({ ...edit, ado: value })}
            />
            <Input
              label="Gram (New CIF)"
              required
              value={edit.gram ?? ""}
              onChange={(value) => setEdit({ ...edit, gram: value })}
            />
            <Input
              label="Weekly Activity"
              required
              value={edit.weekly}
              onChange={(value) => setEdit({ ...edit, weekly: value })}
            />
          </div>
          <Input
            label="Daily Activity"
            required
            value={edit.daily}
            onChange={(value) => setEdit({ ...edit, daily: value })}
          />
          <StatusFields active={edit.active} onChange={(active) => setEdit({ ...edit, active })} />
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 px-8 py-4">
          <button
            onClick={() => setEdit(null)}
            className="rounded-lg border-2 border-[#199900] px-5 py-2.5 text-[14px] font-medium text-[#199900]"
          >
            Batalkan
          </button>
          <button
            onClick={() => setStep("confirm")}
            className="rounded-lg bg-[#199900] px-6 py-2.5 text-[14px] font-semibold text-white"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmTargetModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[500px] rounded-2xl bg-white px-8 py-8 text-center shadow-2xl">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[44px] leading-none text-emerald-600">
          ✓
        </span>
        <h2 className="mt-6 text-[25px] font-semibold text-[#17182d]">Simpan perubahan target?</h2>
        <p className="mx-auto mt-3 max-w-[390px] text-[17px] leading-6 text-slate-600">
          Target aktivitas akan diperbarui. Pastikan angka dan status sudah sesuai.
        </p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border-2 border-[#199900] px-5 py-3 text-[17px] font-medium text-[#199900]"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[#199900] px-5 py-3 text-[17px] font-semibold text-white"
          >
            Ya, Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusFields({
  active,
  onChange,
}: {
  active: boolean;
  onChange: (active: boolean) => void;
}) {
  return (
    <div>
      <p className="text-[14px] font-medium text-slate-700">
        Status<span className="text-red-500">*</span>
      </p>
      <div className="mt-1.5 grid gap-2 md:grid-cols-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-[14px] ${active ? "border-2 border-[#199900] text-[#199900]" : "border-slate-200 text-slate-600"}`}
        >
          <span
            className={`h-5 w-5 rounded-full border-2 ${active ? "border-[#199900]" : "border-slate-400"}`}
          >
            {active && (
              <span className="mx-auto mt-0.5 block h-2.5 w-2.5 rounded-full bg-[#199900]" />
            )}
          </span>
          Active
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-[14px] ${!active ? "border-2 border-slate-500 text-slate-700" : "border-slate-200 text-slate-600"}`}
        >
          <span
            className={`h-5 w-5 rounded-full border-2 ${!active ? "border-slate-500" : "border-slate-400"}`}
          >
            {!active && (
              <span className="mx-auto mt-0.5 block h-2.5 w-2.5 rounded-full bg-slate-500" />
            )}
          </span>
          Inactive
        </button>
      </div>
    </div>
  );
}

function EditModalFlow({
  edit,
  setEdit,
  onSave,
  includeDaily,
}: {
  edit: EditTarget;
  setEdit: (value: EditTarget | null) => void;
  onSave: () => void;
  includeDaily: boolean;
}) {
  const [step, setStep] = useState<"form" | "confirm">("form");
  const validationError = targetValidationError(edit, includeDaily);
  if (step === "confirm") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
        <div className="w-full max-w-[500px] rounded-2xl bg-white px-8 py-8 text-center shadow-2xl">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[44px] leading-none text-emerald-600">
            ✓
          </span>
          <h2 className="mt-6 text-[25px] font-semibold text-[#17182d]">
            Simpan perubahan target?
          </h2>
          <p className="mx-auto mt-3 max-w-[390px] text-[17px] leading-6 text-slate-600">
            Target aktivitas akan diperbarui. Pastikan angka dan status sudah sesuai.
          </p>
          <div className="mt-8 flex gap-3">
            <button
              onClick={() => setStep("form")}
              className="flex-1 rounded-xl border-2 border-[#199900] px-5 py-3 text-[17px] font-medium text-[#199900]"
            >
              Batal
            </button>
            <button
              onClick={onSave}
              className="flex-1 rounded-xl bg-[#199900] px-5 py-3 text-[17px] font-semibold text-white"
            >
              Ya, Simpan
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="relative h-[371px] max-h-[calc(100vh-32px)] w-full max-w-[500px] overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-4">
          <h2 className="text-[24px] font-bold">Edit Target Aktivitas</h2>
          <button onClick={() => setEdit(null)} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        <div className="space-y-2 overflow-y-auto px-8 py-4 pb-16">
          <div className="grid gap-2 md:grid-cols-2">
            <Input
              label="Target Bulanan"
              required
              value={edit.monthly ?? edit.total}
              onChange={(value) => setEdit({ ...edit, total: value, monthly: value })}
            />
            <Input
              label="Weekly Activity"
              required
              value={edit.weekly}
              onChange={(value) => setEdit({ ...edit, weekly: value })}
            />
          </div>
          {includeDaily && (
            <Input
              label="Target Harian"
              required
              value={edit.daily}
              onChange={(value) => setEdit({ ...edit, daily: value })}
            />
          )}
          {validationError && (
            <p className="text-[13px] font-medium text-red-600">{validationError}</p>
          )}
          <div>
            <p className="text-[16px] font-medium text-slate-700">
              Status<span className="text-red-500">*</span>
            </p>
            <div className="mt-1 grid gap-2 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setEdit({ ...edit, active: true })}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-left text-[14px] ${edit.active ? "border-2 border-[#199900] text-[#199900]" : "border-slate-200 text-slate-600"}`}
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
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-left text-[14px] ${!edit.active ? "border-2 border-slate-500 text-slate-700" : "border-slate-200 text-slate-600"}`}
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
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-8 py-3">
          <button
            onClick={() => setEdit(null)}
            className="rounded-lg border-2 border-[#199900] px-5 py-2 text-[14px] font-medium text-[#199900]"
          >
            Batalkan
          </button>
          <button
            onClick={() => setStep("confirm")}
            disabled={Boolean(validationError)}
            className="rounded-lg bg-[#199900] px-6 py-2 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({
  edit,
  setEdit,
  onSave,
}: {
  edit: EditTarget;
  setEdit: (value: EditTarget | null) => void;
  onSave: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div className="relative h-[371px] max-h-[calc(100vh-32px)] w-full max-w-[500px] overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-4">
          <h2 className="text-[24px] font-bold">Edit Target Aktivitas</h2>
          <button onClick={() => setEdit(null)} aria-label="Tutup">
            <X className="h-6 w-6 text-slate-500" />
          </button>
        </div>
        <div className="space-y-2 overflow-y-auto px-8 py-4 pb-16">
          <div className="grid gap-2 md:grid-cols-2">
            <Input
              label="Total Activity"
              required
              value={edit.total}
              onChange={(value) => setEdit({ ...edit, total: value })}
            />
            <Input
              label="Weekly Activity"
              required
              value={edit.weekly}
              onChange={(value) => setEdit({ ...edit, weekly: value })}
            />
          </div>
          <Input
            label="Daily Activity"
            required
            value={edit.daily}
            onChange={(value) => setEdit({ ...edit, daily: value })}
          />
          <div>
            <p className="text-[16px] font-medium text-slate-700">
              Status<span className="text-red-500">*</span>
            </p>
            <div className="mt-1 grid gap-2 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setEdit({ ...edit, active: true })}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-left text-[14px] ${edit.active ? "border-2 border-[#199900] text-[#199900]" : "border-slate-200 text-slate-600"}`}
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
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-left text-[14px] ${!edit.active ? "border-2 border-slate-500 text-slate-700" : "border-slate-200 text-slate-600"}`}
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
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-8 py-3">
          <button
            onClick={() => setEdit(null)}
            className="rounded-lg border-2 border-[#199900] px-5 py-2 text-[14px] font-medium text-[#199900]"
          >
            Batalkan
          </button>
          <button
            onClick={() => setConfirming(true)}
            className="rounded-lg bg-[#199900] px-6 py-2 text-[14px] font-semibold text-white"
          >
            Simpan
          </button>
        </div>
        {confirming && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 p-5">
            <div className="w-full max-w-[360px] rounded-xl bg-white p-5 shadow-xl">
              <h3 className="text-[17px] font-bold">Simpan perubahan target?</h3>
              <p className="mt-2 text-[13px] leading-5 text-slate-500">
                Target aktivitas {edit.unit} akan diperbarui. Pastikan angka dan status sudah
                sesuai.
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setConfirming(false)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-[13px]"
                >
                  Kembali Edit
                </button>
                <button
                  onClick={onSave}
                  className="rounded-lg bg-[#199900] px-3 py-2 text-[13px] font-semibold text-white"
                >
                  Ya, Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SuccessModalFlow({ unit, onClose }: { unit: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[500px] rounded-2xl bg-white px-8 py-8 text-center shadow-2xl">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-[44px] leading-none text-emerald-600">
          ✓
        </span>
        <h2 className="mt-6 text-[25px] font-semibold text-[#17182d]">
          Target Aktivitas Berhasil Diperbarui
        </h2>
        <p className="mx-auto mt-3 max-w-[390px] text-[17px] leading-6 text-slate-600">
          Detail target aktivitas telah tersimpan dan dapat dilihat kembali.
        </p>
        <button
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-[#199900] px-5 py-3 text-[17px] font-semibold text-white"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}
function formatRupiahInput(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("id-ID") : "";
}
function parseRupiah(value: string | undefined) {
  return Number((value ?? "").replace(/\D/g, "")) || 0;
}
function Input({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const isRupiah = label === "ADO";
  return (
    <label className="block text-[14px] font-medium text-slate-700">
      {label}
      {required && <span className="text-red-500">*</span>}
      <input
        type={isRupiah ? "text" : "number"}
        inputMode={isRupiah ? "numeric" : undefined}
        min="0"
        value={isRupiah ? formatRupiahInput(value) : value}
        onChange={(event) =>
          onChange(isRupiah ? formatRupiahInput(event.target.value) : event.target.value)
        }
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] outline-none focus:border-[#199900]"
      />
    </label>
  );
}
