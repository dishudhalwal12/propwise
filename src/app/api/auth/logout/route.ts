import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set("propwise-session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });
  response.cookies.set("propwise-role", "", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });
  response.cookies.set("propwise-uid", "", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0)
  });

  return response;
}
