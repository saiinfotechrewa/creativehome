import { withAuthHandler, getClientIp } from "@/lib/auth-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { ok, fail, parseJson } from "@/lib/api-response";
import { demoRequestSchema } from "@/lib/validators";
import { createLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

/**
 * POST /api/public/demo — "Request a demo" form.
 * No auth; rate limited 5/min/IP. Creates a high-priority DEMO lead.
 */
export const POST = withAuthHandler(async (req: Request) => {
  const ip = getClientIp(req);
  if (!rateLimit(`public:demo:${ip}`, 5, 60_000).success) {
    return fail("Too many requests. Please try again in a minute.", 429);
  }

  const data = await parseJson(req, demoRequestSchema);

  const lead = await createLead({
    source: "DEMO",
    name: data.name,
    email: data.email,
    phone: data.phone,
    whatsapp: data.whatsapp,
    businessName: data.businessName,
    businessType: data.businessType,
    teamSize: data.teamSize,
    interestedProducts: data.interestedProducts,
    description: data.description,
    utm: data.utm,
    ipAddress: ip,
  });

  return ok(
    { id: lead.id, message: "Demo request received — we'll reach out to schedule it." },
    { status: 201 },
  );
});
