import { withAuthHandler, getClientIp } from "@/lib/auth-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { ok, fail, parseJson } from "@/lib/api-response";
import { consultationRequestSchema } from "@/lib/validators";
import { createLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

/**
 * POST /api/public/consultation — "Book a free consultation" form.
 * No auth; rate limited 5/min/IP. Creates a high-priority CONSULTATION lead,
 * persisting the requested slot in `consultation`.
 */
export const POST = withAuthHandler(async (req: Request) => {
  const ip = getClientIp(req);
  if (!(await rateLimit(`public:consultation:${ip}`, 5, 60_000)).success) {
    return fail("Too many requests. Please try again in a minute.", 429);
  }

  const data = await parseJson(req, consultationRequestSchema);

  const lead = await createLead({
    source: "CONSULTATION",
    name: data.name,
    email: data.email,
    phone: data.phone,
    whatsapp: data.whatsapp,
    businessName: data.businessName,
    businessType: data.businessType,
    teamSize: data.teamSize,
    interestedProducts: data.interestedProducts,
    description: data.description,
    consultation: data.consultation,
    utm: data.utm,
    ipAddress: ip,
  });

  return ok(
    { id: lead.id, message: "Consultation booked — check your inbox for confirmation." },
    { status: 201 },
  );
});
