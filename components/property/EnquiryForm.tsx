"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Phone,
  User,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";
import { getKolkataDateString, normalizeIndianPhone } from "@/lib/schema/enquiry";

interface EnquiryFormProps {
  propertySlug: string;
  propertyTitle: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  visitDate?: string;
  message?: string;
  general?: string;
}

// Fallback dates during static prerender to satisfy Next.js 16 prerender checks
const STATIC_TODAY = "2026-10-29";
const STATIC_MAX = "2027-01-29";

export function EnquiryForm({ propertySlug, propertyTitle }: EnquiryFormProps) {
  const [dateLimits, setDateLimits] = useState({
    min: STATIC_TODAY,
    max: STATIC_MAX,
  });

  // Form fields state - preserved on failure
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    visitDate: "2026-10-30",
    message: `I would like to schedule a private viewing of ${propertyTitle}. Please provide available time slots and detailed specifications.`,
    company: "", // Honeypot
  });

  // Calculate live dynamic dates in useEffect after client hydration
  useEffect(() => {
    const today = getKolkataDateString(0);
    const max = getKolkataDateString(90);
    const tomorrow = getKolkataDateString(1);
    setDateLimits({ min: today, max });
    setFormData((prev) => ({
      ...prev,
      visitDate: tomorrow,
    }));
  }, []);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{
    id: string;
    message: string;
  } | null>(null);

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Full name must be at least 2 characters";
    }

    const cleanedPhone = normalizeIndianPhone(formData.phone);
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      newErrors.phone =
        "Please enter a valid 10-digit Indian mobile number (e.g. 9812345678)";
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.visitDate) {
      newErrors.visitDate = "Please select a preferred viewing date";
    } else if (
      formData.visitDate < dateLimits.min ||
      formData.visitDate > dateLimits.max
    ) {
      newErrors.visitDate = "Viewing date must be between today and next 90 days";
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submission while in flight
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        visitDate: formData.visitDate,
        message: formData.message.trim(),
        propertySlug,
        company: formData.company, // honeypot
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Collect field specific errors or general error without wiping typed inputs
        if (data.issues && Array.isArray(data.issues)) {
          const fieldErrors: FormErrors = {};
          data.issues.forEach((issue: { path: string; message: string }) => {
            fieldErrors[issue.path as keyof FormErrors] = issue.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({
            general:
              data.error ||
              "Unable to register your viewing request. Please try again.",
          });
        }
        setIsSubmitting(false);
        return;
      }

      // 201 Success: set confirmation and clear only after 201
      setSuccessResponse({
        id: data.id || `enq-${Date.now()}`,
        message:
          data.message ||
          "Your viewing request has been secured. Our relationship team will reach out promptly.",
      });
      setIsSubmitting(false);
    } catch {
      // Network or unexpected error: retain user inputs
      setErrors({
        general:
          "Network connectivity issue. Your details have been preserved—please try submitting again.",
      });
      setIsSubmitting(false);
    }
  };

  if (successResponse) {
    return (
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0e1624] border border-[#c9a36a] text-center space-y-6 shadow-2xl animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#141d2b] border border-[#c9a36a] flex items-center justify-center mx-auto text-[#c9a36a]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-[#c9a36a] uppercase block">
            CONFIDENTIAL RESERVATION
          </span>
          <h3 className="font-display text-2xl sm:text-3xl text-[#f4eee5] font-light">
            Viewing Consultation Secured
          </h3>
          <p className="text-xs sm:text-sm text-[#8f9ba8] font-sans font-light leading-relaxed max-w-md mx-auto">
            {successResponse.message}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0f18]/80 border border-white/5 font-mono text-xs text-[#8f9ba8] max-w-xs mx-auto">
          Reference Dossier:{" "}
          <strong className="text-[#c9a36a]">{successResponse.id}</strong>
        </div>

        <button
          onClick={() => {
            setSuccessResponse(null);
            setFormData({
              name: "",
              phone: "",
              email: "",
              visitDate: getKolkataDateString(1),
              message: `I would like to schedule a private viewing of ${propertyTitle}.`,
              company: "",
            });
          }}
          className="btn-outline-brass px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider font-mono cursor-pointer"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div
      className="p-6 sm:p-8 rounded-3xl bg-[#0e1624]/90 border border-[rgba(201,163,106,0.25)] shadow-2xl space-y-6"
      id="enquiry-section"
    >
      <div className="space-y-2 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono text-[#c9a36a]">
          <Lock className="w-3.5 h-3.5" />
          <span className="uppercase tracking-widest text-[10px]">
            PRIVATE CONCIERGE
          </span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-light text-[#f4eee5]">
          Request Private Viewing
        </h3>
        <p className="text-xs text-[#8f9ba8] font-sans font-light leading-relaxed">
          Schedule an architect-guided walk-through or request bespoke floor
          customization dossiers for{" "}
          <span className="text-[#f4eee5] font-medium">{propertyTitle}</span>.
        </p>
      </div>

      {/* General Alert on Error */}
      {errors.general && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-3"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Honeypot field (hidden from real users) */}
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, company: e.target.value }))
          }
          className="sr-only"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {/* Full Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="enquiry-name"
            className="block text-xs font-mono text-[#8f9ba8]"
          >
            Full Name <span className="text-[#c9a36a]">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f9ba8]" />
            <input
              id="enquiry-name"
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g. Vikramaditya Oberoi"
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#141d2b]/60 border text-sm text-[#f4eee5] placeholder-[#8f9ba8]/50 focus:outline-none transition-all ${
                errors.name
                  ? "border-red-500/60 focus:border-red-400"
                  : "border-[rgba(201,163,106,0.2)] focus:border-[#c9a36a]"
              }`}
            />
          </div>
          {errors.name && (
            <p className="text-[11px] font-mono text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Mobile Number & Email Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Indian Mobile */}
          <div className="space-y-1.5">
            <label
              htmlFor="enquiry-phone"
              className="block text-xs font-mono text-[#8f9ba8]"
            >
              Indian Mobile <span className="text-[#c9a36a]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#c9a36a] pointer-events-none">
                +91
              </span>
              <input
                id="enquiry-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, phone: e.target.value }));
                  if (errors.phone)
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="98765 43210"
                className={`w-full pl-12 pr-4 py-3 rounded-xl bg-[#141d2b]/60 border text-sm text-[#f4eee5] placeholder-[#8f9ba8]/50 focus:outline-none transition-all ${
                  errors.phone
                    ? "border-red-500/60 focus:border-red-400"
                    : "border-[rgba(201,163,106,0.2)] focus:border-[#c9a36a]"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] font-mono text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Email Address (Optional) */}
          <div className="space-y-1.5">
            <label
              htmlFor="enquiry-email"
              className="block text-xs font-mono text-[#8f9ba8]"
            >
              Email Address <span className="text-white/40">(Optional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f9ba8]" />
              <input
                id="enquiry-email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="oberoi@skyline.in"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#141d2b]/60 border text-sm text-[#f4eee5] placeholder-[#8f9ba8]/50 focus:outline-none transition-all ${
                  errors.email
                    ? "border-red-500/60 focus:border-red-400"
                    : "border-[rgba(201,163,106,0.2)] focus:border-[#c9a36a]"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] font-mono text-red-400">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Preferred Date of Visit */}
        <div className="space-y-1.5">
          <label
            htmlFor="enquiry-date"
            className="block text-xs font-mono text-[#8f9ba8]"
          >
            Preferred Visit Date <span className="text-[#c9a36a]">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f9ba8] pointer-events-none" />
            <input
              id="enquiry-date"
              type="date"
              min={dateLimits.min}
              max={dateLimits.max}
              value={formData.visitDate}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, visitDate: e.target.value }));
                if (errors.visitDate)
                  setErrors((prev) => ({ ...prev, visitDate: undefined }));
              }}
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#141d2b]/60 border text-sm text-[#f4eee5] focus:outline-none transition-all [color-scheme:dark] ${
                errors.visitDate
                  ? "border-red-500/60 focus:border-red-400"
                  : "border-[rgba(201,163,106,0.2)] focus:border-[#c9a36a]"
              }`}
            />
          </div>
          {errors.visitDate && (
            <p className="text-[11px] font-mono text-red-400">
              {errors.visitDate}
            </p>
          )}
        </div>

        {/* Message / Bespoke Requirements */}
        <div className="space-y-1.5">
          <label
            htmlFor="enquiry-message"
            className="block text-xs font-mono text-[#8f9ba8]"
          >
            Message & Architectural Notes <span className="text-[#c9a36a]">*</span>
          </label>
          <div className="relative">
            <textarea
              id="enquiry-message"
              rows={3}
              value={formData.message}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, message: e.target.value }));
                if (errors.message)
                  setErrors((prev) => ({ ...prev, message: undefined }));
              }}
              className={`w-full p-3.5 rounded-xl bg-[#141d2b]/60 border text-sm text-[#f4eee5] placeholder-[#8f9ba8]/50 focus:outline-none transition-all leading-relaxed ${
                errors.message
                  ? "border-red-500/60 focus:border-red-400"
                  : "border-[rgba(201,163,106,0.2)] focus:border-[#c9a36a]"
              }`}
            />
          </div>
          {errors.message && (
            <p className="text-[11px] font-mono text-red-400">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-brass py-4 rounded-xl text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0a0f18]" />
              <span>Registering Consultation...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-[#0a0f18]" />
              <span>Confirm Private Consultation</span>
            </>
          )}
        </button>

        {/* Privacy Note */}
        <p className="text-[10px] text-[#8f9ba8]/80 text-center font-mono">
          Strictly confidential. No spam. Direct liaison with Skyline Senior Relationship Managers.
        </p>
      </form>
    </div>
  );
}
