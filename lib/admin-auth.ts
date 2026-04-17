import { cookies } from "next/headers";
import { compare } from "bcryptjs";

import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionValue,
} from "@/lib/admin-session";

export { ADMIN_SESSION_COOKIE } from "@/lib/admin-session";

const ONE_DAY = 60 * 60 * 24;

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return (
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value === getAdminSessionValue()
  );
}

export async function setAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, getAdminSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_DAY,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<{ ok: boolean; reason?: "misconfigured" }> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const legacyPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || (!passwordHash && !legacyPassword)) {
    return { ok: false, reason: "misconfigured" };
  }

  if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
    return { ok: false };
  }

  if (passwordHash) {
    const valid = await compare(password, passwordHash);
    return { ok: valid };
  }

  return { ok: password === legacyPassword };
}
