import { NextResponse } from "next/server";

import {
  createPasswordRevealRequest,
  getLatestPasswordRevealRequestByIdentity,
  getLatestRegistrationByIdentity,
} from "@/lib/mock-store";
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

  const latestRegistration = await getLatestRegistrationByIdentity(
    validation.data.name,
    validation.data.phone
  );

  if (!latestRegistration || latestRegistration.status !== "approved") {
    return NextResponse.json(
      { error: "Only approved users can request WiFi password access." },
      { status: 403 }
    );
  }

  const latestReveal = await getLatestPasswordRevealRequestByIdentity(
    validation.data.name,
    validation.data.phone
  );

  if (latestReveal?.status === "pending") {
    return NextResponse.json(
      { error: "A password-view request is already pending admin review." },
      { status: 409 }
    );
  }

  const created = await createPasswordRevealRequest({
    name: latestRegistration.name,
    phone: latestRegistration.phone,
    unit: latestRegistration.unit,
  });

  return NextResponse.json({ request: created }, { status: 201 });
}
