"use client";

import { useEffect, useState } from "react";

import {
  clearCompareSelection,
  getCompareSelection,
  setCompareSelection,
  toggleCompareSelection
} from "@/lib/compare";

export function useCompareSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds(getCompareSelection());
  }, []);

  const toggle = (propertyId: string) => {
    const next = toggleCompareSelection(propertyId);
    setSelectedIds(next);
    return next;
  };

  const replace = (propertyIds: string[]) => {
    setCompareSelection(propertyIds);
    setSelectedIds(propertyIds.slice(0, 4));
  };

  const clear = () => {
    clearCompareSelection();
    setSelectedIds([]);
  };

  return { selectedIds, toggle, replace, clear };
}
