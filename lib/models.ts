export type RequestStatus = "pending" | "approved" | "rejected";

export type ResidentStatus = "Active";

export type Resident = {
  id: string;
  name: string;
  unit: string;
  status: ResidentStatus;
  added: string;
};

export type RegistrationRequest = {
  id: string;
  name: string;
  unit: string;
  phone: string;
  phoneModel: string;
  submittedAt: string;
  status: RequestStatus;
};
