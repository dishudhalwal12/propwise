import { NextResponse } from "next/server";

import { adminAuth } from "@/lib/firebase-admin";

const SESSION_MAX_AGE = 60 * 60 * 24 * 5;

export async function POST(request: Request) {
  const { idToken, role, uid } = (await request.json()) as {
    idToken?: string;
    role?: string;
    uid?: string;
  };

  if (!idToken || !uid) {
    return NextResponse.json({ error: "Missing session payload." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";
  if (adminAuth && !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE * 1000
    });
    response.cookies.set("propwise-session", sessionCookie, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: SESSION_MAX_AGE
    });
  } else {
    response.cookies.set("propwise-session", "client", {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: SESSION_MAX_AGE
    });
  }

  response.cookies.set("propwise-role", role ?? "", {
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: SESSION_MAX_AGE
  });

  response.cookies.set("propwise-uid", uid, {
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: SESSION_MAX_AGE
  });

  return response;
}
