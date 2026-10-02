import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDots,
  ClipboardText,
  House,
  Plus,
  UserCircle,
  UsersThree,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { PageTransition } from "./motion";

const salesTabs = [
  { to: "/", label: "Home", icon: House },
  { to: "/aktivitas", label: "Aktivitas", icon: ClipboardText },
  { to: "/kontak", label: "Kontak", icon: UsersThree },
  { to: "/program", label: "Program", icon: CalendarDots },
  { to: "/profile", label: "Profil", icon: UserCircle },
] as const;

const kacabTabs = [
  { to: "/kacab", label: "Home", icon: House },
  { to: "/kacab-aktivitas", label: "Aktivitas", icon: ClipboardText },
  { to: "/kacab-profile", label: "Profil", icon: UserCircle },
] as const;

const penaksirTabs = [
  { to: "/penaksir", label: "Home", icon: House },
  { to: "/penaksir-aktivitas", label: "Aktivitas", icon: ClipboardText },
  { to: "/profile", label: "Profil", icon: UserCircle },
] as const;

export function MobileShell({
  children,
  hideNav = false,
  hideFab = false,
  role = "sales",
}: {
  children: ReactNode;
  hideNav?: boolean;
  hideFab?: boolean;
  role?: "sales" | "kacab" | "penaksir";
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tabs = role === "kacab" ? kacabTabs : role === "penaksir" ? penaksirTabs : salesTabs;

  return (
    <div className="mobile-shell relative">
      <PageTransition variant={hideNav ? "push" : "fade"}>
        <div className={`flex flex-1 flex-col ${hideNav ? "" : "pb-24"}`}>{children}</div>
      </PageTransition>
      {!hideNav && (
        <>
          <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur">
            <ul
              className={`grid ${role === "sales" ? "grid-cols-5" : "grid-cols-3"} px-2 pb-3 pt-2`}
            >
              {tabs.map((t) => {
                const Icon = t.icon;
                const active =
                  t.to === "/" || t.to === "/kacab" || t.to === "/penaksir"
                    ? pathname === t.to
                    : pathname.startsWith(t.to);
                return (
                  <li key={t.to} className="flex justify-center">
                    <Link
                      to={t.to}
                      className={`flex w-full flex-col items-center gap-1 rounded-xl py-1.5 text-[13px] font-medium transition-colors ${
                        active ? "text-brand" : "text-muted-foreground"
                      }`}
                    >
                      <Icon size={24} weight={active ? "fill" : "regular"} />
                      <span>{t.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          {!hideFab && (
            <Link
              to="/aktivitas/buat"
              className="fixed bottom-12 left-1/2 z-50 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full text-accent-foreground shadow-lg shadow-amber-500/40 ring-4 ring-card transition-transform active:scale-95"
              style={{ background: "var(--gradient-accent)" }}
              aria-label="Buat aktivitas"
            >
              <Plus className="h-7 w-7" strokeWidth={2.6} />
            </Link>
          )}{" "}
        </>
      )}
    </div>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  right,
  back,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  back?: string;
}) {
  return (
    <header
      className="px-5 pb-6 pt-12 text-brand-foreground"
      style={{ background: "var(--gradient-brand)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {back && (
            <Link
              to={back}
              className="-ml-2 rounded-full p-2 text-brand-foreground/80 hover:bg-white/10"
            >
              ←
            </Link>
          )}
          <div>
            <h1 className="text-xl font-semibold leading-tight">{title}</h1>
            {subtitle && <p className="mt-0.5 text-sm text-brand-foreground/70">{subtitle}</p>}
          </div>
        </div>
        {right}
      </div>
    </header>
  );
}
