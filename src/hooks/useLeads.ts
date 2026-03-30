"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getDemoInteractions, getDemoLeads, getDemoViewings } from "@/data/demo";
import { getInteractions, getLeads, getViewings } from "@/lib/firestore/crm";
import {
  Interaction,
  InteractionQueryOptions,
  Lead,
  LeadQueryOptions,
  Viewing,
  ViewingQueryOptions
} from "@/types/crm";

type UseLeadsOptions = {
  leads?: LeadQueryOptions;
  interactions?: InteractionQueryOptions;
  viewings?: ViewingQueryOptions;
};

export function useLeads(options?: UseLeadsOptions) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [viewings, setViewings] = useState<Viewing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDemoData, setIsDemoData] = useState(false);
  const [notice, setNotice] = useState("");

  const serializedOptions = JSON.stringify(options ?? {});
  const requestOptions = useMemo(
    () => JSON.parse(serializedOptions) as UseLeadsOptions,
    [serializedOptions]
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextLeads, nextInteractions, nextViewings] = await Promise.all([
        getLeads(requestOptions?.leads),
        getInteractions(requestOptions?.interactions),
        getViewings(requestOptions?.viewings)
      ]);
      const shouldUseDemo =
        nextLeads.length === 0 && nextInteractions.length === 0 && nextViewings.length === 0;

      if (shouldUseDemo) {
        setLeads(getDemoLeads(requestOptions?.leads));
        setInteractions(getDemoInteractions(requestOptions?.interactions));
        setViewings(getDemoViewings(requestOptions?.viewings));
        setIsDemoData(true);
        setNotice("Showing staged CRM activity because the live pipeline is empty right now.");
      } else {
        setLeads(nextLeads);
        setInteractions(nextInteractions);
        setViewings(nextViewings);
        setIsDemoData(false);
        setNotice("");
      }
    } catch (fetchError) {
      setLeads(getDemoLeads(requestOptions?.leads));
      setInteractions(getDemoInteractions(requestOptions?.interactions));
      setViewings(getDemoViewings(requestOptions?.viewings));
      setIsDemoData(true);
      setNotice("Showing staged CRM activity while live collections are temporarily unavailable.");
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load CRM data.");
    } finally {
      setLoading(false);
    }
  }, [requestOptions]);

  useEffect(() => {
    void refetch();
  }, [refetch, serializedOptions]);

  return {
    leads,
    interactions,
    viewings,
    loading,
    error,
    isDemoData,
    notice,
    refetch,
    setLeads,
    setInteractions,
    setViewings
  };
}
