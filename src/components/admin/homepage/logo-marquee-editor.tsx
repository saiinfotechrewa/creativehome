"use client";

import { useFieldArray } from "react-hook-form";

import { Field, FormSection, inputClass } from "@/components/admin/ui/form";
import { DraggableList } from "@/components/admin/ui/draggable-list";
import {
  logoMarqueeSchema,
  LOGO_MARQUEE_DEFAULT,
  type LogoMarqueeContent,
} from "@/lib/admin/homepage-client";
import { useSectionForm } from "./use-section-form";
import { AddItemButton, EditorShell, RowCard } from "./editor-kit";

export function LogoMarqueeEditor({ canManage }: { canManage: boolean }) {
  const { form, isLoading, isError, error, isSaving, save } =
    useSectionForm<LogoMarqueeContent>({
      sectionKey: "logoMarquee",
      schema: logoMarqueeSchema,
      defaults: LOGO_MARQUEE_DEFAULT,
    });
  const {
    register,
    watch,
    formState: { errors, isDirty },
  } = form;
  const logos = useFieldArray({ control: form.control, name: "logos" });

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
      <FormSection title="Heading">
        <Field label="Heading" error={errors.heading?.message}>
          <input
            className={inputClass}
            disabled={!canManage}
            {...register("heading")}
          />
        </Field>
      </FormSection>

      <FormSection
        title="Logos"
        description="Partner / tech logos in the scrolling marquee. Leave the image blank to show the name as a wordmark. Drag to reorder."
      >
        {errors.logos?.message && (
          <p className="text-xs text-rose-400">{errors.logos.message}</p>
        )}
        <DraggableList
          items={logos.fields}
          getId={(f) => f.id}
          onMove={(from, to) => logos.move(from, to)}
          disabled={!canManage}
          renderItem={(field, idx) => {
            const url = watch(`logos.${idx}.image`);
            return (
              <RowCard
                onRemove={canManage ? () => logos.remove(idx) : undefined}
                disabled={!canManage}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-background">
                    {url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt=""
                        className="max-h-9 max-w-full object-contain"
                      />
                    ) : (
                      <span className="px-1 text-center text-[10px] text-muted-foreground">
                        no img
                      </span>
                    )}
                  </div>
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <Field
                      label="Name"
                      error={errors.logos?.[idx]?.name?.message}
                    >
                      <input
                        className={inputClass}
                        disabled={!canManage}
                        {...register(`logos.${idx}.name`)}
                      />
                    </Field>
                    <Field
                      label="Image URL"
                      error={errors.logos?.[idx]?.image?.message}
                    >
                      <input
                        className={inputClass}
                        disabled={!canManage}
                        placeholder="https://…/logo.svg"
                        {...register(`logos.${idx}.image`)}
                      />
                    </Field>
                  </div>
                </div>
              </RowCard>
            );
          }}
        />
        {canManage && (
          <AddItemButton
            label="Add logo"
            onClick={() => logos.append({ name: "", image: "" })}
          />
        )}
      </FormSection>
    </EditorShell>
  );
}
