"use client";

import { useCallback, useEffect, useState } from "react";

import { getDemoComparisons, isDemoRecord } from "@/data/demo";
import {
  deleteComparison,
  getUserComparisons
} from "@/lib/firestore/comparisons";
import { ComparisonRecord } from "@/types/property";

export function useComparisons(userId?: string) {
  const [comparisons, setComparisons] = useState<ComparisonRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDemoData, setIsDemoData] = useState(false);
  const [notice, setNotice] = useState("");

  const refetch = useCallback(async () => {
    if (!userId) {
      setComparisons([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const nextComparisons = await getUserComparisons(userId);
      if (nextComparisons.length > 0) {
        setComparisons(nextComparisons);
        setIsDemoData(false);
        setNotice("");
      } else {
        setComparisons(getDemoComparisons(userId));
        setIsDemoData(true);
        setNotice("Showing seeded saved comparisons until live comparison history is available.");
      }
    } catch (fetchError) {
      setComparisons(getDemoComparisons(userId));
      setIsDemoData(true);
      setNotice("Showing seeded saved comparisons while live comparison history is temporarily unavailable.");
      setError(
        fetchError instanceof Error ? fetchError.message : "Unable to load comparisons."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const remove = async (id: string) => {
    if (isDemoRecord(id)) {
      setComparisons((current) => current.filter((entry) => entry.id !== id));
      return;
    }
    await deleteComparison(id);
    setComparisons((current) => current.filter((entry) => entry.id !== id));
  };

  return { comparisons, loading, error, isDemoData, notice, refetch, remove, setComparisons };
}
