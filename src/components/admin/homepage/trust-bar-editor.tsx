"use client";

import { Controller, useFieldArray } from "react-hook-form";

import { Field, FormSection, inputClass } from "@/components/admin/ui/form";
import { IconPicker } from "@/components/admin/ui/icon-picker";
import { DraggableList } from "@/components/admin/ui/draggable-list";
import {
  trustBarSchema,
  TRUST_BAR_DEFAULT,
  type TrustBarContent,
} from "@/lib/admin/homepage-client";
import { useSectionForm } from "./use-section-form";
import { AddItemButton, EditorShell, RowCard } from "./editor-kit";

export function TrustBarEditor({ canManage }: { canManage: boolean }) {
  const { form, isLoading, isError, error, isSaving, save } =
    useSectionForm<TrustBarContent>({
      sectionKey: "trustBar",
      schema: trustBarSchema,
      defaults: TRUST_BAR_DEFAULT,
    });
  const {
    register,
    control,
    formState: { errors, isDirty },
  } = form;
  const counters = useFieldArray({ control, name: "counters" });

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
      <FormSection
        title="Counters"
        description="Animated metrics in the strip under the hero. Drag to reorder."
      >
        {errors.counters?.message && (
          <p className="text-xs text-rose-400">{errors.counters.message}</p>
        )}
        <DraggableList
          items={counters.fields}
          getId={(f) => f.id}
          onMove={(from, to) => counters.move(from, to)}
          disabled={!canManage}
          renderItem={(field, idx) => (
            <RowCard
              title={`Counter ${idx + 1}`}
              onRemove={canManage ? () => counters.remove(idx) : undefined}
              disabled={!canManage}
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Controller
                  control={control}
                  name={`counters.${idx}.icon`}
                  render={({ field: f }) => (
                    <IconPicker
                      label="Icon"
                      value={f.value}
                      onChange={f.onChange}
                      disabled={!canManage}
                      error={errors.counters?.[idx]?.icon?.message}
                    />
                  )}
                />
                <Field
                  label="Value"
                  error={errors.counters?.[idx]?.value?.message}
                >
                  <input
                    type="number"
                    step="any"
                    className={inputClass}
                    disabled={!canManage}
                    {...register(`counters.${idx}.value`)}
                  />
                </Field>
                <Field
                  label="Suffix"
                  error={errors.counters?.[idx]?.suffix?.message}
                >
                  <input
                    className={inputClass}
                    disabled={!canManage}
                    placeholder="+ / % / /7"
                    {...register(`counters.${idx}.suffix`)}
                  />
                </Field>
                <Field
                  label="Label"
                  error={errors.counters?.[idx]?.label?.message}
                >
                  <input
                    className={inputClass}
                    disabled={!canManage}
                    {...register(`counters.${idx}.label`)}
                  />
                </Field>
              </div>
            </RowCard>
          )}
        />
        {canManage && (
          <AddItemButton
            label="Add counter"
            onClick={() =>
              counters.append({
                icon: "target",
                value: 0,
                suffix: "+",
                label: "",
              })
            }
          />
        )}
      </FormSection>
    </EditorShell>
  );
}
