"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { normalizeSnapshot } from "@/lib/firestore/base";
import { db } from "@/lib/firebase";
import { ComparisonRecord } from "@/types/property";

export async function saveComparison(payload: Omit<ComparisonRecord, "id">) {
  const docRef = await addDoc(collection(db, "comparisons"), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function getUserComparisons(userId: string) {
  const snapshot = await getDocs(collection(db, "comparisons"));
  return snapshot.docs
    .map((entry) => normalizeSnapshot<ComparisonRecord>(entry))
    .filter(Boolean)
    .filter((comparison) => comparison?.userId === userId)
    .sort(
      (first, second) =>
        new Date(second?.createdAt ?? 0).getTime() - new Date(first?.createdAt ?? 0).getTime()
    ) as ComparisonRecord[];
}

export async function deleteComparison(id: string) {
  await deleteDoc(doc(db, "comparisons", id));
}

export async function getComparisonCount() {
  const snapshot = await getDocs(collection(db, "comparisons"));
  return snapshot.size;
}
