export const UNIT_OPTIONS = ["1", "2", "3", "4", "5"] as const;

type ValidationOk<T> = { ok: true; data: T };
type ValidationError = { ok: false; message: string };
type ValidationResult<T> = ValidationOk<T> | ValidationError;

export type RegistrationInput = {
  name: string;
  unit: string;
  phone: string;
  phoneModel: string;
};

export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AccessStatusInput = {
  name: string;
  phone: string;
};

function asObject(input: unknown): Record<string, unknown> | null {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }
  return input as Record<string, unknown>;
}

function asTrimmedString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input.trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

export function validateRegistrationPayload(
  input: unknown
): ValidationResult<RegistrationInput> {
  const payload = asObject(input);
  if (!payload) {
    return { ok: false, message: "Invalid request body." };
  }

  const name = asTrimmedString(payload.name);
  const unit = asTrimmedString(payload.unit);
  const phone = asTrimmedString(payload.phone).replace(/\D/g, "");
  const phoneModel = asTrimmedString(payload.phoneModel);

  if (!name) {
    return { ok: false, message: "Name is required." };
  }
  if (name.length < 2 || name.length > 80) {
    return { ok: false, message: "Name must be between 2 and 80 characters." };
  }
  if (!UNIT_OPTIONS.includes(unit as (typeof UNIT_OPTIONS)[number])) {
    return { ok: false, message: "Invalid unit selected." };
  }
  if (!phone) {
    return { ok: false, message: "Phone number is required." };
  }
  if (!isValidPhone(phone)) {
    return {
      ok: false,
      message:
        "Phone number must be a valid 11-digit Philippine mobile starting with 09.",
    };
  }
  if (!phoneModel) {
    return { ok: false, message: "Phone model is required." };
  }
  if (phoneModel.length < 2 || phoneModel.length > 80) {
    return {
      ok: false,
      message: "Phone model must be between 2 and 80 characters.",
    };
  }

  return {
    ok: true,
    data: {
      name,
      unit,
      phone,
      phoneModel,
    },
  };
}

export function validateAdminLoginPayload(
  input: unknown
): ValidationResult<AdminLoginInput> {
  const payload = asObject(input);
  if (!payload) {
    return { ok: false, message: "Invalid request body." };
  }

  const email = asTrimmedString(payload.email);
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email || !isValidEmail(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (!password) {
    return { ok: false, message: "Password is required." };
  }
  if (password.length > 256) {
    return { ok: false, message: "Password is too long." };
  }

  return {
    ok: true,
    data: { email, password },
  };
}

export function validateAccessStatusPayload(
  input: unknown
): ValidationResult<AccessStatusInput> {
  const payload = asObject(input);
  if (!payload) {
    return { ok: false, message: "Invalid request body." };
  }

  const name = asTrimmedString(payload.name);
  const phone = asTrimmedString(payload.phone).replace(/\D/g, "");

  if (!name) {
    return { ok: false, message: "Name is required." };
  }
  if (name.length < 2 || name.length > 80) {
    return { ok: false, message: "Name must be between 2 and 80 characters." };
  }
  if (!isValidPhone(phone)) {
    return {
      ok: false,
      message:
        "Phone number must be a valid 11-digit Philippine mobile starting with 09.",
    };
  }

  return {
    ok: true,
    data: { name, phone },
  };
}

export function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
