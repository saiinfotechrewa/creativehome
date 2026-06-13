import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  IndustryDetailPage,
  buildIndustryMetadata,
} from "@/components/industries/industry-detail-page";
import { getIndustryDetail } from "@/data/industry-details";

const SLUG = "startups";

export function generateMetadata(): Metadata {
  const industry = getIndustryDetail(SLUG);
  return industry ? buildIndustryMetadata(industry) : {};
}

export default function StartupsPage() {
  const industry = getIndustryDetail(SLUG);
  if (!industry) notFound();
  return <IndustryDetailPage industry={industry} />;
}
