"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  CalendarPlus,
  Check,
  CircleHelp,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { PRODUCTS } from "@/data/products";
import { EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Form options                                                       */
/* ------------------------------------------------------------------ */

const BUSINESS_TYPES = [
  "Retail & Shops",
  "Restaurant & Cafe",
  "Healthcare & Clinic",
  "School & Education",
  "Manufacturing & Factory",
  "Real Estate",
  "Cable TV / ISP",
  "Services & Agency",
  "E-commerce",
  "Other",
];

const TEAM_SIZES = ["Just me", "2–10", "11–50", "51–200", "200+"];

/** Requirement options — every product plus an escape hatch. */
const REQUIREMENTS = [
  ...PRODUCTS.map((product) => ({
    id: product.id,
    label: product.name.replace("CreativeDox ", ""),
  })),
  { id: "custom", label: "Custom Development" },
  { id: "not-sure", label: "Not sure yet" },
];

const TIME_SLOTS = [
  { id: "morning", label: "Morning", hint: "9 AM – 12 PM", startHour: 10 },
  { id: "afternoon", label: "Afternoon", hint: "12 – 4 PM", startHour: 14 },
  { id: "evening", label: "Evening", hint: "4 – 7 PM", startHour: 17 },
];

const COMMUNICATION_METHODS = [
  { id: "call", label: "Phone Call", icon: Phone },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { id: "video", label: "Video Meet", icon: CalendarDays },
];

const STEPS = [
  { id: 1, title: "About you", icon: User },
  { id: 2, title: "Your business", icon: Building2 },
  { id: 3, title: "What you need", icon: Sparkles },
  { id: 4, title: "Pick a time", icon: CalendarDays },
];

const TOTAL_STEPS = STEPS.length;

/* ------------------------------------------------------------------ */
/*  Form state                                                         */
/* ------------------------------------------------------------------ */

interface FormData {
  name: string;
  phone: string;
  email: string;
  businessName: string;
  businessType: string;
  teamSize: string;
  requirements: string[];
  description: string;
  date: string;
  slot: string;
  method: string;
}

const INITIAL: FormData = {
  name: "",
  phone: "",
  email: "",
  businessName: "",
  businessType: "",
  teamSize: "",
  requirements: [],
  description: "",
  date: "",
  slot: "",
  method: "",
};

type Errors = Partial<Record<keyof FormData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s-]{7,}$/;

