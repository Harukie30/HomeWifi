import { NextResponse } from "next/server";

import { getLatestRegistrationByIdentity } from "@/lib/mock-store";
import { validateAccessStatusPayload } from "@/lib/validation";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = validateAccessStatusPayload(payload);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const latest = await getLatestRegistrationByIdentity(
    validation.data.name,
    validation.data.phone
  );

  if (!latest) {
    return NextResponse.json({ status: "not_found" as const });
  }

  return NextResponse.json({
    status: latest.status,
    request: {
      name: latest.name,
      unit: latest.unit,
      submittedAt: latest.submittedAt,
    },
  });
}
