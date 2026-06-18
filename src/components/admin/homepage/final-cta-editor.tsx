"use client";

import {
  Field,
  FormSection,
  inputClass,
  textareaClass,
} from "@/components/admin/ui/form";
import {
  finalCtaSchema,
  FINAL_CTA_DEFAULT,
  type FinalCtaContent,
} from "@/lib/admin/homepage-client";
import { useSectionForm } from "./use-section-form";
import { EditorShell, RowCard } from "./editor-kit";

export function FinalCtaEditor({ canManage }: { canManage: boolean }) {
  const { form, isLoading, isError, error, isSaving, save } =
    useSectionForm<FinalCtaContent>({
      sectionKey: "finalCta",
      schema: finalCtaSchema,
      defaults: FINAL_CTA_DEFAULT,
    });
  const {
    register,
    formState: { errors, isDirty },
  } = form;

  return (
    <EditorShell
      isLoading={isLoading}
      isError={isError}
      error={error}
      isSaving={isSaving}
      isDirty={isDirty}
      canManage={canManage}
      onSubmit={save}
    >
      <FormSection title="Closing message">
        <Field label="Headline" error={errors.headline?.message}>
          <input
            className={inputClass}
            disabled={!canManage}
            {...register("headline")}
          />
        </Field>
        <Field
          label="Highlighted word"
          hint="A word within the headline rendered in the accent colour."
          error={errors.highlight?.message}
        >
          <input
            className={inputClass}
            disabled={!canManage}
            {...register("highlight")}
          />
        </Field>
        <Field label="Subheadline" error={errors.subheadline?.message}>
          <textarea
            className={textareaClass}
            disabled={!canManage}
            {...register("subheadline")}
          />
        </Field>
        <Field
          label="WhatsApp line"
          hint="Optional line nudging visitors to message on WhatsApp."
          error={errors.whatsapp?.message}
        >
          <input
            className={inputClass}
            disabled={!canManage}
            placeholder="Prefer WhatsApp? Message us at +91 90000 00000"
            {...register("whatsapp")}
          />
        </Field>
      </FormSection>

      <FormSection title="Call-to-action buttons">
        <div className="grid gap-4 sm:grid-cols-2">
          <RowCard title="Primary button">
            <div className="space-y-3">
              <Field label="Text" error={errors.ctaPrimary?.text?.message}>
                <input
                  className={inputClass}
                  disabled={!canManage}
                  {...register("ctaPrimary.text")}
                />
              </Field>
              <Field label="Link" error={errors.ctaPrimary?.link?.message}>
                <input
                  className={inputClass}
                  disabled={!canManage}
                  {...register("ctaPrimary.link")}
                />
              </Field>
            </div>
          </RowCard>
          <RowCard title="Secondary button">
            <div className="space-y-3">
              <Field label="Text" error={errors.ctaSecondary?.text?.message}>
                <input
                  className={inputClass}
                  disabled={!canManage}
                  {...register("ctaSecondary.text")}
                />
              </Field>
              <Field label="Link" error={errors.ctaSecondary?.link?.message}>
                <input
                  className={inputClass}
                  disabled={!canManage}
                  {...register("ctaSecondary.link")}
                />
              </Field>
            </div>
          </RowCard>
        </div>
      </FormSection>
    </EditorShell>
  );
}
