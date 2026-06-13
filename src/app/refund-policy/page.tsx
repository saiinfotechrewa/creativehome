import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, buildLegalMetadata } from "@/components/legal/legal-page";
import { getLegalDocument } from "@/data/legal";

const SLUG = "refund-policy";

export function generateMetadata(): Metadata {
  const doc = getLegalDocument(SLUG);
  return doc ? buildLegalMetadata(doc) : {};
}

export default function RefundPolicyPage() {
  const doc = getLegalDocument(SLUG);
  if (!doc) notFound();
  return <LegalPage doc={doc} />;
}
