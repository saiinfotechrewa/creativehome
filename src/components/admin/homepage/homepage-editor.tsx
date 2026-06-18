"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  SECTIONS,
  fetchSections,
  reorderSections,
  saveSection,
  homepageKeys,
  type HomepageSection,
  type SectionKey,
} from "@/lib/admin/homepage-client";
import { DraggableList } from "@/components/admin/ui/draggable-list";
import { SectionCard } from "./section-card";
import { HeroEditor } from "./hero-editor";
import { TrustBarEditor } from "./trust-bar-editor";
import { SolutionsEditor } from "./solutions-editor";
import { IndustriesEditor } from "./industries-editor";
import { ProcessEditor } from "./process-editor";
import { WhyChooseUsEditor } from "./why-choose-us-editor";
import { StatsEditor } from "./stats-editor";
import { FinalCtaEditor } from "./final-cta-editor";
import { LogoMarqueeEditor } from "./logo-marquee-editor";
import { TestimonialsEditor } from "./testimonials-editor";

/** Render the right editor for a section key. */
function renderEditor(key: SectionKey, canManage: boolean) {
  switch (key) {
    case "hero":
      return <HeroEditor canManage={canManage} />;
    case "trustBar":
      return <TrustBarEditor canManage={canManage} />;
    case "solutions":
      return <SolutionsEditor canManage={canManage} />;
    case "industries":
      return <IndustriesEditor canManage={canManage} />;
    case "process":
      return <ProcessEditor canManage={canManage} />;
    case "whyChooseUs":
      return <WhyChooseUsEditor canManage={canManage} />;
    case "stats":
      return <StatsEditor canManage={canManage} />;
    case "finalCta":
      return <FinalCtaEditor canManage={canManage} />;
    case "logoMarquee":
      return <LogoMarqueeEditor canManage={canManage} />;
    case "testimonials":
      return <TestimonialsEditor />;
    default:
      return null;
  }
}

export function HomepageEditor({ canManage }: { canManage: boolean }) {
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: homepageKeys.all,
    queryFn: fetchSections,
  });

  const rowByKey = useMemo(
    () => new Map((data ?? []).map((s) => [s.sectionKey, s] as const)),
    [data],
  );

  // Display order: stored `order` wins; sections without a row yet fall in at
  // their canonical registry position (pushed below saved ones).
  const serverOrder = useMemo(() => {
    const registryIndex = new Map(SECTIONS.map((s, i) => [s.key, i] as const));
    return [...SECTIONS]
      .sort((a, b) => {
        const oa = rowByKey.get(a.key)?.order ?? 100 + registryIndex.get(a.key)!;
        const ob = rowByKey.get(b.key)?.order ?? 100 + registryIndex.get(b.key)!;
        return oa - ob;
      })
      .map((s) => s.key);
  }, [rowByKey]);

  const [order, setOrder] = useState<SectionKey[]>(SECTIONS.map((s) => s.key));
  useEffect(() => setOrder(serverOrder), [serverOrder]);

  const reorderMutation = useMutation({
    mutationFn: reorderSections,
    onSuccess: (sections) =>
      queryClient.setQueryData(homepageKeys.all, sections),
    onError: (err) => {
      toast.error((err as Error).message);
      queryClient.invalidateQueries({ queryKey: homepageKeys.all });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (vars: { key: SectionKey; isActive: boolean; order: number }) =>
      saveSection(vars.key, { isActive: vars.isActive, order: vars.order }),
    onSuccess: (saved) => {
      queryClient.setQueryData<HomepageSection[]>(homepageKeys.all, (prev) => {
        const list = prev ?? [];
        return list.some((s) => s.sectionKey === saved.sectionKey)
          ? list.map((s) => (s.sectionKey === saved.sectionKey ? saved : s))
          : [...list, saved];
      });
      toast.success(saved.isActive ? "Section is now visible" : "Section hidden");
    },
    onError: (err) => toast.error((err as Error).message),
  });

  const metaByKey = useMemo(
    () => new Map(SECTIONS.map((s) => [s.key, s] as const)),
    [],
  );

  function handleReorder(orderedIds: string[]) {
    const next = orderedIds as SectionKey[];
    setOrder(next); // optimistic
    // Only sections that already have a row can be persisted server-side.
    const persistable = next.filter((k) => rowByKey.has(k));
    if (persistable.length > 0) reorderMutation.mutate(persistable);
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading homepage…
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-24 text-center text-sm text-rose-400">
        {(error as Error).message}
      </div>
    );
  }

  const orderedMetas = order
    .map((key) => metaByKey.get(key))
    .filter((m): m is (typeof SECTIONS)[number] => Boolean(m));

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">
          Homepage Content
        </h1>
        <p className="text-sm text-muted-foreground">
          Edit every homepage section, toggle visibility, and drag to reorder.
          {!canManage && " You have read-only access."}
        </p>
      </header>

      <DraggableList
        items={orderedMetas}
        getId={(m) => m.key}
        onReorder={handleReorder}
        disabled={!canManage}
        renderItem={(meta) => {
          const row = rowByKey.get(meta.key);
          const isActive = row?.isActive ?? true;
          const index = order.indexOf(meta.key);
          return (
            <SectionCard
              label={meta.label}
              description={meta.description}
              isActive={isActive}
              canManage={canManage}
              toggling={toggleMutation.isPending}
              onToggleActive={() =>
                toggleMutation.mutate({
                  key: meta.key,
                  isActive: !isActive,
                  order: index < 0 ? 0 : index,
                })
              }
            >
              {renderEditor(meta.key, canManage)}
            </SectionCard>
          );
        }}
      />
    </div>
  );
}
