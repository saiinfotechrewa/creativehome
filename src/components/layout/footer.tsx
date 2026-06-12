import Link from "next/link";
import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { FOOTER_NAV, LEGAL_LINKS } from "@/data/navigation";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const socials = [
  {
    label: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    icon: Linkedin,
    hover: "hover:border-sky-400/50 hover:text-sky-400",
  },
  {
    label: "Twitter",
    href: SOCIAL_LINKS.twitter,
    icon: Twitter,
    hover: "hover:border-sky-300/50 hover:text-sky-300",
  },
  {
    label: "YouTube",
    href: SOCIAL_LINKS.youtube,
    icon: Youtube,
    hover: "hover:border-red-400/50 hover:text-red-400",
  },
  {
    label: "Instagram",
    href: SOCIAL_LINKS.instagram,
    icon: Instagram,
    hover: "hover:border-pink-400/50 hover:text-pink-400",
  },
];

/** Footer link with a sliding underline on hover. */
const footerLink =
  "text-muted-foreground hover:text-foreground after:bg-primary relative text-sm transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:transition-[width] after:duration-300 hover:after:w-full";

export function Footer() {
  return (
    <footer className="bg-background relative">
      {/* Gradient top border */}
      <div
        aria-hidden
        className="via-primary/60 to-secondary/60 from-secondary/60 h-px w-full bg-linear-to-r"
      />

      <Container className="py-16">
        {/* Newsletter */}
        <div className="border-border flex flex-col items-start justify-between gap-6 border-b pb-12 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-foreground text-xl font-semibold tracking-tight">
              Automation tips for growing businesses
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
              One practical email a month — playbooks, product updates, and
              ideas to cut busywork. No spam, unsubscribe anytime.
            </p>
          </div>
          <NewsletterForm />
        </div>

        {/* Link columns */}
        <div className="mt-12 grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="from-primary to-secondary grid h-8 w-8 place-items-center rounded-md bg-linear-to-br text-sm font-bold text-white">
                {"{}"}
              </span>
              <span className="text-lg font-semibold tracking-tight">
                <span className="text-foreground">Creative</span>
                <span className="text-gradient">Dox</span>
              </span>
            </Link>
            <p className="text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ label, href, icon: Icon, hover }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cn(
                    "border-border text-muted-foreground grid h-9 w-9 place-items-center rounded-md border transition-colors duration-200",
                    hover
                  )}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_NAV.map((column) => (
            <div key={column.title}>
              <h4 className="text-foreground text-sm font-semibold">
                {column.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer noopener" : undefined}
                      className={footerLink}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-foreground text-sm font-semibold">Contact</h4>
            <ul className="mt-4 space-y-3">
              <li className="text-muted-foreground flex items-start gap-2.5 text-sm">
                <MapPin className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                {SITE_CONFIG.address}
              </li>
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2.5 text-sm transition-colors"
                >
                  <Phone className="text-primary h-4 w-4 shrink-0" />
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2.5 text-sm transition-colors"
                >
                  <Mail className="text-primary h-4 w-4 shrink-0" />
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-border mt-14 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved.
          </p>
          <ul className="flex items-center gap-6">
            {LEGAL_LINKS.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
