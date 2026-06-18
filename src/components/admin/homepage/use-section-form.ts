"use client";

import { useEffect, useRef } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ZodType } from "zod";

import {
  fetchSections,
  saveSection,
  mergeContent,
  homepageKeys,
  type HomepageSection,
} from "@/lib/admin/homepage-client";

/** Replace a section in the cached list by key (or append), keeping order. */
function upsertSection(
  list: HomepageSection[],
  saved: HomepageSection,
): HomepageSection[] {
  const exists = list.some((s) => s.sectionKey === saved.sectionKey);
  const next = exists
    ? list.map((s) => (s.sectionKey === saved.sectionKey ? saved : s))
    : [...list, saved];
  return next.sort((a, b) => a.order - b.order);
}

/** Warn the user before leaving the tab with unsaved form changes. */
export function useUnsavedWarning(when: boolean) {
  useEffect(() => {
    if (!when) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [when]);
}

interface UseSectionFormOptions<T extends FieldValues> {
  sectionKey: string;
  schema: ZodType<T>;
  defaults: T;
}

/**
 * Shared plumbing for every section editor:
 *  - reads the section out of the shared `homepageKeys.all` query (deduped with
 *    the orchestrator, so no extra request),
 *  - wires react-hook-form with the section's Zod schema and defaults,
 *  - resets the form whenever fresh data arrives,
 *  - saves the `content` blob, syncs the cache, toasts, and clears `isDirty`,
 *  - guards against navigating away with unsaved edits.
 */
export function useSectionForm<T extends FieldValues>({
  sectionKey,
  schema,
  defaults,
}: UseSectionFormOptions<T>) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: homepageKeys.all,
    queryFn: fetchSections,
  });
  const section = query.data?.find((s) => s.sectionKey === sectionKey);

  const form = useForm<T>({
    resolver: zodResolver(schema) as Resolver<T>,
    defaultValues: defaults as DefaultValues<T>,
  });
  const { reset } = form;

  // Seed the form from server data exactly once (when the section first
  // resolves). Reorder / active-toggle elsewhere update the shared query cache
  // with new object identities; re-resetting on those would silently wipe the
  // user's unsaved edits, so we don't. Our own save resets manually below.
  const seeded = useRef(false);
  useEffect(() => {
    if (section && !seeded.current) {
      seeded.current = true;
      reset(
        mergeContent(
          defaults as Record<string, unknown>,
          section.content,
        ) as DefaultValues<T>,
      );
    }
    // `defaults` is a module-level constant; intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, reset]);

  const mutation = useMutation({
    mutationFn: (content: T) =>
      saveSection(sectionKey, {
        content: content as unknown as Record<string, unknown>,
      }),
    onSuccess: (saved) => {
      queryClient.setQueryData<HomepageSection[]>(homepageKeys.all, (prev) =>
        prev ? upsertSection(prev, saved) : [saved],
      );
      reset(
        mergeContent(
          defaults as Record<string, unknown>,
          saved.content,
        ) as DefaultValues<T>,
      );
      toast.success("Section saved");
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const save = form.handleSubmit((values) => mutation.mutate(values));

  useUnsavedWarning(form.formState.isDirty);

  return {
    form,
    section,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error as Error | null,
    isSaving: mutation.isPending,
    save,
  };
}
