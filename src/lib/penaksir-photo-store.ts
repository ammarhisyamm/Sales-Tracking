import { useSyncExternalStore } from "react";

const KEY = "connect-track-penaksir-photos-v1";
const EMPTY: Record<string, string> = {};
let cache: Record<string, string> | null = null;
const listeners = new Set<() => void>();

function readPhotos() {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return typeof parsed === "object" && parsed !== null ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getPhotos() {
  if (!cache) cache = readPhotos();
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function savePenaksirPhoto(cif: string, photoUrl: string) {
  const normalizedCif = cif.trim().toUpperCase();
  if (!normalizedCif || !photoUrl) return;
  cache = { ...getPhotos(), [normalizedCif]: photoUrl };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Penyimpanan lokal boleh gagal tanpa mengganggu alur kamera.
  }
  listeners.forEach((listener) => listener());
}

export function usePenaksirPhoto(cif: string) {
  const normalizedCif = cif.trim().toUpperCase();
  return useSyncExternalStore(
    subscribe,
    () => getPhotos()[normalizedCif] ?? "",
    () => "",
  );
}