/** Validate just the fields belonging to a given step. */
function validateStep(step: number, data: FormData): Errors {
  const errors: Errors = {};
  if (step === 1) {
    if (!data.name.trim()) errors.name = "Please enter your name.";
    if (!PHONE_RE.test(data.phone.trim()))
      errors.phone = "Enter a valid phone number.";
    if (!EMAIL_RE.test(data.email.trim()))
      errors.email = "Enter a valid email address.";
  }
  if (step === 2) {
    if (!data.businessName.trim())
      errors.businessName = "Please enter your business name.";
    if (!data.businessType) errors.businessType = "Select a business type.";
    if (!data.teamSize) errors.teamSize = "Select your team size.";
  }
  if (step === 3) {
    if (data.requirements.length === 0)
      errors.requirements = "Pick at least one option.";
  }
  if (step === 4) {
    if (!data.date) errors.date = "Choose a preferred date.";
    if (!data.slot) errors.slot = "Choose a time slot.";
    if (!data.method) errors.method = "Choose how we should connect.";
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/*  Shared field styling (mirrors the contact form)                    */
/* ------------------------------------------------------------------ */

const fieldBase =
  "bg-card text-foreground placeholder:text-muted h-12 w-full rounded-lg border pl-11 pr-4 text-sm transition-colors outline-none focus:ring-2";
const fieldOk = "border-input focus:border-primary focus:ring-primary/30";
const fieldErr =
  "border-destructive/60 focus:border-destructive focus:ring-destructive/30";
const labelClasses =
  "text-muted-foreground mb-1.5 block text-sm font-medium tracking-tight";

/* ------------------------------------------------------------------ */
/*  Slide transition                                                   */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

/**
 * Four-step consultation booking form with progress bar, per-step
 * validation, animated slide transitions, a loading state, and a
 * celebratory thank-you screen with calendar export.
 */
export function ConsultationForm() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleRequirement = (id: string) => {
    setData((prev) => ({
      ...prev,
      requirements: prev.requirements.includes(id)
        ? prev.requirements.filter((r) => r !== id)
        : [...prev.requirements, id],
    }));
    if (errors.requirements)
      setErrors((prev) => ({ ...prev, requirements: undefined }));
  };

  const goNext = () => {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setDirection(-1);
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(4, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setStatus("loading");
    try {
      // Simulated network round-trip — swap for a real API/email service.
      await new Promise((resolve) => setTimeout(resolve, 1400));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return <ThankYou data={data} />;
  }

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="border-border bg-card/60 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl sm:p-8">
      {/* Ambient gradient accent */}
      <div
        aria-hidden
        className="from-primary/10 pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-radial to-transparent blur-3xl"
      />

      {/* Progress header */}
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Step {step} of {TOTAL_STEPS}
          </span>
          <span className="text-muted-foreground text-xs font-medium">
            {STEPS[step - 1]?.title}
          </span>
        </div>
        <div className="bg-accent h-1.5 w-full overflow-hidden rounded-full">
          <motion.div
            className="from-primary to-secondary h-full rounded-full bg-linear-to-r"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>

        {/* Step dots */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const active = s.id === step;
            const complete = s.id < step;
            return (
              <div key={s.id} className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border transition-colors",
                    complete && "border-primary/40 bg-primary/15 text-primary",
                    active &&
                      "border-primary from-primary to-secondary text-primary-foreground shadow-primary/25 bg-linear-to-br shadow-lg",
                    !active && !complete && "border-border bg-card text-muted"
                  )}
                >
                  {complete ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Steps */}
      <div className="relative mt-8 min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE }}
          >
            {step === 1 && (
              <StepOne data={data} errors={errors} update={update} />
            )}
            {step === 2 && (
              <StepTwo data={data} errors={errors} update={update} />
            )}
            {step === 3 && (
              <StepThree
                data={data}
                errors={errors}
                update={update}
                toggleRequirement={toggleRequirement}
              />
            )}
            {step === 4 && (
              <StepFour
                data={data}
                errors={errors}
                update={update}
                today={today}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Error banner for submit failures */}
      {status === "error" && (
        <p className="border-destructive/40 bg-destructive/10 text-destructive mt-4 rounded-lg border px-4 py-3 text-sm">
          Something went wrong submitting your request. Please try again.
        </p>
      )}

      {/* Navigation */}
      <div className="relative mt-8 flex items-center gap-3">
        {step > 1 && (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={goBack}
            disabled={status === "loading"}
            iconLeft={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
        )}

        {step < TOTAL_STEPS ? (
          <Button
            type="button"
            size="lg"
            className="flex-1"
            onClick={goNext}
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            variant="accent"
            size="lg"
            className="flex-1"
            onClick={handleSubmit}
            disabled={status === "loading"}
            iconRight={
              status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )
            }
          >
            {status === "loading" ? "Booking…" : "Book My Free Consultation"}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step field helpers                                                 */
/* ------------------------------------------------------------------ */

interface StepProps {
  data: FormData;
  errors: Errors;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-destructive mt-1.5 text-xs font-medium"
    >
      {message}
    </motion.p>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-foreground text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
    </div>
  );
}

/* ----- Step 1: Contact -------------------------------------------- */

function StepOne({ data, errors, update }: StepProps) {
  return (
    <div>
      <StepHeader
        title="Let's start with you"
        subtitle="So we know who we're speaking with."
      />
      <div className="grid gap-5">
        <div>
          <label htmlFor="bc-name" className={labelClasses}>
            Full name
          </label>
          <div className="relative">
            <User className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              id="bc-name"
              value={data.name}
              onChange={(e) => update("name", e.target.value)}
              autoComplete="name"
              placeholder="Your full name"
              className={cn(fieldBase, errors.name ? fieldErr : fieldOk)}
            />
          </div>
          <FieldError message={errors.name} />
        </div>

        <div>
          <label htmlFor="bc-phone" className={labelClasses}>
            Phone number
          </label>
          <div className="relative">
            <Phone className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              id="bc-phone"
              type="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              autoComplete="tel"
              placeholder="+91 98765 43210"
              className={cn(fieldBase, errors.phone ? fieldErr : fieldOk)}
            />
          </div>
          <FieldError message={errors.phone} />
        </div>

        <div>
          <label htmlFor="bc-email" className={labelClasses}>
            Email address
          </label>
          <div className="relative">
            <Mail className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              id="bc-email"
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
              placeholder="you@company.com"
              className={cn(fieldBase, errors.email ? fieldErr : fieldOk)}
            />
          </div>
          <FieldError message={errors.email} />
        </div>
      </div>
    </div>
  );
}

/* ----- Step 2: Business ------------------------------------------- */

const selectClasses =
  "bg-card text-foreground h-12 w-full appearance-none rounded-lg border pl-11 pr-10 text-sm transition-colors outline-none focus:ring-2";

function StepTwo({ data, errors, update }: StepProps) {
  return (
    <div>
      <StepHeader
        title="Tell us about your business"
        subtitle="Helps us tailor the right solution before we talk."
      />
      <div className="grid gap-5">
        <div>
          <label htmlFor="bc-business" className={labelClasses}>
            Business name
          </label>
          <div className="relative">
            <Building2 className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              id="bc-business"
              value={data.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              autoComplete="organization"
              placeholder="Your company"
              className={cn(
                fieldBase,
                errors.businessName ? fieldErr : fieldOk
              )}
            />
          </div>
          <FieldError message={errors.businessName} />
        </div>

        <div>
          <label htmlFor="bc-type" className={labelClasses}>
            Business type
          </label>
          <div className="relative">
            <Sparkles className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <select
              id="bc-type"
              value={data.businessType}
              onChange={(e) => update("businessType", e.target.value)}
              className={cn(
                selectClasses,
                errors.businessType ? fieldErr : fieldOk
              )}
            >
              <option value="" disabled>
                Select your industry
              </option>
              {BUSINESS_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <Chevron />
          </div>
          <FieldError message={errors.businessType} />
        </div>

        <div>
          <span className={labelClasses}>Team size</span>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {TEAM_SIZES.map((size) => {
              const active = data.teamSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => update("teamSize", size)}
                  className={cn(
                    "flex h-12 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-muted"
                  )}
                >
                  <Users className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                  {size}
                </button>
              );
            })}
          </div>
          <FieldError message={errors.teamSize} />
        </div>
      </div>
    </div>
  );
}

/* ----- Step 3: Requirements --------------------------------------- */

interface StepThreeProps extends StepProps {
  toggleRequirement: (id: string) => void;
}

function StepThree({
  data,
  errors,
  update,
  toggleRequirement,
}: StepThreeProps) {
  return (
    <div>
      <StepHeader
        title="What are you looking to solve?"
        subtitle="Choose everything that's relevant — pick more than one if you like."
      />
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {REQUIREMENTS.map((req) => {
          const checked = data.requirements.includes(req.id);
          const isNotSure = req.id === "not-sure";
          return (
            <button
              key={req.id}
              type="button"
              onClick={() => toggleRequirement(req.id)}
              className={cn(
                "group flex items-center gap-3 rounded-lg border px-3.5 py-3 text-left text-sm font-medium transition-colors",
                checked
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-muted"
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
                  checked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted bg-transparent"
                )}
              >
                {checked && <Check className="h-3.5 w-3.5" />}
              </span>
              <span className="flex items-center gap-1.5">
                {isNotSure && (
                  <CircleHelp className="text-muted h-4 w-4 shrink-0" />
                )}
                {req.label}
              </span>
            </button>
          );
        })}
      </div>
      <FieldError message={errors.requirements} />

      <div className="mt-5">
        <label htmlFor="bc-desc" className={labelClasses}>
          Anything else we should know?{" "}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          id="bc-desc"
          rows={4}
          value={data.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Tell us a little about your current process and what you're hoping to improve…"
          className={cn(
            "bg-card text-foreground placeholder:text-muted border-input focus:border-primary focus:ring-primary/30 w-full resize-y rounded-lg border px-4 py-3 text-sm leading-relaxed transition-colors outline-none focus:ring-2"
          )}
        />
      </div>
    </div>
  );
}

/* ----- Step 4: Schedule ------------------------------------------- */

interface StepFourProps extends StepProps {
  today: string;
}

function StepFour({ data, errors, update, today }: StepFourProps) {
  return (
    <div>
      <StepHeader
        title="When works best for you?"
        subtitle="Pick a slot — we'll confirm by your preferred channel."
      />
      <div className="grid gap-5">
        <div>
          <label htmlFor="bc-date" className={labelClasses}>
            Preferred date
          </label>
          <div className="relative">
            <CalendarDays className="text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              id="bc-date"
              type="date"
              min={today}
              value={data.date}
              onChange={(e) => update("date", e.target.value)}
              className={cn(
                fieldBase,
                "[color-scheme:dark]",
                errors.date ? fieldErr : fieldOk
              )}
            />
          </div>
          <FieldError message={errors.date} />
        </div>

        <div>
          <span className={labelClasses}>Time slot</span>
          <div className="grid grid-cols-3 gap-2.5">
            {TIME_SLOTS.map((slot) => {
              const active = data.slot === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => update("slot", slot.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border px-2 py-3 transition-colors",
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-muted"
                  )}
                >
                  <Clock
                    className={cn(
                      "h-4 w-4",
                      active ? "text-primary" : "text-muted"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      active ? "text-primary" : "text-foreground"
                    )}
                  >
                    {slot.label}
                  </span>
                  <span className="text-muted text-[11px]">{slot.hint}</span>
                </button>
              );
            })}
          </div>
          <FieldError message={errors.slot} />
        </div>

        <div>
          <span className={labelClasses}>How should we connect?</span>
          <div className="grid grid-cols-3 gap-2.5">
            {COMMUNICATION_METHODS.map((m) => {
              const Icon = m.icon;
              const active = data.method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => update("method", m.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 transition-colors",
                    active
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      active ? "text-primary" : "text-muted"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      active ? "text-primary" : "text-foreground"
                    )}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
          <FieldError message={errors.method} />
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className="text-muted pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Thank-you screen                                                   */
/* ------------------------------------------------------------------ */

/** Build a Google Calendar "add event" URL from the chosen slot. */
function calendarUrl(data: FormData): string {
  const slot = TIME_SLOTS.find((s) => s.id === data.slot);
  const startHour = slot?.startHour ?? 10;
  const [y, m, d] = data.date.split("-").map(Number);
  const start = new Date(y || 2026, (m || 1) - 1, d || 1, startHour, 0, 0);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  const fmt = (dt: Date) =>
    dt
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "CreativeDox — Free Consultation",
    dates: `${fmt(start)}/${fmt(end)}`,
    details:
      "Your free, no-obligation consultation with the CreativeDox team. We'll reach out to confirm before the call.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function ThankYou({ data }: { data: FormData }) {
  const niceDate = data.date
    ? new Date(`${data.date}T00:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "your selected date";
  const slot = TIME_SLOTS.find((s) => s.id === data.slot);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="border-border bg-card/60 relative overflow-hidden rounded-2xl border p-8 text-center backdrop-blur-xl sm:p-12"
    >
      <div
        aria-hidden
        className="from-primary/15 pointer-events-none absolute inset-x-0 -top-20 mx-auto h-64 w-64 rounded-full bg-radial to-transparent blur-3xl"
      />

      <div className="relative flex flex-col items-center">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 16,
            delay: 0.1,
          }}
          className="grid h-20 w-20 place-items-center rounded-full border border-emerald-500/30 bg-emerald-500/10"
        >
          <motion.svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-10 w-10 text-emerald-400"
          >
            <motion.path
              d="M4 12.5 9.5 18 20 6.5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
            />
          </motion.svg>
        </motion.div>

        <h3 className="text-foreground mt-6 text-2xl font-bold tracking-tight">
          You&apos;re all booked
          {data.name ? `, ${data.name.split(" ")[0]}` : ""}!
        </h3>
        <p className="text-muted-foreground mt-3 max-w-md leading-relaxed">
          Thanks for reaching out. We&apos;ve received your request for{" "}
          <span className="text-foreground font-medium">{niceDate}</span>
          {slot ? (
            <>
              {" "}
              <span className="text-foreground font-medium">
                ({slot.label.toLowerCase()})
              </span>
            </>
          ) : null}
          . A CreativeDox specialist will confirm your slot within one business
          day.
        </p>

        <div className="border-border bg-card/80 mt-6 w-full max-w-sm rounded-xl border p-4 text-left">
          <p className="text-muted text-xs font-medium tracking-wide uppercase">
            What we&apos;ll send you
          </p>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            A confirmation by{" "}
            {COMMUNICATION_METHODS.find((m) => m.id === data.method)?.label ??
              "your preferred channel"}{" "}
            with a calendar invite and a short prep checklist.
          </p>
        </div>

        <div className="mt-7 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={calendarUrl(data)}
            external
            variant="accent"
            size="lg"
            className="flex-1"
            iconLeft={<CalendarPlus className="h-4 w-4" />}
          >
            Add to Calendar
          </ButtonLink>
          <ButtonLink
            href="/#solutions"
            variant="secondary"
            size="lg"
            className="flex-1"
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Explore Solutions
          </ButtonLink>
        </div>
      </div>
    </motion.div>
  );
}
