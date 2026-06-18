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
  heroSchema,
  HERO_DEFAULT,
  type HeroContent,
} from "@/lib/admin/homepage-client";
import { useSectionForm } from "./use-section-form";
import { AddItemButton, EditorShell, RowCard } from "./editor-kit";

export function HeroEditor({ canManage }: { canManage: boolean }) {
  const { form, isLoading, isError, error, isSaving, save } =
    useSectionForm<HeroContent>({
      sectionKey: "hero",
      schema: heroSchema,
      defaults: HERO_DEFAULT,
    });
  const {
    register,
    control,
    formState: { errors, isDirty },
  } = form;
  const nodes = useFieldArray({ control, name: "nodes" });

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
      <FormSection title="Headline">
        <Field label="Badge" error={errors.badge?.message}>
          <input
            className={inputClass}
            disabled={!canManage}
            placeholder="Business Software & Automation Platform"
            {...register("badge")}
          />
        </Field>
        <Field label="Headline" error={errors.headline?.message}>
          <input
            className={inputClass}
            disabled={!canManage}
            {...register("headline")}
          />
        </Field>
        <Field
          label="Highlighted text"
          hint="Shown in the animated gradient accent, after the headline."
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
        <Field label="Trust line" error={errors.trustLine?.message}>
          <input
            className={inputClass}
            disabled={!canManage}
            placeholder="Trusted by 500+ businesses across India"
            {...register("trustLine")}
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
                  placeholder="/#solutions"
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
                  placeholder="/#contact"
                  {...register("ctaSecondary.link")}
                />
              </Field>
            </div>
          </RowCard>
        </div>
      </FormSection>

      <FormSection
        title="Network nodes"
        description="Floating labels in the hero's network diagram. Drag to reorder."
      >
        <DraggableList
          items={nodes.fields}
          getId={(f) => f.id}
          onMove={(from, to) => nodes.move(from, to)}
          disabled={!canManage}
          renderItem={(field, idx) => (
            <RowCard
              title={`Node ${idx + 1}`}
              onRemove={canManage ? () => nodes.remove(idx) : undefined}
              disabled={!canManage}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Label"
                  error={errors.nodes?.[idx]?.label?.message}
                >
                  <input
                    className={inputClass}
                    disabled={!canManage}
                    {...register(`nodes.${idx}.label`)}
                  />
                </Field>
                <Controller
                  control={control}
                  name={`nodes.${idx}.icon`}
                  render={({ field: f }) => (
                    <IconPicker
                      label="Icon"
                      value={f.value}
                      onChange={f.onChange}
                      disabled={!canManage}
                      error={errors.nodes?.[idx]?.icon?.message}
                    />
                  )}
                />
              </div>
            </RowCard>
          )}
        />
        {canManage && (
          <AddItemButton
            label="Add node"
            onClick={() => nodes.append({ label: "", icon: "network" })}
          />
        )}
      </FormSection>
    </EditorShell>
  );
}
