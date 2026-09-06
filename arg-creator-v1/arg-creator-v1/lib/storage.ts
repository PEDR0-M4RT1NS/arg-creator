import { Phase, defaultPhases } from "./types";

const KEY = "my-boo-arg-phases";

export function loadPhases(): Phase[] {
  if (typeof window === "undefined") return defaultPhases;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : defaultPhases;
  } catch {
    return defaultPhases;
  }
}

export function savePhases(phases: Phase[]) {
  localStorage.setItem(KEY, JSON.stringify(phases));
}

export function resetPhases() {
  localStorage.removeItem(KEY);
}
