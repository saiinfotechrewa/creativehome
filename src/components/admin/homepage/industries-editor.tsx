"use client";

import {
  industriesSchema,
  INDUSTRIES_DEFAULT,
} from "@/lib/admin/homepage-client";
import { CardListEditor } from "./card-list-editor";

export function IndustriesEditor({ canManage }: { canManage: boolean }) {
  return (
    <CardListEditor
      canManage={canManage}
      sectionKey="industries"
      schema={industriesSchema}
      defaults={INDUSTRIES_DEFAULT}
      itemNoun="Industry"
    />
  );
}
