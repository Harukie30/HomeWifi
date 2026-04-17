"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

export type RegisterResidentFormData = {
  name: string;
  unit: string;
  phone: string;
  phoneModel: string;
};

type RegisterResidentModalProps = {
  open: boolean;
  onClose: () => void;
  onRegister: (data: RegisterResidentFormData) => Promise<boolean>;
};

const unitOptions = ["1", "2", "3", "4", "5"];

/** Philippine mobile: 11 digits, starts with 09 */
function isValidPhilippineMobile(phone: string): boolean {
  return /^09\d{9}$/.test(phone);
}

export function RegisterResidentModal({
  open,
  onClose,
  onRegister,
}: RegisterResidentModalProps) {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isTermsProcessing, setIsTermsProcessing] = useState(false);
  const [isTermsAcceptingSuccess, setIsTermsAcceptingSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    unit?: string;
    phone?: string;
    phoneModel?: string;
    terms?: string;
  }>({});
  const [form, setForm] = useState<RegisterResidentFormData>({
    name: "",
    unit: "1",
    phone: "",
    phoneModel: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: {
      name?: string;
      unit?: string;
      phone?: string;
      phoneModel?: string;
      terms?: string;
    } = {};

    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.unit.trim()) nextErrors.unit = "Unit is required.";
    const phoneDigits = form.phone.trim();
    if (!phoneDigits) {
      nextErrors.phone = "Phone number is required.";
    } else if (phoneDigits.length !== 11) {
      nextErrors.phone = "Phone number must be exactly 11 digits.";
    } else if (!isValidPhilippineMobile(phoneDigits)) {
      nextErrors.phone =
        "Use a Philippine mobile number starting with 09 (e.g. 09XXXXXXXXX).";
    }
    if (!form.phoneModel.trim()) {
      nextErrors.phoneModel = "Phone model is required.";
    }
    if (!hasAcceptedTerms) {
      nextErrors.terms = "You must accept the Terms & Agreement.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      setPhoneError(nextErrors.phone ?? "");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);
    try {
      const isSuccess = await onRegister({
        name: form.name.trim(),
        unit: form.unit,
        phone: form.phone.trim(),
        phoneModel: form.phoneModel.trim(),
      });

      if (!isSuccess) {
        setSubmitError("Unable to submit request. Please try again.");
        toast.error("Failed to submit registration request.");
        return;
      }

      setForm({
        name: "",
        unit: "1",
        phone: "",
        phoneModel: "",
      });
      setHasAcceptedTerms(false);
      setFormErrors({});
      setPhoneError("");
      toast.success("Registration request sent successfully.");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-[3px] animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-lg overflow-hidden border-zinc-200/90 bg-white py-0 shadow-2xl shadow-black/20 animate-in zoom-in-95 slide-in-from-bottom-2 duration-300 dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(event) => event.stopPropagation()}
      >
        <CardHeader className="space-y-3 border-b border-zinc-200 bg-gradient-to-r from-amber-50/70 to-transparent px-6 pb-5 pt-6 dark:border-zinc-800 dark:from-amber-500/10">
          <div className="flex items-start justify-between gap-4">
            <Badge
              variant="outline"
              className="border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-200"
            >
              Registration Request
            </Badge>
            <Button
              type="button"
              variant="ghost"
              className="h-8 bg-red-600 hover:bg-red-700 hover:text-white text-white cursor-pointer rounded-full px-3 text-xs"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
          <CardTitle className="text-xl">Register resident</CardTitle>
          <CardDescription>
            Register a resident for apartment WiFi access. This will be sent to
            the admin dashboard for approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form className="mt-1 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label
                htmlFor="resident-name"
                className="text-xs uppercase tracking-wide text-zinc-500"
              >
                Name
              </Label>
              <Input
                id="resident-name"
                value={form.name}
                  onChange={(event) => {
                    setForm((current) => ({
                    ...current,
                    name: event.target.value,
                    }));
                    setFormErrors((current) => ({ ...current, name: undefined }));
                  }}
                placeholder="Juan Dela Cruz"
                  aria-invalid={formErrors.name ? "true" : "false"}
                required
              />
                {formErrors.name ? (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {formErrors.name}
                  </p>
                ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="resident-unit"
                  className="text-xs uppercase tracking-wide text-zinc-500"
                >
                  Unit
                </Label>
                <Combobox
                  value={form.unit}
                  onValueChange={(value) => {
                    setForm((current) => ({
                      ...current,
                      unit: value ?? current.unit,
                    }));
                    setFormErrors((current) => ({ ...current, unit: undefined }));
                  }}
                  items={unitOptions}
                >
                  <ComboboxInput
                    id="resident-unit"
                    placeholder="Select unit"
                    className="w-full"
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No unit found.</ComboboxEmpty>
                    <ComboboxList>
                      {unitOptions.map((unit) => (
                        <ComboboxItem key={unit} value={unit}>
                          Unit {unit}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {formErrors.unit ? (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {formErrors.unit}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="resident-phone"
                  className="text-xs uppercase tracking-wide text-zinc-500"
                >
                  Phone number
                </Label>
                <p className="text-[11px] leading-snug text-zinc-500 dark:text-zinc-400">
                  Philippine mobile only — 11 digits starting with{" "}
                  <span className="font-mono text-zinc-600 dark:text-zinc-300">
                    09
                  </span>
                  .
                </p>
                <Input
                  id="resident-phone"
                  value={form.phone}
                  onChange={(event) => {
                    const sanitizedPhone = event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 11);
                    setForm((current) => ({
                      ...current,
                      phone: sanitizedPhone,
                    }));
                    if (sanitizedPhone.length === 0) {
                      setPhoneError("");
                    } else if (
                      sanitizedPhone.length >= 2 &&
                      !sanitizedPhone.startsWith("09")
                    ) {
                      setPhoneError(
                        "Phone number must start with 09."
                      );
                    } else if (
                      sanitizedPhone.length === 11 &&
                      !isValidPhilippineMobile(sanitizedPhone)
                    ) {
                      setPhoneError(
                        "Use a Philippine mobile number starting with 09."
                      );
                    } else {
                      setPhoneError("");
                    }
                    setFormErrors((current) => ({ ...current, phone: undefined }));
                  }}
                  onBlur={() => {
                    const p = form.phone;
                    if (p.length === 0) {
                      setPhoneError("");
                      return;
                    }
                    if (p.length !== 11) {
                      setPhoneError("Phone number must be exactly 11 digits.");
                      return;
                    }
                    if (!isValidPhilippineMobile(p)) {
                      setPhoneError(
                        "Use a Philippine mobile number starting with 09 (e.g. 09XXXXXXXXX)."
                      );
                      return;
                    }
                    setPhoneError("");
                  }}
                  inputMode="numeric"
                  pattern="09[0-9]{9}"
                  autoComplete="tel-national"
                  maxLength={11}
                  placeholder="09XXXXXXXXX"
                  aria-invalid={phoneError ? "true" : "false"}
                  required
                />
                {formErrors.phone || phoneError ? (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {formErrors.phone ?? phoneError}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="resident-phone-model"
                className="text-xs uppercase tracking-wide text-zinc-500"
              >
                Phone model
              </Label>
              <Input
                id="resident-phone-model"
                value={form.phoneModel}
                  onChange={(event) => {
                    setForm((current) => ({
                    ...current,
                    phoneModel: event.target.value,
                    }));
                    setFormErrors((current) => ({
                      ...current,
                      phoneModel: undefined,
                    }));
                  }}
                placeholder="iPhone 14 / Samsung A55"
                  aria-invalid={formErrors.phoneModel ? "true" : "false"}
                required
              />
                {formErrors.phoneModel ? (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {formErrors.phoneModel}
                  </p>
                ) : null}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <div className="mr-auto space-y-1">
                <p className="max-w-[min(100%,20rem)] text-pretty  text-md leading-relaxed text-zinc-600 dark:text-zinc-300">
                  Please review and accept the{" "}
                  <button
                    type="button"
                    className="inline font-medium text-amber-700 underline cursor-pointer underline-offset-[3px] decoration-amber-600/40 transition-colors hover:text-amber-800 dark:text-amber-400 dark:decoration-amber-500/40 dark:hover:text-amber-300"
                    onClick={() => setIsTermsModalOpen(true)}
                  >
                    {"Terms & Agreement"}
                  </button>{" "}
                  before registering.
                </p>
                {formErrors.terms ? (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {formErrors.terms}
                  </p>
                ) : null}
              </div>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !hasAcceptedTerms}
                        className="min-w-24 cursor-pointer rounded-full bg-amber-500 px-3 text-xs text-black hover:bg-amber-600 hover:text-white"
                      >
                        {isSubmitting ? (
                          <span className="inline-flex items-center gap-2">
                            <Spinner className="size-3.5" />
                            Sending...
                          </span>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Read and accept the Terms & Agreement before registering.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {submitError ? (
              <p className="text-xs text-red-600 dark:text-red-400">{submitError}</p>
            ) : null}
          </form>
        </CardContent>
      </Card>
      {isTermsModalOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
          onClick={() => {
            if (isTermsAcceptingSuccess || isTermsProcessing) return;
            setIsTermsModalOpen(false);
          }}
        >
          <Card
            className="w-full max-w-md border-zinc-200 bg-white py-0 dark:border-zinc-800 dark:bg-zinc-900"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader className="px-5 pt-5">
              <CardTitle className="text-lg">Terms & Agreement</CardTitle>
              <CardDescription>
                Please review and accept before submitting your registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-5 pb-5 text-sm text-zinc-700 dark:text-zinc-300">
              {isTermsProcessing ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="rounded-full border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/70">
                    <Spinner className="size-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Saving your agreement
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Please wait for a moment...
                  </p>
                </div>
              ) : isTermsAcceptingSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative">
                    <span
                      className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping"
                      aria-hidden
                    />
                    <CheckCircle2
                      className="relative size-11 text-emerald-600 dark:text-emerald-400"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    Agreement accepted
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    You can now submit your registration.
                  </p>
                </div>
              ) : (
                <>
                  <p>
                    By registering, you confirm the details you provided are
                    correct and authorize Abella Home admin to review your
                    request.
                  </p>
                  <p>
                    WiFi access is for authorized resident use only and may be
                    suspended if policy violations are found.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-blue-500 text-white cursor-pointer hover:bg-blue-600 hover:text-white"
                      disabled={isTermsAcceptingSuccess || isTermsProcessing}
                      onClick={() => {
                        setHasAcceptedTerms(false);
                        setFormErrors((current) => ({
                          ...current,
                          terms: "You must accept the Terms & Agreement.",
                        }));
                        setIsTermsModalOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="bg-amber-500 text-black cursor-pointer hover:bg-amber-600 hover:text-white"
                      disabled={isTermsAcceptingSuccess || isTermsProcessing}
                      onClick={() => {
                        setIsTermsProcessing(true);
                        window.setTimeout(() => {
                          setIsTermsProcessing(false);
                          setHasAcceptedTerms(true);
                          setFormErrors((current) => ({
                            ...current,
                            terms: undefined,
                          }));
                          setIsTermsAcceptingSuccess(true);
                          window.setTimeout(() => {
                            setIsTermsAcceptingSuccess(false);
                            setIsTermsModalOpen(false);
                          }, 900);
                        }, 2500);
                      }}
                    >
                      Accept
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
