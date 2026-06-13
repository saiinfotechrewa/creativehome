import type { Testimonial } from "@/lib/types";

/** Customer social proof — one outcome-driven story per industry. */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "ramesh-agarwal",
    quote:
      "Billing errors are down 80% since we switched to CreativeDox. Invoices that took my staff two hours every evening now finish before the shutters close, and GST returns go to my CA in one click.",
    name: "Ramesh Agarwal",
    role: "Owner",
    company: "Agarwal Supermart",
    industry: "Retail",
    rating: 5,
    avatar: "RA",
  },
  {
    id: "anil-kushwaha",
    quote:
      "Our collection rate is up 40%. With 4,000 subscribers across 12 areas, I never knew my real outstanding until month-end — now every agent marks payments on their phone and I see dues live.",
    name: "Anil Kushwaha",
    role: "Proprietor",
    company: "Shree Cable Network",
    industry: "Cable TV",
    rating: 5,
    avatar: "AK",
  },
  {
    id: "sunita-deshmukh",
    quote:
      "Marking attendance used to take 15 minutes per class. Now it takes 30 seconds, parents get instant alerts, and fee collection improved the very first term because everything happens online.",
    name: "Sunita Deshmukh",
    role: "Principal",
    company: "Sunrise Public School",
    industry: "Education",
    rating: 5,
    avatar: "SD",
  },
  {
    id: "neha-kapoor",
    quote:
      "Lead follow-up is fully automated now — every enquiry gets a WhatsApp response within a minute and our team only steps in for hot leads. Conversions have tripled since we went live.",
    name: "Neha Kapoor",
    role: "Founder",
    company: "Bluleaf Media",
    industry: "Agency",
    rating: 5,
    avatar: "NK",
  },
  {
    id: "vikram-mehta",
    quote:
      "Order tracking time is down 60%. CreativeDox built our ERP module by module — purchase, production, dispatch — and for the first time the plant's numbers and accounts' numbers actually match.",
    name: "Vikram Mehta",
    role: "Managing Director",
    company: "Mehta Polymers",
    industry: "Manufacturing",
    rating: 5,
    avatar: "VM",
  },
  {
    id: "arjun-malhotra",
    quote:
      "They delivered our MVP in 3 weeks — investor demo ready. Most agencies quoted three months. The team felt like co-founders, pushing back on scope where it made the product better.",
    name: "Arjun Malhotra",
    role: "Founder & CEO",
    company: "Zapkart",
    industry: "Startup",
    rating: 5,
    avatar: "AM",
  },
  {
    id: "farhan-qureshi",
    quote:
      "My technicians mark attendance and close jobs from their phones, AMC reminders go out on WhatsApp automatically, and follow-ups stopped slipping. We service 30% more calls a month with the same team.",
    name: "Farhan Qureshi",
    role: "Director",
    company: "CoolCare Services",
    industry: "Service Provider",
    rating: 5,
    avatar: "FQ",
  },
];

/** Look up a testimonial by its id. */
export function getTestimonial(id: string): Testimonial | undefined {
  return TESTIMONIALS.find((testimonial) => testimonial.id === id);
}
