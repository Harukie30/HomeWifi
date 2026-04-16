import { NextResponse } from "next/server";
import { setAdminSessionCookie } from "@/lib/admin-auth";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as LoginPayload;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "Admin credentials are not configured on the server." },
      { status: 500 }
    );
  }

  const isValid =
    payload.email?.trim() === adminEmail && payload.password === adminPassword;

  if (!isValid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setAdminSessionCookie();
  return NextResponse.json({ success: true });
}
