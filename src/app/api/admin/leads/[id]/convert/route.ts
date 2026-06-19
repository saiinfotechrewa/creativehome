import {
  requirePermission,
  withAuthHandler,
  getClientIp,
} from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-logger";
import { ok, fail, parseJson } from "@/lib/api-response";
import { leadConvertSchema } from "@/lib/validators";
import { convertLeadToCustomer, LeadConversionError } from "@/lib/leads";
import { notifyLeadConverted } from "@/lib/notifications";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/leads/[id]/convert — promote a lead to a customer and mark
 * the lead CONVERTED. Sends a welcome email to the new customer.
 */
export const POST = withAuthHandler(async (req: Request, ctx: RouteContext) => {
  const user = await requirePermission(PERMISSIONS.CUSTOMERS_MANAGE);
  const { id } = await ctx.params;

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return fail("Lead not found", 404);

  const overrides = await parseJson(req, leadConvertSchema);

  try {
    const customer = await convertLeadToCustomer(lead, {
      email: overrides.email,
      phone: overrides.phone,
      gstNumber: overrides.gstNumber || undefined,
      address: overrides.address,
    });

    await notifyLeadConverted(lead, customer.email);
    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "update",
      module: "leads",
      entityId: lead.id,
      entityName: lead.name,
      details: { convertedToCustomer: customer.id },
      ipAddress: getClientIp(req),
    });

    return ok({ customer }, { status: 201 });
  } catch (err) {
    if (err instanceof LeadConversionError) {
      return fail(err.message, err.status);
    }
    throw err;
  }
});
