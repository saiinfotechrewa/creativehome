"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  fetchLegal,
  saveLegal,
  settingsKeys,
  LEGAL_PAGES,
  type LegalPageType,
} from "@/lib/admin/settings-client";
import { Field, inputClass } from "@/components/admin/ui/form";
import { RichTextEditor } from "@/components/admin/settings/rich-text-editor";

const legalFormSchema = z.object({
  title: z.string().min(2, "Title is required").max(160),
  version: z.string().max(40).optional(),
  isPublished: z.boolean(),
  content: z.string(),
});
type LegalFormValues = z.infer<typeof legalFormSchema>;

function LegalDocForm({
  type,
  canManage,
}: {
  type: LegalPageType;
  canManage: boolean;
}) {
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: settingsKeys.legal(type),
    queryFn: () => fetchLegal(type),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<LegalFormValues>({
    resolver: zodResolver(legalFormSchema),
    defaultValues: { title: "", version: "", isPublished: true, content: "" },
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.title ?? "",
        version: data.version ?? "",
        isPublished: data.isPublished ?? true,
        content: data.content ?? "",
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (values: LegalFormValues) =>
      saveLegal(type, {
        title: values.title,
        content: values.content,
        version: values.version || undefined,
        isPublished: values.isPublished,
      }),
    onSuccess: (saved) => {
      queryClient.setQueryData(settingsKeys.legal(type), saved);
      reset({
        title: saved.title,
        version: saved.version ?? "",
        isPublished: saved.isPublished,
        content: saved.content,
      });
      toast.success("Document saved");
    },
    onError: (err) => toast.error((err as Error).message),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading document…
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-16 text-center text-sm text-rose-400">
        {(error as Error).message}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((v) => mutation.mutate(v))}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_180px]">
        <Field label="Title" error={errors.title?.message}>
          <input
            className={inputClass}
            disabled={!canManage}
            {...register("title")}
          />
        </Field>
        <Field label="Version" hint="Optional, e.g. v2.1">
          <input
            className={inputClass}
            disabled={!canManage}
            placeholder="v1.0"
            {...register("version")}
          />
        </Field>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-foreground">
          Content
        </span>
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              disabled={!canManage}
              placeholder="Write the policy content…"
            />
          )}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          disabled={!canManage}
          className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary/30"
          {...register("isPublished")}
        />
        Published (visible on the public site)
      </label>

      {canManage && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending || !isDirty}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save document
          </button>
        </div>
      )}
    </form>
  );
}

/** The "Legal Pages" tab: a sub-tab per legal document, each independently saved. */
export function LegalPagesEditor({ canManage }: { canManage: boolean }) {
  const [active, setActive] = useState<LegalPageType>(LEGAL_PAGES[0].type);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {LEGAL_PAGES.map((page) => (
          <button
            key={page.type}
            type="button"
            onClick={() => setActive(page.type)}
            className={cn(
              "h-9 rounded-md border px-3 text-sm font-medium transition",
              active === page.type
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* key forces a fresh form (and query subscription) per document. */}
      <LegalDocForm key={active} type={active} canManage={canManage} />
    </div>
  );
}
