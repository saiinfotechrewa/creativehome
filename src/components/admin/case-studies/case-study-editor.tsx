"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { fetchCaseStudy, caseStudyKeys } from "@/lib/admin/case-studies-client";
import { CaseStudyForm } from "@/components/admin/case-studies/case-study-form";

/** Loads an existing case study by slug, then renders the shared edit form. */
export function CaseStudyEditor({ slug }: { slug: string }) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: caseStudyKeys.detail(slug),
    queryFn: () => fetchCaseStudy(slug),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading case study…
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

  // Remount the form when the slug changes so state re-seeds from the record.
  return <CaseStudyForm key={data.slug} existing={data} />;
}
