"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

import { normalizeSnapshot, stripUndefined } from "@/lib/firestore/base";
import { db } from "@/lib/firebase";
import {
  Interaction,
  InteractionQueryOptions,
  Lead,
  LeadQueryOptions,
  Viewing,
  ViewingQueryOptions
} from "@/types/crm";

const leadsCollection = collection(db, "leads");
const interactionsCollection = collection(db, "interactions");
const viewingsCollection = collection(db, "viewings");

export async function getLeads(options?: LeadQueryOptions) {
  const snapshot = await getDocs(leadsCollection);
  return snapshot.docs
    .map((entry) => normalizeSnapshot<Lead>(entry))
    .filter(Boolean)
    .filter((lead) => {
      if (options?.assignedAgentId && lead?.assignedAgentId !== options.assignedAgentId) {
        return false;
      }

      if (options?.requestedByUserId && lead?.requestedByUserId !== options.requestedByUserId) {
        return false;
      }

      return true;
    })
    .sort(
      (first, second) =>
        new Date(second?.createdAt ?? 0).getTime() - new Date(first?.createdAt ?? 0).getTime()
    ) as Lead[];
}

export async function getLeadById(id: string) {
  const snapshot = await getDoc(doc(db, "leads", id));
  if (!snapshot.exists()) return null;
  return normalizeSnapshot<Lead>(snapshot);
}

export async function createLead(payload: Omit<Lead, "id">) {
  const docRef = await addDoc(leadsCollection, {
    ...stripUndefined(payload),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateLead(id: string, payload: Partial<Lead>) {
  await updateDoc(doc(db, "leads", id), {
    ...stripUndefined(payload),
    updatedAt: serverTimestamp()
  });
}

export async function getInteractions(options?: InteractionQueryOptions) {
  const snapshot = await getDocs(interactionsCollection);
  return snapshot.docs
    .map((entry) => normalizeSnapshot<Interaction>(entry))
    .filter(Boolean)
    .filter((interaction) => {
      if (options?.agentId && interaction?.agentId !== options.agentId) {
        return false;
      }

      if (options?.leadId && interaction?.leadId !== options.leadId) {
        return false;
      }

      return true;
    })
    .sort(
      (first, second) =>
        new Date(second?.interactionAt ?? 0).getTime() -
        new Date(first?.interactionAt ?? 0).getTime()
    ) as Interaction[];
}

export async function createInteraction(payload: Omit<Interaction, "id">) {
  const docRef = await addDoc(interactionsCollection, {
    ...stripUndefined(payload),
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function getViewings(options?: ViewingQueryOptions) {
  const snapshot = await getDocs(viewingsCollection);
  return snapshot.docs
    .map((entry) => normalizeSnapshot<Viewing>(entry))
    .filter(Boolean)
    .filter((viewing) => {
      if (options?.agentId && viewing?.agentId !== options.agentId) {
        return false;
      }

      if (options?.leadId && viewing?.leadId !== options.leadId) {
        return false;
      }

      return true;
    })
    .sort(
      (first, second) =>
        new Date(first?.scheduledAt ?? 0).getTime() - new Date(second?.scheduledAt ?? 0).getTime()
    ) as Viewing[];
}

export async function createViewing(payload: Omit<Viewing, "id">) {
  const docRef = await addDoc(viewingsCollection, {
    ...stripUndefined(payload),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateViewing(id: string, payload: Partial<Viewing>) {
  await updateDoc(doc(db, "viewings", id), {
    ...stripUndefined(payload),
    updatedAt: serverTimestamp()
  });
}
