import { NextResponse } from "next/server";
import {
  setAdminSessionCookie,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import { validateAdminLoginPayload } from "@/lib/validation";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = validateAdminLoginPayload(payload);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const { email, password } = validation.data;
  const result = await verifyAdminCredentials(email, password);

  if (result.reason === "misconfigured") {
    return NextResponse.json(
      { error: "Admin auth is not configured on the server." },
      { status: 500 }
    );
  }

  if (!result.ok) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setAdminSessionCookie();
  return NextResponse.json({ success: true });
}
