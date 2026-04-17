import { NextResponse } from "next/server";
import { createRegistrationRequest } from "@/lib/mock-store";

type RegistrationPayload = {
  name?: string;
  unit?: string;
  phone?: string;
  phoneModel?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as RegistrationPayload;

  if (!payload.name || !payload.unit || !payload.phone || !payload.phoneModel) {
    return NextResponse.json(
      { error: "Missing required registration fields." },
      { status: 400 }
    );
  }

  const created = await createRegistrationRequest({
    name: payload.name.trim(),
    unit: payload.unit.trim(),
    phone: payload.phone.trim(),
    phoneModel: payload.phoneModel.trim(),
  });

  return NextResponse.json({ request: created }, { status: 201 });
}
