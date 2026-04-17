import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getRegistrationRequests, getResidents } from "@/lib/mock-store";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const requests = await getRegistrationRequests();
  const residents = await getResidents();

  const pending = requests.filter((r) => r.status === "pending").length;
  const rejected = requests.filter((r) => r.status === "rejected").length;
  const approved = requests.filter((r) => r.status === "approved").length;

  const unitCounts = new Map<string, number>();
  for (const r of residents) {
    unitCounts.set(r.unit, (unitCounts.get(r.unit) ?? 0) + 1);
  }
  const residentsByUnit = Array.from(unitCounts.entries())
    .map(([unit, count]) => ({ unit, count }))
    .sort((a, b) => a.unit.localeCompare(b.unit, undefined, { numeric: true }));

  const decided = approved + rejected;
  const resolutionRatePercent =
    decided > 0 ? Math.round((approved / decided) * 1000) / 10 : null;

  return NextResponse.json({
    pending,
    rejected,
    approved,
    activeResidents: residents.length,
    totalRequests: requests.length,
    residentsByUnit,
    resolutionRatePercent,
  });
}
