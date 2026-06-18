"use client";

import { solutionsSchema, SOLUTIONS_DEFAULT } from "@/lib/admin/homepage-client";
import { CardListEditor } from "./card-list-editor";

export function SolutionsEditor({ canManage }: { canManage: boolean }) {
  return (
    <CardListEditor
      canManage={canManage}
      sectionKey="solutions"
      schema={solutionsSchema}
      defaults={SOLUTIONS_DEFAULT}
      itemNoun="Solution"
    />
  );
}
