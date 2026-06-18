"use client";

import { Controller, useFieldArray } from "react-hook-form";

import {
  Field,
  FormSection,
  inputClass,
  textareaClass,
} from "@/components/admin/ui/form";
import { IconPicker } from "@/components/admin/ui/icon-picker";
import { DraggableList } from "@/components/admin/ui/draggable-list";
import {
  processSchema,
  PROCESS_DEFAULT,
  type ProcessContent,
} from "@/lib/admin/homepage-client";
import { useSectionForm } from "./use-section-form";
import { AddItemButton, EditorShell, RowCard } from "./editor-kit";

export function ProcessEditor({ canManage }: { canManage: boolean }) {
  const { form, isLoading, isError, error, isSaving, save } =
    useSectionForm<ProcessContent>({
      sectionKey: "process",
      schema: processSchema,
      defaults: PROCESS_DEFAULT,
    });
  const {
    register,
    control,
    formState: { errors, isDirty },
  } = form;
  const steps = useFieldArray({ control, name: "steps" });

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
      <FormSection title="Section heading">
        <Field label="Heading" error={errors.heading?.message}>
          <input
            className={inputClass}
            disabled={!canManage}
            {...register("heading")}
          />
        </Field>
        <Field label="Subheading" error={errors.subheading?.message}>
          <textarea
            className={textareaClass}
            disabled={!canManage}
            {...register("subheading")}
          />
        </Field>
      </FormSection>

      <FormSection
        title="Steps"
        description="The how-it-works timeline. Drag to reorder."
      >
        {errors.steps?.message && (
          <p className="text-xs text-rose-400">{errors.steps.message}</p>
        )}
        <DraggableList
          items={steps.fields}
          getId={(f) => f.id}
          onMove={(from, to) => steps.move(from, to)}
          disabled={!canManage}
          renderItem={(field, idx) => (
            <RowCard
              title={`Step ${idx + 1}`}
              onRemove={canManage ? () => steps.remove(idx) : undefined}
              disabled={!canManage}
            >
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[6rem_11rem_1fr]">
                  <Field
                    label="Number"
                    error={errors.steps?.[idx]?.number?.message}
                  >
                    <input
                      type="number"
                      className={inputClass}
                      disabled={!canManage}
                      {...register(`steps.${idx}.number`)}
                    />
                  </Field>
                  <Controller
                    control={control}
                    name={`steps.${idx}.icon`}
                    render={({ field: f }) => (
                      <IconPicker
                        label="Icon"
                        value={f.value}
                        onChange={f.onChange}
                        disabled={!canManage}
                        error={errors.steps?.[idx]?.icon?.message}
                      />
                    )}
                  />
                  <Field
                    label="Title"
                    error={errors.steps?.[idx]?.title?.message}
                  >
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      {...register(`steps.${idx}.title`)}
                    />
                  </Field>
                </div>
                <Field
                  label="Description"
                  error={errors.steps?.[idx]?.description?.message}
                >
                  <textarea
                    className={textareaClass}
                    disabled={!canManage}
                    {...register(`steps.${idx}.description`)}
                  />
                </Field>
              </div>
            </RowCard>
          )}
        />
        {canManage && (
          <AddItemButton
            label="Add step"
            onClick={() =>
              steps.append({
                number: steps.fields.length + 1,
                icon: "zap",
                title: "",
                description: "",
              })
            }
          />
        )}
      </FormSection>
    </EditorShell>
  );
}
