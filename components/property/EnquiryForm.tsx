"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { VISIT_WINDOW_DAYS, enquirySchema, getKolkataDateString } from "@/lib/schema/enquiry";
import { FormField } from "./FormField";

type FieldName = "name" | "phone" | "email" | "visitDate" | "message";
type Values = Record<FieldName, string> & { company: string };
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const FIELD_ORDER: FieldName[] = ["name", "phone", "email", "visitDate", "message"];
const fieldId = (name: FieldName) => `enquiry-${name}`;

// Same Zod schema as POST /api/enquiries, checked one field at a time.
function validateField(name: FieldName, value: string): string | undefined {
  const result = enquirySchema.shape[name].safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

function emptyValues(propertyTitle: string): Values {
  return { name: "", phone: "", email: "", visitDate: "", message: `I'd like to visit ${propertyTitle}.`, company: "" };
}

// "Today" in IST, read on the client only: the page is prerendered at build time, so a server value
// would be stale and differ from the browser (hydration mismatch). The server renders no min/max.
const noSubscription = () => () => {};
const useKolkataDate = (offsetDays: number) =>
  useSyncExternalStore(noSubscription, () => getKolkataDateString(offsetDays), () => undefined);

interface EnquiryFormProps {
  propertySlug: string;
  propertyTitle: string;
}

export function EnquiryForm({ propertySlug, propertyTitle }: EnquiryFormProps) {
  const [values, setValues] = useState<Values>(() => emptyValues(propertyTitle));
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState("");
  // Blocks a second submit before React re-renders the disabled button (Enter-key spam).
  const inFlight = useRef(false);
  const minDate = useKolkataDate(0);
  const maxDate = useKolkataDate(VISIT_WINDOW_DAYS);

  const setValue = (name: FieldName, value: string) => {
    setValues((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: validateField(name, value) }));
  };

  const showErrors = (nextErrors: Errors) => {
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find((name) => nextErrors[name]);
    if (firstInvalid) document.getElementById(fieldId(firstInvalid))?.focus();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inFlight.current) return;

    const nextErrors: Errors = {};
    for (const name of FIELD_ORDER) nextErrors[name] = validateField(name, values[name]);
    if (FIELD_ORDER.some((name) => nextErrors[name])) return showErrors(nextErrors);

    inFlight.current = true;
    setStatus("submitting");
    setBanner(null);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, propertySlug }),
      });
      const body = (await response.json().catch(() => null)) as
        | { id?: string; error?: string; issues?: { path: string; message: string }[] }
        | null;

      if (response.status === 201) {
        setReferenceId(body?.id ?? "");
        setStatus("success");
      } else if (response.status === 400 && body?.issues) {
        const serverErrors: Errors = {};
        for (const issue of body.issues) {
          if ((FIELD_ORDER as string[]).includes(issue.path)) serverErrors[issue.path as FieldName] = issue.message;
        }
        setStatus("idle");
        setBanner(Object.keys(serverErrors).length === 0 ? (body.error ?? "Please check the form.") : null);
        showErrors(serverErrors);
      } else if (response.status === 429) {
        const minutes = Math.max(1, Math.ceil(Number(response.headers.get("Retry-After") ?? 600) / 60));
        setStatus("error");
        setBanner(`Too many enquiries from this connection. Please try again in ${minutes} ${minutes === 1 ? "minute" : "minutes"}.`);
      } else {
        setStatus("error");
        setBanner("Something went wrong on our side. Your details are still here, please try again.");
      }
    } catch {
      setStatus("error");
      setBanner("Could not reach the server. Check your connection; your details are still here.");
    } finally {
      inFlight.current = false;
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="animate-fade-in space-y-5 rounded-3xl border border-brass bg-[#0e1624] p-8 text-center">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-12 w-12 text-brass" />
        <h2 className="font-display text-2xl font-light">Visit request received</h2>
        <p className="text-sm text-mist">Our team will call you within one working day to confirm a time.</p>
        {referenceId && <p className="text-xs text-mist">Reference: <strong className="text-brass">{referenceId}</strong></p>}
        <button
          type="button"
          onClick={() => {
            setValues(emptyValues(propertyTitle));
            setStatus("idle");
          }}
          className="btn-outline-brass cursor-pointer rounded-xl px-6 py-2.5 text-xs uppercase tracking-wider"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const isSubmitting = status === "submitting";
  const inputClass = "field px-4 py-3";

  return (
    <div id="enquiry" className="space-y-6 rounded-3xl border border-brass/25 bg-[#0e1624]/90 p-6 sm:p-8">
      <div className="space-y-2 border-b border-white/10 pb-4">
        <h2 className="font-display text-2xl font-light sm:text-3xl">Book a private visit</h2>
        <p className="text-xs leading-relaxed text-mist">
          Tell us when suits you and we will arrange a guided visit of <span className="text-ivory">{propertyTitle}</span>.
        </p>
      </div>

      {banner && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-200">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          {banner}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Honeypot: invisible to people and screen readers, bots tend to fill it. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="enquiry-company">Company</label>
          <input id="enquiry-company" name="company" tabIndex={-1} autoComplete="off" value={values.company}
            onChange={(event) => setValues((previous) => ({ ...previous, company: event.target.value }))} />
        </div>

        <FormField id={fieldId("name")} label="Full name" error={errors.name}>
          {(control) => (
            <input {...control} type="text" autoComplete="name" value={values.name} className={inputClass}
              onChange={(event) => setValue("name", event.target.value)}
              onBlur={() => setErrors((previous) => ({ ...previous, name: validateField("name", values.name) }))} />
          )}
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <FormField id={fieldId("phone")} label="Mobile number" error={errors.phone} hint="10-digit Indian mobile">
            {(control) => (
              <input {...control} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="98765 43210"
                value={values.phone} className={inputClass}
                onChange={(event) => setValue("phone", event.target.value)}
                onBlur={() => setErrors((previous) => ({ ...previous, phone: validateField("phone", values.phone) }))} />
            )}
          </FormField>
          <FormField id={fieldId("email")} label="Email" optional error={errors.email}>
            {(control) => (
              <input {...control} type="email" autoComplete="email" value={values.email} className={inputClass}
                onChange={(event) => setValue("email", event.target.value)}
                onBlur={() => setErrors((previous) => ({ ...previous, email: validateField("email", values.email) }))} />
            )}
          </FormField>
        </div>

        <FormField id={fieldId("visitDate")} label="Preferred visit date" error={errors.visitDate} hint={`Any day in the next ${VISIT_WINDOW_DAYS} days`}>
          {(control) => (
            <input {...control} type="date" min={minDate} max={maxDate} value={values.visitDate}
              className={`${inputClass} [color-scheme:dark]`}
              onChange={(event) => setValue("visitDate", event.target.value)}
              onBlur={() => setErrors((previous) => ({ ...previous, visitDate: validateField("visitDate", values.visitDate) }))} />
          )}
        </FormField>

        <FormField id={fieldId("message")} label="Message" error={errors.message}>
          {(control) => (
            <textarea {...control} rows={4} maxLength={1000} value={values.message} className={`${inputClass} leading-relaxed`}
              onChange={(event) => setValue("message", event.target.value)}
              onBlur={() => setErrors((previous) => ({ ...previous, message: validateField("message", values.message) }))} />
          )}
        </FormField>

        <button type="submit" disabled={isSubmitting}
          className="btn-brass flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-4 text-xs uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Sending…" : "Request a visit"}
        </button>
      </form>
    </div>
  );
}
