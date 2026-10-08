import { useSyncExternalStore } from "react";
import { activities, type Activity, type ActivityStatus } from "./mock-data";

const KEY = "connect-track-activity-v1";
const CUSTOM_KEY = "connect-track-activity-custom-v1";

export interface ActivityOverride {
  status?: ActivityStatus;
  checkInTime?: string;
  checkOutTime?: string;
  photoUrl?: string;
}

let cache: Record<string, ActivityOverride> = {};
let hydrated = false;
const listeners = new Set<() => void>();

function readPersisted(): Record<string, ActivityOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* abaikan */
  }
}

function hydrate() {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    cache = { ...readPersisted() };
  }
}

function base(id: string): Activity | undefined {
  return allBase().find((a) => a.id === id);
}

function allBase(): Activity[] {
  return [...loadCustoms(), ...activities];
}

let customs: Activity[] | null = null;

function loadCustoms(): Activity[] {
  if (customs) return customs;
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    customs = Array.isArray(parsed) ? parsed : [];
  } catch {
    customs = [];
  }
  return customs;
}

function persistCustoms() {
  try {
    window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(loadCustoms()));
  } catch {
    /* abaikan */
  }
}

/** Simpan aktivitas baru dari form (status awal Segera). */
export function createActivity(
  data: Omit<Activity, "id" | "status" | "leadsCount" | "leadsTarget" | "closingCount"> & {
    leadsTarget?: number;
  },
): Activity {
  const a: Activity = {
    ...data,
    id: `u-${Date.now()}`,
    status: "planned",
    leadsCount: 0,
    leadsTarget: data.leadsTarget ?? 10,
    closingCount: 0,
  };
  customs = [a, ...loadCustoms()];
  if (typeof window !== "undefined") persistCustoms();
  notify();
  return a;
}

// Cache array gabungan agar snapshot stabil antar render
let allCache: Activity[] | null = null;

function allMerged(): Activity[] {
  hydrate();
  if (!allCache) {
    allCache = allBase().map((a) => ({ ...a, ...(cache[a.id] ?? {}) }));
  }
  return allCache;
}

function merged(id: string): Activity | undefined {
  return allMerged().find((a) => a.id === id);
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function notify() {
  allCache = null;
  listeners.forEach((l) => l());
}

export function updateActivity(id: string, patch: ActivityOverride) {
  hydrate();
  cache[id] = { ...(cache[id] ?? {}), ...patch };
  if (typeof window !== "undefined") persist();
  notify();
}

export function resetActivities() {
  cache = {};
  customs = [];
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
      window.localStorage.removeItem(CUSTOM_KEY);
    } catch {
      /* abaikan */
    }
  }
  notify();
}

/** Satu aktivitas (data statis + override check-in/out). */
export function useActivity(id: string): Activity | undefined {
  return useSyncExternalStore(
    subscribe,
    () => merged(id),
    () => base(id),
  );
}

/** Semua aktivitas — untuk list/home agar status selalu sinkron. */
export function useActivities(): Activity[] {
  return useSyncExternalStore(subscribe, allMerged, () => activities);
}

export function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
