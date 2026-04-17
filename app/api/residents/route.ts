import { NextResponse } from "next/server";
import { getResidents } from "@/lib/mock-store";

export async function GET() {
  const residents = await getResidents();
  return NextResponse.json({ residents });
}
