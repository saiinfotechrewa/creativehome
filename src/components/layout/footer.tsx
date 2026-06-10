import Link from "next/link";
import { Boxes, Twitter, Linkedin, Github, Youtube } from "lucide-react";
import { Container } from "@/components/ui/container";
import { FOOTER_NAV } from "@/data/navigation";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";

const socials = [
  { label: "Twitter", href: SOCIAL_LINKS.twitter, icon: Twitter },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, icon: Linkedin },
  { label: "GitHub", href: SOCIAL_LINKS.github, icon: Github },
  { label: "YouTube", href: SOCIAL_LINKS.youtube, icon: Youtube },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-foreground">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-primary to-secondary">
                <Boxes className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {SITE_CONFIG.tagline}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer noopener" : undefined}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for teams that move fast.
          </p>
        </div>
      </Container>
    </footer>
  );
}
