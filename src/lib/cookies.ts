const SESSION_COOKIE = "propwise-session";
const ROLE_COOKIE = "propwise-role";
const UID_COOKIE = "propwise-uid";

type CookieOptions = {
  days?: number;
};

function setCookie(name: string, value: string, options?: CookieOptions) {
  if (typeof document === "undefined") return;
  const expires = options?.days
    ? `; expires=${new Date(Date.now() + options.days * 86400000).toUTCString()}`
    : "";
  document.cookie = `${name}=${value}; path=/; samesite=lax${expires}`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function persistSessionCookie(role?: string, uid?: string) {
  setCookie(SESSION_COOKIE, "1", { days: 7 });
  if (role) setCookie(ROLE_COOKIE, role, { days: 7 });
  if (uid) setCookie(UID_COOKIE, uid, { days: 7 });
}

export function clearSessionCookies() {
  removeCookie(SESSION_COOKIE);
  removeCookie(ROLE_COOKIE);
  removeCookie(UID_COOKIE);
}

export function getRoleCookie() {
  if (typeof document === "undefined") return "";
  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${ROLE_COOKIE}=`))
    ?.split("=")[1] ?? "";
}
