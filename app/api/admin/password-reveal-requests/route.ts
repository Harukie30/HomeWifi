import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPendingPasswordRevealRequests } from "@/lib/mock-store";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const requests = await getPendingPasswordRevealRequests();
  return NextResponse.json({ requests });
}
