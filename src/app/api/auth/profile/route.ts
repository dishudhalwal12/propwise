import { NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebase-admin";

type RouteError = Error & {
  code?: string;
  status?: number;
};

function createRouteError(message: string, status: number, code: string) {
  const error = new Error(message) as RouteError;
  error.status = status;
  error.code = code;
  return error;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readEmail(value: unknown) {
  return readString(value).toLowerCase();
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function createProfileWithRest(input: {
  idToken: string;
  uid: string;
  fullName: string;
  email: string;
  role: "buyer" | "investor";
  phone: string;
}) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw createRouteError("Server is missing Firebase project configuration.", 500, "config-missing");
  }

  const now = new Date().toISOString();
  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${input.uid}?currentDocument.exists=false`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${input.idToken}`
      },
      body: JSON.stringify({
        fields: {
          uid: { stringValue: input.uid },
          fullName: { stringValue: input.fullName },
          email: { stringValue: input.email },
          role: { stringValue: input.role },
          phone: { stringValue: input.phone },
          avatarUrl: { stringValue: "" },
          status: { stringValue: "active" },
          createdAt: { timestampValue: now },
          updatedAt: { timestampValue: now }
        }
      })
    }
  );

  if (response.ok) {
    return;
  }

  const payload = (await response.json().catch(() => null)) as
    | {
        error?: {
          code?: number;
          message?: string;
          status?: string;
        };
      }
    | null;

  if (response.status === 403 || payload?.error?.status === "PERMISSION_DENIED") {
    throw createRouteError("Firestore access for new signups is blocked.", 403, "permission-denied");
  }

  if (response.status === 409 || payload?.error?.status === "ALREADY_EXISTS") {
    throw createRouteError("A profile for this account already exists.", 409, "already-exists");
  }

  throw createRouteError(
    payload?.error?.message ?? "Unable to create account profile.",
    response.status || 500,
    "profile-create-failed"
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      idToken?: string;
      uid?: string;
      fullName?: string;
      email?: string;
      role?: string;
      phone?: string;
    };

    const idToken = readString(body.idToken);
    const uid = readString(body.uid);
    const fullName = readString(body.fullName);
    const email = readEmail(body.email);
    const phone = readString(body.phone);
    const role = body.role === "investor" ? "investor" : body.role === "buyer" ? "buyer" : null;

    if (!idToken || !uid || !fullName || !email || !role || !isEmail(email)) {
      return NextResponse.json(
        { error: "invalid-request", message: "Missing or invalid registration payload." },
        { status: 400 }
      );
    }

    if (adminAuth && adminDb) {
      const decoded = await adminAuth.verifyIdToken(idToken);
      if (decoded.uid !== uid) {
        return NextResponse.json(
          { error: "uid-mismatch", message: "Authenticated user does not match profile payload." },
          { status: 403 }
        );
      }

      await adminDb.collection("users").doc(uid).create({
        uid,
        fullName,
        email,
        role,
        phone,
        avatarUrl: "",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return NextResponse.json({ ok: true, mode: "admin" });
    }

    await createProfileWithRest({
      idToken,
      uid,
      fullName,
      email,
      role,
      phone
    });

    return NextResponse.json({ ok: true, mode: "rest" });
  } catch (error) {
    const routeError = error as RouteError;
    return NextResponse.json(
      {
        error: routeError.code ?? "profile-create-failed",
        message: routeError.message || "Unable to create account profile."
      },
      { status: routeError.status ?? 500 }
    );
  }
}
