"use client";

import { Controller, useFieldArray } from "react-hook-form";

import {
  Field,
  FormSection,
  inputClass,
  textareaClass,
} from "@/components/admin/ui/form";
import { IconPicker } from "@/components/admin/ui/icon-picker";
import { ColorPicker } from "@/components/admin/ui/color-picker";
import { DraggableList } from "@/components/admin/ui/draggable-list";
import {
  whyChooseUsSchema,
  WHY_CHOOSE_US_DEFAULT,
  type WhyChooseUsContent,
} from "@/lib/admin/homepage-client";
import { useSectionForm } from "./use-section-form";
import { AddItemButton, EditorShell, RowCard } from "./editor-kit";

export function WhyChooseUsEditor({ canManage }: { canManage: boolean }) {
  const { form, isLoading, isError, error, isSaving, save } =
    useSectionForm<WhyChooseUsContent>({
      sectionKey: "whyChooseUs",
      schema: whyChooseUsSchema,
      defaults: WHY_CHOOSE_US_DEFAULT,
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
        title="Advantage cards"
        description="Reasons to choose CreativeDox. Drag to reorder."
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
              title={`Advantage ${idx + 1}`}
              onRemove={canManage ? () => items.remove(idx) : undefined}
              disabled={!canManage}
            >
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
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
                        className="sm:w-44"
                      />
                    )}
                  />
                  <Field
                    label="Title"
                    error={errors.items?.[idx]?.title?.message}
                  >
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      {...register(`items.${idx}.title`)}
                    />
                  </Field>
                </div>
                <Field
                  label="Description"
                  error={errors.items?.[idx]?.description?.message}
                >
                  <textarea
                    className={textareaClass}
                    disabled={!canManage}
                    {...register(`items.${idx}.description`)}
                  />
                </Field>
                <Controller
                  control={control}
                  name={`items.${idx}.color`}
                  render={({ field: f }) => (
                    <ColorPicker
                      label="Accent colour"
                      value={f.value}
                      onChange={f.onChange}
                      disabled={!canManage}
                      error={errors.items?.[idx]?.color?.message}
                    />
                  )}
                />
              </div>
            </RowCard>
          )}
        />
        {canManage && (
          <AddItemButton
            label="Add advantage"
            onClick={() =>
              items.append({
                icon: "shield",
                title: "",
                description: "",
                color: "text-sky-400",
              })
            }
          />
        )}
      </FormSection>
    </EditorShell>
  );
}
