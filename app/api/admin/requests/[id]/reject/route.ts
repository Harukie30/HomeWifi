import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { rejectRequest } from "@/lib/mock-store";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const updated = rejectRequest(id);

  if (!updated) {
    return NextResponse.json(
      { error: "Request not found or already processed." },
      { status: 404 }
    );
  }

  return NextResponse.json({ request: updated });
}
