import { Check } from "lucide-react";
import type { BlogContentBlock } from "@/lib/types";

/**
 * Renders a post body from its content blocks with hand-tuned editorial
 * typography (no Tailwind Typography plugin needed). Server component.
 */
export function BlogContent({ blocks }: { blocks: BlogContentBlock[] }) {
  return (
    <div className="max-w-none">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={i}
                className="text-foreground mt-10 mb-4 scroll-mt-28 text-2xl font-bold tracking-tight first:mt-0"
              >
                {block.text}
              </h2>
            );

          case "paragraph":
            return (
              <p
                key={i}
                className="text-muted-foreground mb-5 text-[15px] leading-[1.8] sm:text-base"
              >
                {block.text}
              </p>
            );

          case "list":
            return (
              <ul key={i} className="mb-6 space-y-2.5">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-muted-foreground flex items-start gap-3 text-[15px] leading-relaxed sm:text-base"
                  >
                    <span className="border-primary/30 bg-primary/10 text-primary mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            );

          case "ordered":
            return (
              <ol key={i} className="mb-6 space-y-2.5">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-muted-foreground flex items-start gap-3 text-[15px] leading-relaxed sm:text-base"
                  >
                    <span className="border-border bg-card text-foreground mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-semibold">
                      {j + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                className="border-primary bg-card/50 text-foreground my-8 rounded-r-lg border-l-2 py-4 pr-5 pl-6 text-lg leading-relaxed font-medium italic"
              >
                {block.text}
              </blockquote>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
