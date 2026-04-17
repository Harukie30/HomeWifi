import { NextResponse } from "next/server";

import {
  createPasswordRevealGrant,
  getLatestPasswordRevealRequestByIdentity,
  getLatestRegistrationByIdentity,
} from "@/lib/mock-store";
import { validateAccessStatusPayload } from "@/lib/validation";

const PASSWORD_VIEW_MINUTES = 4;

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

  if (latest.status !== "approved") {
    return NextResponse.json({
      status: latest.status,
      request: {
        name: latest.name,
        unit: latest.unit,
        submittedAt: latest.submittedAt,
      },
    });
  }

  let reveal = await getLatestPasswordRevealRequestByIdentity(
    validation.data.name,
    validation.data.phone
  );

  if (!reveal) {
    reveal = await createPasswordRevealGrant({
      name: latest.name,
      phone: latest.phone,
      unit: latest.unit,
      durationMinutes: PASSWORD_VIEW_MINUTES,
    });
  }

  const nowMs = Date.now();
  const visibleUntilMs = reveal.visibleUntil
    ? new Date(reveal.visibleUntil).getTime()
    : 0;
  const canViewPassword =
    reveal.status === "approved" && visibleUntilMs > nowMs;
  const secondsRemaining = canViewPassword
    ? Math.max(0, Math.ceil((visibleUntilMs - nowMs) / 1000))
    : 0;

  return NextResponse.json({
    status: latest.status,
    request: {
      name: latest.name,
      phone: latest.phone,
      unit: latest.unit,
      submittedAt: latest.submittedAt,
    },
    reveal: {
      canViewPassword,
      hasPendingRequest: reveal.status === "pending",
      secondsRemaining,
      visibleUntil: reveal.visibleUntil,
    },
  });
}
