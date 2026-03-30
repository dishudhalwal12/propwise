"use client";

import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";

import { clearSessionCookies, persistSessionCookie } from "@/lib/cookies";
import { auth, db } from "@/lib/firebase";
import { UserProfile, UserRole } from "@/types/user";

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  role: Extract<UserRole, "buyer" | "investor">;
  phone?: string;
};

export async function registerUser(input: RegisterInput) {
  const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);
  const payload = {
    uid: credential.user.uid,
    fullName: input.fullName,
    email: input.email,
    role: input.role,
    phone: input.phone ?? "",
    avatarUrl: "",
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, "users", credential.user.uid), payload);
  await syncSessionCookies(await credential.user.getIdToken(), input.role, credential.user.uid);
  return credential.user;
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(credential.user.uid);
  if (!profile) {
    await signOut(auth);
    clearSessionCookies();
    throw new Error("Account profile is missing. Ask an admin to provision your access.");
  }
  await syncSessionCookies(await credential.user.getIdToken(), profile.role, credential.user.uid);
  return { user: credential.user, profile };
}

export async function logoutUser() {
  await fetch("/api/auth/logout", {
    method: "POST"
  }).catch(() => undefined);
  await signOut(auth);
  clearSessionCookies();
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid: string) {
  const snapshot = await getDoc(doc(db, "users", uid));
  if (!snapshot.exists()) return null;
  const data = snapshot.data() as UserProfile & {
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  };

  return {
    ...data,
    createdAt: data.createdAt?.toDate().toISOString(),
    updatedAt: data.updatedAt?.toDate().toISOString()
  } satisfies UserProfile;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  await updateDoc(doc(db, "users", uid), {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

async function syncSessionCookies(idToken: string, role: UserRole, uid: string) {
  try {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idToken,
        role,
        uid
      })
    });

    if (!response.ok) {
      throw new Error("Unable to persist secure session.");
    }
  } catch {
    persistSessionCookie(role, uid);
  }
}
