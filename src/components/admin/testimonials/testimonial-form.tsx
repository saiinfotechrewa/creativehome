"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { inputClass, labelClass, textareaClass, Field } from "@/components/admin/ui/form";
import { Modal } from "@/components/admin/ui/modal";
import {
  fetchIndustryOptions,
  catalogKeys,
} from "@/lib/admin/catalog-client";
import {
  createTestimonial,
  updateTestimonial,
  TESTIMONIAL_STATUSES,
  type Testimonial,
  type TestimonialInput,
} from "@/lib/admin/testimonials-client";

const EMPTY: TestimonialInput = {
  quote: "",
  name: "",
  role: "",
  company: "",
  industry: "",
  rating: 5,
  avatar: "",
  status: "PENDING",
  isDisplayed: false,
};

/** Clickable 1–5 star selector. */
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
          className="p-0.5"
        >
          <Star
            className={cn(
              "h-5 w-5 transition",
              (hover || value) >= n
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40",
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{value}/5</span>
    </div>
  );
}

export function TestimonialFormModal({
  open,
  onClose,
  onSaved,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  /** Existing testimonial when editing; null when adding. */
  editing: Testimonial | null;
}) {
  const [form, setForm] = useState<TestimonialInput>(EMPTY);

  // Seed the form whenever the modal opens (add vs edit).
  useEffect(() => {
    if (!open) return;
    setForm(
      editing
        ? {
            quote: editing.quote,
            name: editing.name,
            role: editing.role ?? "",
            company: editing.company ?? "",
            industry: editing.industry ?? "",
            rating: editing.rating,
            avatar: editing.avatar ?? "",
            status: editing.status,
            isDisplayed: editing.isDisplayed,
          }
        : EMPTY,
    );
  }, [open, editing]);

  const { data: industries } = useQuery({
    queryKey: catalogKeys.industries,
    queryFn: fetchIndustryOptions,
    staleTime: 5 * 60_000,
    enabled: open,
  });

  const patch = (p: Partial<TestimonialInput>) =>
    setForm((f) => ({ ...f, ...p }));

  const mutation = useMutation({
    mutationFn: () => {
      const payload: TestimonialInput = {
        ...form,
        role: form.role?.trim() || undefined,
        company: form.company?.trim() || undefined,
        industry: form.industry?.trim() || undefined,
        avatar: form.avatar?.trim() || undefined,
      };
      return editing
        ? updateTestimonial(editing.id, payload)
        : createTestimonial(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Testimonial updated" : "Testimonial added");
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const quoteTooShort = form.quote.trim().length < 10;
  const nameTooShort = form.name.trim().length < 2;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit testimonial" : "Add testimonial"}
      description="Customer quotes shown across the marketing site."
      className="max-w-2xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md border border-border px-3 text-sm text-foreground transition hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={quoteTooShort || nameTooShort || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {mutation.isPending
              ? "Saving…"
              : editing
                ? "Save changes"
                : "Add testimonial"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field
          label="Quote"
          error={
            quoteTooShort && form.quote.length > 0
              ? "At least 10 characters"
              : undefined
          }
        >
          <textarea
            value={form.quote}
            onChange={(e) => patch({ quote: e.target.value })}
            rows={3}
            placeholder="“CreativeDox transformed how we…”"
            className={textareaClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Name"
            error={
              nameTooShort && form.name.length > 0
                ? "At least 2 characters"
                : undefined
            }
          >
            <input
              value={form.name}
              onChange={(e) => patch({ name: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Role / title">
            <input
              value={form.role ?? ""}
              onChange={(e) => patch({ role: e.target.value })}
              placeholder="Founder & CEO"
              className={inputClass}
            />
          </Field>
          <Field label="Company">
            <input
              value={form.company ?? ""}
              onChange={(e) => patch({ company: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Industry">
            <input
              list="testimonial-industries"
              value={form.industry ?? ""}
              onChange={(e) => patch({ industry: e.target.value })}
              placeholder="Choose or type…"
              className={inputClass}
            />
            <datalist id="testimonial-industries">
              {industries?.map((i) => (
                <option key={i.id} value={i.name} />
              ))}
            </datalist>
          </Field>
        </div>

        <Field label="Avatar URL" hint="Square image works best (e.g. 128×128).">
          <div className="flex items-center gap-3">
            {form.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.avatar}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-xs text-muted-foreground">
                {form.name.trim().charAt(0).toUpperCase() || "?"}
              </span>
            )}
            <input
              value={form.avatar ?? ""}
              onChange={(e) => patch({ avatar: e.target.value })}
              placeholder="https://…"
              className={inputClass}
            />
          </div>
        </Field>

        <div>
          <label className={labelClass}>Rating</label>
          <StarRating
            value={form.rating}
            onChange={(n) => patch({ rating: n })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) =>
                patch({ status: e.target.value as TestimonialInput["status"] })
              }
              className={inputClass}
            >
              {TESTIMONIAL_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.isDisplayed}
                onChange={(e) => patch({ isDisplayed: e.target.checked })}
                disabled={form.status !== "APPROVED"}
                className="h-4 w-4 rounded border-border"
              />
              Show on public site
              {form.status !== "APPROVED" && (
                <span className="text-xs text-muted-foreground">
                  (approve first)
                </span>
              )}
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}
