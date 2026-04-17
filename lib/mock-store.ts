import { mockResidents } from "@/lib/mock-users";
import type { RegistrationRequest, Resident, RequestStatus } from "@/lib/models";

const residentsStore: Resident[] = [...mockResidents];
const registrationRequestsStore: RegistrationRequest[] = [];

export function getResidents(): Resident[] {
  return [...residentsStore];
}

export function removeResident(residentId: string): boolean {
  const index = residentsStore.findIndex((r) => r.id === residentId);
  if (index === -1) {
    return false;
  }
  residentsStore.splice(index, 1);
  return true;
}

export function getRegistrationRequests(status?: RequestStatus): RegistrationRequest[] {
  if (!status) {
    return [...registrationRequestsStore];
  }
  return registrationRequestsStore.filter((request) => request.status === status);
}

export function createRegistrationRequest(
  payload: Omit<RegistrationRequest, "id" | "submittedAt" | "status">
): RegistrationRequest {
  const request: RegistrationRequest = {
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    status: "pending",
    ...payload,
  };

  registrationRequestsStore.unshift(request);
  return request;
}

export function approveRequest(requestId: string): RegistrationRequest | null {
  const request = registrationRequestsStore.find((item) => item.id === requestId);
  if (!request || request.status !== "pending") {
    return null;
  }

  request.status = "approved";
  residentsStore.unshift({
    id: crypto.randomUUID(),
    name: request.name,
    unit: request.unit,
    status: "Active",
    added: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  });

  return request;
}

export function rejectRequest(requestId: string): RegistrationRequest | null {
  const request = registrationRequestsStore.find((item) => item.id === requestId);
  if (!request || request.status !== "pending") {
    return null;
  }

  request.status = "rejected";
  return request;
}
