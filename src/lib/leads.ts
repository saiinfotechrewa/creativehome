import type { Customer, Lead, LeadSource, Prisma, Priority } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-logger";

/**
 * Lead creation workflow.
 *
 * Every public enquiry (contact / demo / consultation / whatsapp) funnels
 * through {@link createLead} so a single place owns: defaulting status to NEW,
 * deriving priority from the channel, normalising empty strings to null, and
 * writing the audit-log entry. The new lead is immediately visible in the admin
 * inbox and bumps the "new leads" sidebar badge.
 */

export interface CreateLeadInput {
  source: LeadSource;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  businessName?: string;
  businessType?: string;
  teamSize?: string;
  interestedProducts?: string[];
  description?: string;
  consultation?: Record<string, unknown>;
  utm?: Record<string, unknown>;
  /** Client IP, recorded on the activity log entry. */
  ipAddress?: string;
}

/** Hotter intents (booked a call / demo) start higher in the queue. */
const PRIORITY_BY_SOURCE: Record<LeadSource, Priority> = {
  CONSULTATION: "HIGH",
  DEMO: "HIGH",
  CONTACT: "MEDIUM",
  WHATSAPP: "MEDIUM",
};

/** Trim a value to `null` when blank so optional columns stay clean. */
function orNull(value?: string): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const lead = await prisma.lead.create({
    data: {
      source: input.source,
      status: "NEW",
      priority: PRIORITY_BY_SOURCE[input.source] ?? "MEDIUM",
      name: input.name.trim(),
      email: orNull(input.email),
      phone: orNull(input.phone),
      whatsapp: orNull(input.whatsapp),
      businessName: orNull(input.businessName),
      businessType: orNull(input.businessType),
      teamSize: orNull(input.teamSize),
      description: orNull(input.description),
      interestedProducts: (input.interestedProducts ??
        []) as unknown as Prisma.InputJsonValue,
      consultation: (input.consultation ?? {}) as Prisma.InputJsonValue,
      utm: (input.utm ?? {}) as Prisma.InputJsonValue,
      notes: [] as unknown as Prisma.InputJsonValue,
      communications: [] as unknown as Prisma.InputJsonValue,
    },
  });

  await logActivity({
    userId: null,
    userName: "Public website",
    action: "create",
    module: "leads",
    entityId: lead.id,
    entityName: lead.name,
    details: { source: lead.source, via: "public-form" },
    ipAddress: input.ipAddress,
  });

  return lead;
}

/** Thrown by {@link convertLeadToCustomer} when conversion can't proceed. */
export class LeadConversionError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
    this.name = "LeadConversionError";
  }
}

export interface ConvertLeadOverrides {
  email?: string;
  phone?: string;
  gstNumber?: string;
  address?: Record<string, unknown>;
}

/**
 * Promote a lead to a customer and mark the lead CONVERTED. Idempotent on the
 * already-linked case; refuses to silently hijack an existing customer that
 * belongs to a different lead.
 */
export async function convertLeadToCustomer(
  lead: Lead,
  overrides: ConvertLeadOverrides = {},
): Promise<Customer> {
  const email = (overrides.email ?? lead.email ?? "").trim();
  if (!email) {
    throw new LeadConversionError(
      "An email is required to create a customer",
      400,
    );
  }

  // Already converted? Return the linked customer instead of duplicating.
  const linked = await prisma.customer.findUnique({ where: { leadId: lead.id } });
  if (linked) return linked;

  const byEmail = await prisma.customer.findUnique({ where: { email } });
  if (byEmail) {
    if (byEmail.leadId && byEmail.leadId !== lead.id) {
      throw new LeadConversionError(
        "A customer with this email is already linked to another lead",
        409,
      );
    }
    const customer = await prisma.customer.update({
      where: { id: byEmail.id },
      data: { leadId: lead.id },
    });
    await prisma.lead.update({ where: { id: lead.id }, data: { status: "CONVERTED" } });
    return customer;
  }

  const customer = await prisma.customer.create({
    data: {
      name: lead.name,
      email,
      phone: overrides.phone ?? lead.phone ?? null,
      whatsapp: lead.whatsapp ?? null,
      businessName: lead.businessName ?? null,
      businessType: lead.businessType ?? null,
      gstNumber: overrides.gstNumber || null,
      address: (overrides.address ?? {}) as Prisma.InputJsonValue,
      leadId: lead.id,
    },
  });

  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: "CONVERTED" },
  });

  return customer;
}
