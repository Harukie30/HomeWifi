import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { approvePasswordRevealRequest } from "@/lib/mock-store";
import { isValidUuid } from "@/lib/validation";

const PASSWORD_VIEW_MINUTES = 4;

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ error: "Invalid request id." }, { status: 400 });
  }

  const updated = await approvePasswordRevealRequest(id, PASSWORD_VIEW_MINUTES);
  if (!updated) {
    return NextResponse.json(
      { error: "Request not found or already processed." },
      { status: 404 }
    );
  }

  return NextResponse.json({ request: updated });
}
