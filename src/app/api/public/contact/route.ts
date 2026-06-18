import { withAuthHandler, getClientIp } from "@/lib/auth-helpers";
import { rateLimit } from "@/lib/rate-limit";
import { ok, fail, parseJson } from "@/lib/api-response";
import { contactFormSchema } from "@/lib/validators";
import { createLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

/**
 * POST /api/public/contact — public contact form.
 * No auth; rate limited 5/min/IP. Creates a CONTACT lead in the admin inbox.
 */
export const POST = withAuthHandler(async (req: Request) => {
  const ip = getClientIp(req);
  if (!(await rateLimit(`public:contact:${ip}`, 5, 60_000)).success) {
    return fail("Too many requests. Please try again in a minute.", 429);
  }

  const data = await parseJson(req, contactFormSchema);

  const lead = await createLead({
    source: "CONTACT",
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
    { id: lead.id, message: "Thanks! We'll be in touch shortly." },
    { status: 201 },
  );
});
