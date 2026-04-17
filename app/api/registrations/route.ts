import { NextResponse } from "next/server";
import { createRegistrationRequest } from "@/lib/mock-store";
import { validateRegistrationPayload } from "@/lib/validation";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const validation = validateRegistrationPayload(payload);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const created = await createRegistrationRequest({
    name: validation.data.name,
    unit: validation.data.unit,
    phone: validation.data.phone,
    phoneModel: validation.data.phoneModel,
  });

  return NextResponse.json({ request: created }, { status: 201 });
}
