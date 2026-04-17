import { prisma } from "@/lib/prisma";
import type {
  PasswordRevealRequest,
  PasswordRevealRequestStatus,
  RegistrationRequest,
  Resident,
  RequestStatus,
} from "@/lib/models";

type TransactionClient = Parameters<
  Extract<Parameters<typeof prisma.$transaction>[0], (arg: unknown) => unknown>
>[0];

function formatAdded(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toResident(row: {
  id: string;
  name: string;
  unit: string;
  status: string;
  addedAt: Date;
}): Resident {
  return {
    id: row.id,
    name: row.name,
    unit: row.unit,
    status: row.status as Resident["status"],
    added: formatAdded(row.addedAt),
  };
}

function toRegistrationRequest(row: {
  id: string;
  name: string;
  unit: string;
  phone: string;
  phoneModel: string;
  submittedAt: Date;
  status: string;
}): RegistrationRequest {
  return {
    id: row.id,
    name: row.name,
    unit: row.unit,
    phone: row.phone,
    phoneModel: row.phoneModel,
    submittedAt: row.submittedAt.toISOString(),
    status: row.status as RequestStatus,
  };
}

function toPasswordRevealRequest(row: {
  id: string;
  name: string;
  phone: string;
  unit: string;
  status: string;
  requestedAt: Date;
  visibleUntil: Date | null;
}): PasswordRevealRequest {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    unit: row.unit,
    status: row.status as PasswordRevealRequestStatus,
    requestedAt: row.requestedAt.toISOString(),
    visibleUntil: row.visibleUntil ? row.visibleUntil.toISOString() : null,
  };
}

export async function getResidents(): Promise<Resident[]> {
  const rows = await prisma.resident.findMany({ orderBy: { addedAt: "desc" } });
  return rows.map(toResident);
}

export async function removeResident(residentId: string): Promise<boolean> {
  try {
    const result = await prisma.resident.delete({ where: { id: residentId } });
    return !!result;
  } catch {
    return false;
  }
}

export async function getRegistrationRequests(
  status?: RequestStatus
): Promise<RegistrationRequest[]> {
  const rows = await prisma.registrationRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { submittedAt: "desc" },
  });
  return rows.map(toRegistrationRequest);
}

export async function createRegistrationRequest(
  payload: Omit<RegistrationRequest, "id" | "submittedAt" | "status">
): Promise<RegistrationRequest> {
  const row = await prisma.registrationRequest.create({
    data: {
      name: payload.name,
      unit: payload.unit,
      phone: payload.phone,
      phoneModel: payload.phoneModel,
      status: "pending",
    },
  });
  return toRegistrationRequest(row);
}

export async function approveRequest(
  requestId: string
): Promise<RegistrationRequest | null> {
  const result = await prisma.$transaction(async (tx: TransactionClient) => {
    const request = await tx.registrationRequest.findFirst({
      where: { id: requestId, status: "pending" },
    });
    if (!request) {
      return null;
    }

    await tx.registrationRequest.update({
      where: { id: requestId },
      data: { status: "approved" },
    });

    await tx.resident.create({
      data: {
        name: request.name,
        unit: request.unit,
        status: "Active",
      },
    });

    return tx.registrationRequest.findUniqueOrThrow({ where: { id: requestId } });
  });

  if (!result) {
    return null;
  }
  return toRegistrationRequest(result);
}

export async function rejectRequest(
  requestId: string
): Promise<RegistrationRequest | null> {
  const pending = await prisma.registrationRequest.findFirst({
    where: { id: requestId, status: "pending" },
  });
  if (!pending) {
    return null;
  }
  const row = await prisma.registrationRequest.update({
    where: { id: requestId },
    data: { status: "rejected" },
  });
  return toRegistrationRequest(row);
}

export async function getLatestRegistrationByIdentity(
  name: string,
  phone: string
): Promise<RegistrationRequest | null> {
  const normalizedName = name.trim().toLowerCase();
  const rows = await prisma.registrationRequest.findMany({
    where: {
      phone: phone.trim(),
    },
    orderBy: { submittedAt: "desc" },
  });
  const row = rows.find(
    (item: { name: string }) =>
      item.name.trim().toLowerCase() === normalizedName
  );
  if (!row) return null;
  return toRegistrationRequest(row);
}

export async function getLatestPasswordRevealRequestByIdentity(
  name: string,
  phone: string
): Promise<PasswordRevealRequest | null> {
  const normalizedName = name.trim().toLowerCase();
  const rows = await prisma.passwordRevealRequest.findMany({
    where: {
      phone: phone.trim(),
    },
    orderBy: { requestedAt: "desc" },
  });
  const row = rows.find(
    (item: { name: string }) =>
      item.name.trim().toLowerCase() === normalizedName
  );
  if (!row) return null;
  return toPasswordRevealRequest(row);
}

export async function createPasswordRevealRequest(payload: {
  name: string;
  phone: string;
  unit: string;
}): Promise<PasswordRevealRequest> {
  const row = await prisma.passwordRevealRequest.create({
    data: {
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      unit: payload.unit.trim(),
      status: "pending",
    },
  });
  return toPasswordRevealRequest(row);
}

export async function createPasswordRevealGrant(payload: {
  name: string;
  phone: string;
  unit: string;
  durationMinutes: number;
}): Promise<PasswordRevealRequest> {
  const visibleUntil = new Date(Date.now() + payload.durationMinutes * 60_000);
  const row = await prisma.passwordRevealRequest.create({
    data: {
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      unit: payload.unit.trim(),
      status: "approved",
      resolvedAt: new Date(),
      visibleUntil,
    },
  });
  return toPasswordRevealRequest(row);
}

export async function getPendingPasswordRevealRequests(): Promise<
  PasswordRevealRequest[]
> {
  const rows = await prisma.passwordRevealRequest.findMany({
    where: { status: "pending" },
    orderBy: { requestedAt: "asc" },
  });
  return rows.map(toPasswordRevealRequest);
}

export async function approvePasswordRevealRequest(
  requestId: string,
  durationMinutes: number
): Promise<PasswordRevealRequest | null> {
  const existing = await prisma.passwordRevealRequest.findFirst({
    where: { id: requestId, status: "pending" },
  });
  if (!existing) return null;
  const row = await prisma.passwordRevealRequest.update({
    where: { id: requestId },
    data: {
      status: "approved",
      resolvedAt: new Date(),
      visibleUntil: new Date(Date.now() + durationMinutes * 60_000),
    },
  });
  return toPasswordRevealRequest(row);
}

export async function rejectPasswordRevealRequest(
  requestId: string
): Promise<PasswordRevealRequest | null> {
  const existing = await prisma.passwordRevealRequest.findFirst({
    where: { id: requestId, status: "pending" },
  });
  if (!existing) return null;
  const row = await prisma.passwordRevealRequest.update({
    where: { id: requestId },
    data: {
      status: "rejected",
      resolvedAt: new Date(),
      visibleUntil: null,
    },
  });
  return toPasswordRevealRequest(row);
}
