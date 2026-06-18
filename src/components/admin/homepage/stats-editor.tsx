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
  statsSchema,
  STATS_DEFAULT,
  type StatsContent,
} from "@/lib/admin/homepage-client";
import { useSectionForm } from "./use-section-form";
import { AddItemButton, EditorShell, RowCard } from "./editor-kit";

export function StatsEditor({ canManage }: { canManage: boolean }) {
  const { form, isLoading, isError, error, isSaving, save } =
    useSectionForm<StatsContent>({
      sectionKey: "stats",
      schema: statsSchema,
      defaults: STATS_DEFAULT,
    });
  const {
    register,
    control,
    formState: { errors, isDirty },
  } = form;
  const items = useFieldArray({ control, name: "items" });

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
        title="Counter cards"
        description="Headline metrics that animate up from zero. Drag to reorder."
      >
        {errors.items?.message && (
          <p className="text-xs text-rose-400">{errors.items.message}</p>
        )}
        <DraggableList
          items={items.fields}
          getId={(f) => f.id}
          onMove={(from, to) => items.move(from, to)}
          disabled={!canManage}
          renderItem={(field, idx) => (
            <RowCard
              title={`Stat ${idx + 1}`}
              onRemove={canManage ? () => items.remove(idx) : undefined}
              disabled={!canManage}
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Controller
                  control={control}
                  name={`items.${idx}.icon`}
                  render={({ field: f }) => (
                    <IconPicker
                      label="Icon"
                      value={f.value}
                      onChange={f.onChange}
                      disabled={!canManage}
                      error={errors.items?.[idx]?.icon?.message}
                    />
                  )}
                />
                <Field label="Value" error={errors.items?.[idx]?.value?.message}>
                  <input
                    type="number"
                    step="any"
                    className={inputClass}
                    disabled={!canManage}
                    {...register(`items.${idx}.value`)}
                  />
                </Field>
                <Field
                  label="Suffix"
                  error={errors.items?.[idx]?.suffix?.message}
                >
                  <input
                    className={inputClass}
                    disabled={!canManage}
                    placeholder="+ / % / K"
                    {...register(`items.${idx}.suffix`)}
                  />
                </Field>
                <Field label="Label" error={errors.items?.[idx]?.label?.message}>
                  <input
                    className={inputClass}
                    disabled={!canManage}
                    {...register(`items.${idx}.label`)}
                  />
                </Field>
              </div>
            </RowCard>
          )}
        />
        {canManage && (
          <AddItemButton
            label="Add stat"
            onClick={() =>
              items.append({ icon: "target", value: 0, suffix: "+", label: "" })
            }
          />
        )}
      </FormSection>
    </EditorShell>
  );
}
