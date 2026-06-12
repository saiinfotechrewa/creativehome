"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EASE } from "@/lib/animations";
import { cn } from "@/lib/utils";

const REQUIREMENTS = [
  "CRM & Sales",
  "GST Accounting",
  "Attendance & Payroll",
  "WhatsApp Marketing",
  "Custom Development",
  "Something else",
];

const fieldClasses =
  "border-input bg-card text-foreground placeholder:text-muted focus:border-primary focus:ring-primary/30 h-11 w-full rounded-md border px-4 text-sm transition-colors outline-none focus:ring-2";

const labelClasses = "text-muted-foreground mb-1.5 block text-sm font-medium";

/**
 * Contact form — Name, Email, Phone, Business Name, Requirement, Message.
 * Swap the submit handler for a real API/email service later.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="border-border bg-card flex min-h-[420px] flex-col items-center justify-center rounded-2xl border p-10 text-center"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="text-foreground mt-6 text-xl font-semibold">
          Message sent — thank you!
        </h3>
        <p className="text-muted-foreground mt-2 max-w-sm leading-relaxed">
          We&apos;ve got your details and a member of our team will reach out
          within one business day.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="text-primary mt-6 text-sm font-medium hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border-border bg-card rounded-2xl border p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={labelClasses}>
            Name
          </label>
          <input
            id="cf-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelClasses}>
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelClasses}>
            Phone
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            className={fieldClasses}
          />
        </div>
        <div>
          <label htmlFor="cf-business" className={labelClasses}>
            Business Name
          </label>
          <input
            id="cf-business"
            name="business"
            autoComplete="organization"
            placeholder="Your company"
            className={fieldClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-requirement" className={labelClasses}>
            What do you need help with?
          </label>
          <select
            id="cf-requirement"
            name="requirement"
            required
            defaultValue=""
            className={cn(fieldClasses, "appearance-none pr-10")}
          >
            <option value="" disabled>
              Select a requirement
            </option>
            {REQUIREMENTS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className={labelClasses}>
            Message
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            rows={5}
            placeholder="Tell us a little about your business and what you're trying to solve…"
            className={cn(fieldClasses, "h-auto resize-y py-3 leading-relaxed")}
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full"
        iconRight={<Send className="h-4 w-4" />}
      >
        Send Message
      </Button>
      <p className="text-muted mt-3 text-center text-xs">
        We&apos;ll never share your details. No spam, ever.
      </p>
    </form>
  );
}
