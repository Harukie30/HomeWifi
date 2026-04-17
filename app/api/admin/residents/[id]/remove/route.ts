import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { removeResident } from "@/lib/mock-store";
import { isValidUuid } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ error: "Invalid resident id." }, { status: 400 });
  }
  const ok = await removeResident(id);

  if (!ok) {
    return NextResponse.json({ error: "Resident not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
