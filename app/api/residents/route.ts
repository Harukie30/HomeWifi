import { NextResponse } from "next/server";
import { getResidents } from "@/lib/mock-store";

export async function GET() {
  return NextResponse.json({ residents: getResidents() });
}
