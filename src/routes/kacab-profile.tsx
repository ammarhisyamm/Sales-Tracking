import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { Building2, ChevronRight, UserRound } from "lucide-react";

export const Route = createFileRoute("/kacab-profile")({
  head: () => ({ meta: [{ title: "Profil KACAB" }] }),
  component: KacabProfile,
});

function KacabProfile() {
  return (
    <MobileShell role="kacab" hideFab>
      <header className="bg-background px-5 pb-5 pt-12">
        <h1 className="text-[22px] font-bold text-slate-900">Profil</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">Informasi akun dan unit kerja</p>
      </header>
      <main className="space-y-3 bg-background px-5 pb-8">
        <div className="flex items-center gap-3 rounded-xl bg-[#2953A4] p-4 text-white">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20"><UserRound className="h-6 w-6" /></span>
          <div><p className="font-bold">KACAB</p><p className="text-[13px] text-white/75">MAS Monang-Maning</p></div>
        </div>
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          <ProfileRow icon={<Building2 />} label="Unit kerja" value="MAS Monang-Maning" />
          <ProfileRow icon={<UserRound />} label="Role" value="Kepala Cabang" />
        </div>
      </main>
    </MobileShell>
  );
}

function ProfileRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 px-4 py-3.5"><span className="text-[#2953A4]">{icon}</span><span className="flex-1"><span className="block text-[12px] text-slate-500">{label}</span><span className="block text-[14px] font-medium text-slate-900">{value}</span></span><ChevronRight className="h-4 w-4 text-slate-400" /></div>;
}
