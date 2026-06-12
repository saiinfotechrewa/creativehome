"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Footer email-capture form. Swap the submit handler for a real API later. */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  if (subscribed) {
    return (
      <p className="flex h-11 items-center gap-2 text-sm text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        Thanks — you&apos;re on the list. Talk soon!
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your work email"
        className="border-input bg-card text-foreground placeholder:text-muted focus:border-primary focus:ring-primary/30 h-11 flex-1 rounded-md border px-4 text-sm transition-colors outline-none focus:ring-2"
      />
      <Button type="submit" iconRight={<Send className="h-4 w-4" />}>
        Subscribe
      </Button>
    </form>
  );
}
