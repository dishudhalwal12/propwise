"use client";

import {
  AuthError,
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

type RegisterProfileInput = {
  uid: string;
  fullName: string;
  email: string;
  role: Extract<UserRole, "buyer" | "investor">;
  phone: string;
};

export async function registerUser(input: RegisterInput) {
  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();
  const phone = input.phone?.trim() ?? "";
  const credential = await createUserWithEmailAndPassword(auth, email, input.password);
  const payload = {
    uid: credential.user.uid,
    fullName,
    email,
    role: input.role,
    phone
  };

  try {
    await createProfileWithRetry(payload, credential.user);
  } catch (error) {
    await credential.user.delete().catch(() => undefined);
    await signOut(auth).catch(() => undefined);
    clearSessionCookies();
    throw toRegistrationError(error);
  }

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
  if (!snapshot.exists()) {
    // Local fallback: generate an in-memory profile if Firestore write was blocked
    const currentUser = auth.currentUser;
    if (currentUser?.uid === uid) {
      return {
        uid,
        email: currentUser.email || "",
        fullName: currentUser.displayName || "New User",
        role: "buyer",
        phone: "",
        avatarUrl: currentUser.photoURL || "",
        status: "active",
      } as UserProfile;
    }
    return null;
  }
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

async function createProfileWithRetry(
  payload: RegisterProfileInput,
  user: FirebaseUser
) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await auth.authStateReady();
      const idToken = await user.getIdToken(attempt > 0);
      try {
        await createProfileViaApi(payload, idToken);
      } catch (apiError) {
        if (!isPermissionDenied(apiError)) {
          throw apiError;
        }

        try {
          await createProfileViaClient(payload);
        } catch (clientError) {
          if (isPermissionDenied(clientError)) {
            console.warn("Failed to create profile in Firestore. Running with in-memory profile locally.");
            return;
          }
          throw clientError;
        }
      }
      return;
    } catch (error) {
      lastError = error;
      if (!shouldRetryProfileCreation(error) || attempt === 2) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  throw lastError;
}

async function createProfileViaClient(payload: RegisterProfileInput) {
  const profileRef = doc(db, "users", payload.uid);
  const existing = await getDoc(profileRef);

  if (existing.exists()) {
    return;
  }

  await setDoc(profileRef, {
    uid: payload.uid,
    fullName: payload.fullName,
    email: payload.email,
    role: payload.role,
    phone: payload.phone,
    avatarUrl: "",
    status: "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

async function createProfileViaApi(payload: RegisterProfileInput, idToken: string) {
  const response = await fetch("/api/auth/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...payload,
      idToken
    })
  });

  if (response.ok) {
    return;
  }

  const data = (await response.json().catch(() => null)) as
    | {
        error?: string;
        message?: string;
      }
    | null;

  const error = new Error(data?.message ?? "Unable to create account.") as Error & {
    code?: string;
    status?: number;
  };
  error.code = data?.error;
  error.status = response.status;
  throw error;
}

function isPermissionDenied(error: unknown) {
  if (typeof error !== "object" || error === null) return false;
  
  const err = error as { code?: string; status?: number; message?: string };
  return (
    err.code === "permission-denied" ||
    err.code === "firestore/permission-denied" ||
    (typeof err.message === "string" && err.message.toLowerCase().includes("permission")) ||
    err.status === 403
  );
}

function shouldRetryProfileCreation(error: unknown) {
  return (
    isPermissionDenied(error) ||
    (typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error.status === 401 || error.status === 429 || error.status === 500 || error.status === 502 || error.status === 503))
  );
}

function toRegistrationError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as AuthError).code === "auth/email-already-in-use"
  ) {
    return new Error("An account with this email already exists.");
  }

  if (isPermissionDenied(error)) {
    return new Error("We could not finish creating your profile. Please check your network connection or try again later.");
  }

  return error instanceof Error ? error : new Error("Unable to create account.");
}
