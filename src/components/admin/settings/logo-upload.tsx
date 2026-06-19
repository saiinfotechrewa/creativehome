"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";

import { inputClass } from "@/components/admin/ui/form";
import { uploadMedia } from "@/lib/admin/settings-client";

interface LogoUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  /** Hint shown under the field, e.g. recommended dimensions. */
  hint?: string;
  disabled?: boolean;
}

/**
 * Image picker for branding assets (logo / dark logo / favicon). Uploads to the
 * media library and stores the returned URL; if storage isn't configured, the
 * admin can paste a URL directly instead.
 */
export function LogoUpload({
  value,
  onChange,
  label,
  hint,
  disabled,
}: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadMedia(file);
      onChange(url);
      toast.success(`${label} uploaded`);
    } catch (err) {
      toast.error((err as Error).message, {
        description: "You can paste an image URL instead.",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>

      <div className="flex items-start gap-3">
        {/* Preview */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
          {value ? (
            <Image
              src={value}
              alt={label}
              width={64}
              height={64}
              className="h-full w-full object-contain"
              unoptimized
            />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={disabled || uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
            <button
              type="button"
              disabled={disabled || uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-foreground transition hover:bg-accent disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload
            </button>
            {value && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange("")}
                className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm text-muted-foreground transition hover:text-rose-400"
              >
                <X className="h-4 w-4" /> Remove
              </button>
            )}
          </div>

          <input
            type="url"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className={inputClass}
          />
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
