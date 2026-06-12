import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ServiceDetailPage,
  buildServiceMetadata,
} from "@/components/services/service-detail-page";
import { getServiceDetail } from "@/data/services";

const SLUG = "business-automation";

export function generateMetadata(): Metadata {
  const service = getServiceDetail(SLUG);
  return service ? buildServiceMetadata(service) : {};
}

export default function BusinessAutomationPage() {
  const service = getServiceDetail(SLUG);
  if (!service) notFound();
  return <ServiceDetailPage service={service} />;
}
