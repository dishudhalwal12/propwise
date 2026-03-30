"use client";

import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";

import { normalizeSnapshot } from "@/lib/firestore/base";
import { db } from "@/lib/firebase";
import { UserProfile, UserRole, UserStatus } from "@/types/user";

export { getUserProfile, updateUserProfile } from "@/lib/auth";

const usersCollection = collection(db, "users");

export async function getUsers() {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs
    .map((entry) => normalizeSnapshot<Omit<UserProfile, "uid">>(entry))
    .filter((entry): entry is Omit<UserProfile, "uid"> & { id: string } => Boolean(entry))
    .map((entry) => ({
      ...entry,
      uid: entry.id
    }))
    .sort(
      (first, second) => new Date(second.createdAt ?? 0).getTime() - new Date(first.createdAt ?? 0).getTime()
    );
}

export async function updateUserAccess(
  uid: string,
  updates: Partial<Pick<UserProfile, "role" | "status" | "phone" | "fullName">>
) {
  await updateDoc(doc(db, "users", uid), {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function updateUserRole(uid: string, role: UserRole) {
  return updateUserAccess(uid, { role });
}

export async function updateUserStatus(uid: string, status: UserStatus) {
  return updateUserAccess(uid, { status });
}
