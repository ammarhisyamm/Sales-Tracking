import { useSyncExternalStore } from "react";
import { contacts, type Contact } from "./mock-data";

const KEY = "connect-track-leads-v1";

let cache: Record<string, Contact[]> = {};
let hydrated = false;
const listeners = new Set<() => void>();

function readPersisted(): Record<string, Contact[]> {
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

function seed(activityId: string, source: string): Contact[] {
  // Aktivitas buatan user mulai kosong — tanpa contoh
  if (activityId.startsWith("u-")) return [];
  // Aktivitas online menunggu nasabah mengisi formulir pendaftaran.
  if (source === "Event") return [];
  const related = contacts.filter((c) => c.source === source);
  const base = related.length > 0 ? related : contacts.slice(0, 3);
  return base.map((c) => ({ ...c }));
}

function ensure(activityId: string, source: string): Contact[] {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    cache = { ...readPersisted() };
  }
  if (!cache[activityId]) cache[activityId] = seed(activityId, source);
  return cache[activityId];
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function addLead(activityId: string, source: string, lead: Contact) {
  const list = ensure(activityId, source);
  cache[activityId] = [lead, ...list];
  if (typeof window !== "undefined") persist();
  listeners.forEach((l) => l());
}

export function useLeads(activityId: string, source: string): Contact[] {
  return useSyncExternalStore(
    subscribe,
    () => ensure(activityId, source),
    () => seed(activityId, source),
  );
}
