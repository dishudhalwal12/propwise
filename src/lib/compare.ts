"use client";

const STORAGE_KEY = "propwise-compare";

export function getCompareSelection() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function setCompareSelection(propertyIds: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(propertyIds.slice(0, 4)));
}

export function clearCompareSelection() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function toggleCompareSelection(propertyId: string) {
  const current = getCompareSelection();
  if (current.includes(propertyId)) {
    const next = current.filter((id) => id !== propertyId);
    setCompareSelection(next);
    return next;
  }
  const next = [...current, propertyId].slice(0, 4);
  setCompareSelection(next);
  return next;
}
