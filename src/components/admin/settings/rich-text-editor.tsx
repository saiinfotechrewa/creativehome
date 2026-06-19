"use client";

import { useEffect, useRef } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface ToolButton {
  icon: typeof Bold;
  label: string;
  command: string;
  arg?: string;
}

const BUTTONS: ToolButton[] = [
  { icon: Bold, label: "Bold", command: "bold" },
  { icon: Italic, label: "Italic", command: "italic" },
  { icon: Underline, label: "Underline", command: "underline" },
  { icon: Heading2, label: "Heading", command: "formatBlock", arg: "H2" },
  { icon: Heading3, label: "Subheading", command: "formatBlock", arg: "H3" },
  { icon: List, label: "Bulleted list", command: "insertUnorderedList" },
  { icon: ListOrdered, label: "Numbered list", command: "insertOrderedList" },
];

/**
 * A lightweight rich-text editor built on `contentEditable` + `execCommand`.
 * No external dependencies. Emits HTML through `onChange`. `execCommand` is
 * deprecated but still universally supported and adequate for legal copy.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write the document content…",
  disabled,
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Sync external value into the DOM only when it actually differs, so typing
  // (which fires onChange) never resets the caret to the start.
  useEffect(() => {
    const el = ref.current;
    if (el && el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  function emit() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function exec(button: ToolButton) {
    if (disabled) return;
    ref.current?.focus();
    document.execCommand(button.command, false, button.arg);
    emit();
  }

  function addLink() {
    if (disabled) return;
    const url = window.prompt("Link URL");
    if (!url) return;
    ref.current?.focus();
    document.execCommand("createLink", false, url);
    emit();
  }

  return (
    <div className="overflow-hidden rounded-md border border-border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
        {BUTTONS.map((b) => (
          <button
            key={b.label}
            type="button"
            title={b.label}
            disabled={disabled}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(b)}
            className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-40"
          >
            <b.icon className="h-4 w-4" />
          </button>
        ))}
        <button
          type="button"
          title="Insert link"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={addLink}
          className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition hover:bg-accent hover:text-foreground disabled:opacity-40"
        >
          <Link2 className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={ref}
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        data-placeholder={placeholder}
        className={cn(
          "prose-editor min-h-[260px] max-w-none px-4 py-3 text-sm leading-relaxed text-foreground outline-none",
          "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold",
          "[&_h3]:mb-1.5 [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold",
          "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6",
          "[&_a]:text-primary [&_a]:underline [&_p]:my-2",
          "empty:before:text-muted-foreground/60 empty:before:content-[attr(data-placeholder)]",
        )}
      />
    </div>
  );
}
