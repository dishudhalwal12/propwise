import "server-only";

import { cookies } from "next/headers";

import { adminAuth } from "@/lib/firebase-admin";
import { UserRole } from "@/types/user";

export type ServerSession = {
  uid: string;
  role?: UserRole;
};

export async function getServerSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("propwise-session")?.value;
  const role = cookieStore.get("propwise-role")?.value as UserRole | undefined;
  const uid = cookieStore.get("propwise-uid")?.value ?? "";

  if (!sessionCookie) {
    return null;
  }

  if (adminAuth && !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      return {
        uid: decoded.uid,
        role
      } satisfies ServerSession;
    } catch {
      return null;
    }
  }

  if (!uid) {
    return null;
  }

  return {
    uid,
    role
  } satisfies ServerSession;
}
