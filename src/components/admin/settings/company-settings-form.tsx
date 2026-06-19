"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Building2,
  FileText,
  Loader2,
  Phone,
  Save,
  Search,
  Share2,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  companyFormSchema,
  fetchCompany,
  saveCompany,
  settingsKeys,
  toCompanyForm,
  EMPTY_COMPANY,
  type CompanyFormValues,
} from "@/lib/admin/settings-client";
import {
  Field,
  FormSection,
  inputClass,
  textareaClass,
} from "@/components/admin/ui/form";
import { LogoUpload } from "@/components/admin/settings/logo-upload";
import { LegalPagesEditor } from "@/components/admin/settings/legal-pages-editor";

type TabId = "profile" | "contact" | "social" | "seo" | "legal";

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "profile", label: "Company Profile", icon: Building2 },
  { id: "contact", label: "Contact Info", icon: Phone },
  { id: "social", label: "Social Media", icon: Share2 },
  { id: "seo", label: "SEO Defaults", icon: Search },
  { id: "legal", label: "Legal Pages", icon: FileText },
];

export function CompanySettingsForm({ canManage }: { canManage: boolean }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabId>("profile");

  const { data, isPending, isError, error } = useQuery({
    queryKey: settingsKeys.company,
    queryFn: fetchCompany,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: EMPTY_COMPANY,
  });

  useEffect(() => {
    if (data) reset(toCompanyForm(data));
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: saveCompany,
    onSuccess: (saved) => {
      queryClient.setQueryData(settingsKeys.company, saved);
      reset(toCompanyForm(saved));
      toast.success("Settings saved");
    },
    onError: (err) => toast.error((err as Error).message),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading settings…
      </div>
    );
  }
  if (isError) {
    return (
      <div className="py-24 text-center text-sm text-rose-400">
        {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">
          Company Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Branding, contact details, social profiles, SEO and legal pages.
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-border">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition",
              tab === id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "legal" ? (
        <LegalPagesEditor canManage={canManage} />
      ) : (
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          {/* ── Company Profile ──────────────────────────────────────── */}
          {tab === "profile" && (
            <FormSection>
              <Field label="Company name" error={errors.companyName?.message}>
                <input
                  className={inputClass}
                  disabled={!canManage}
                  {...register("companyName")}
                />
              </Field>
              <Field label="Tagline" error={errors.tagline?.message}>
                <input
                  className={inputClass}
                  disabled={!canManage}
                  placeholder="One line that sums up the business"
                  {...register("tagline")}
                />
              </Field>

              <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="logo"
                  render={({ field }) => (
                    <LogoUpload
                      label="Logo (light)"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      disabled={!canManage}
                      hint="SVG or PNG, used on light backgrounds"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="darkLogo"
                  render={({ field }) => (
                    <LogoUpload
                      label="Logo (dark)"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      disabled={!canManage}
                      hint="Used on dark backgrounds"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="favicon"
                  render={({ field }) => (
                    <LogoUpload
                      label="Favicon"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      disabled={!canManage}
                      hint="Square, 512×512 recommended"
                    />
                  )}
                />
              </div>
            </FormSection>
          )}

          {/* ── Contact Info ─────────────────────────────────────────── */}
          {tab === "contact" && (
            <div className="space-y-8">
              <FormSection title="Reach us">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Email" error={errors.email?.message}>
                    <input
                      type="email"
                      className={inputClass}
                      disabled={!canManage}
                      {...register("email")}
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      {...register("phone")}
                    />
                  </Field>
                  <Field label="WhatsApp">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      {...register("whatsapp")}
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection title="Address">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Address line 1" className="sm:col-span-2">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      {...register("address.line1")}
                    />
                  </Field>
                  <Field label="Address line 2" className="sm:col-span-2">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      {...register("address.line2")}
                    />
                  </Field>
                  <Field label="City">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      {...register("address.city")}
                    />
                  </Field>
                  <Field label="State">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      {...register("address.state")}
                    />
                  </Field>
                  <Field label="Pincode">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      {...register("address.pincode")}
                    />
                  </Field>
                  <Field label="Country">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      {...register("address.country")}
                    />
                  </Field>
                  <Field
                    label="Google Maps URL"
                    className="sm:col-span-2"
                    error={errors.address?.mapsUrl?.message}
                  >
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      placeholder="https://maps.google.com/…"
                      {...register("address.mapsUrl")}
                    />
                  </Field>
                </div>
              </FormSection>

              <FormSection
                title="Business hours"
                description="Shown on the contact page."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Weekdays">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      placeholder="9:00 AM – 6:00 PM"
                      {...register("businessHours.weekdays")}
                    />
                  </Field>
                  <Field label="Saturday">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      placeholder="10:00 AM – 2:00 PM"
                      {...register("businessHours.saturday")}
                    />
                  </Field>
                  <Field label="Sunday">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      placeholder="Closed"
                      {...register("businessHours.sunday")}
                    />
                  </Field>
                </div>
              </FormSection>
            </div>
          )}

          {/* ── Social Media ─────────────────────────────────────────── */}
          {tab === "social" && (
            <FormSection
              title="Social profiles"
              description="Full URLs including https://"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Facebook" error={errors.socialLinks?.facebook?.message}>
                  <input
                    className={inputClass}
                    disabled={!canManage}
                    {...register("socialLinks.facebook")}
                  />
                </Field>
                <Field
                  label="Instagram"
                  error={errors.socialLinks?.instagram?.message}
                >
                  <input
                    className={inputClass}
                    disabled={!canManage}
                    {...register("socialLinks.instagram")}
                  />
                </Field>
                <Field label="X (Twitter)" error={errors.socialLinks?.twitter?.message}>
                  <input
                    className={inputClass}
                    disabled={!canManage}
                    {...register("socialLinks.twitter")}
                  />
                </Field>
                <Field
                  label="LinkedIn"
                  error={errors.socialLinks?.linkedin?.message}
                >
                  <input
                    className={inputClass}
                    disabled={!canManage}
                    {...register("socialLinks.linkedin")}
                  />
                </Field>
                <Field label="YouTube" error={errors.socialLinks?.youtube?.message}>
                  <input
                    className={inputClass}
                    disabled={!canManage}
                    {...register("socialLinks.youtube")}
                  />
                </Field>
              </div>
            </FormSection>
          )}

          {/* ── SEO Defaults ─────────────────────────────────────────── */}
          {tab === "seo" && (
            <div className="space-y-8">
              <FormSection
                title="Default metadata"
                description="Used as fallbacks for pages without their own SEO."
              >
                <Field
                  label="Default title"
                  error={errors.seoDefaults?.title?.message}
                  hint="Up to 70 characters"
                >
                  <input
                    className={inputClass}
                    disabled={!canManage}
                    {...register("seoDefaults.title")}
                  />
                </Field>
                <Field
                  label="Default description"
                  error={errors.seoDefaults?.description?.message}
                  hint="Up to 180 characters"
                >
                  <textarea
                    className={textareaClass}
                    disabled={!canManage}
                    {...register("seoDefaults.description")}
                  />
                </Field>
                <Controller
                  control={control}
                  name="seoDefaults.ogImage"
                  render={({ field }) => (
                    <LogoUpload
                      label="Default OG image"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      disabled={!canManage}
                      hint="1200×630 recommended for social sharing"
                    />
                  )}
                />
              </FormSection>

              <FormSection
                title="Analytics IDs"
                description="Tracking tags injected site-wide."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Google Analytics">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      placeholder="G-XXXXXXX"
                      {...register("seoDefaults.googleAnalyticsId")}
                    />
                  </Field>
                  <Field label="Google Tag Manager">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      placeholder="GTM-XXXXXXX"
                      {...register("seoDefaults.googleTagManagerId")}
                    />
                  </Field>
                  <Field label="Meta Pixel">
                    <input
                      className={inputClass}
                      disabled={!canManage}
                      placeholder="1234567890"
                      {...register("seoDefaults.facebookPixelId")}
                    />
                  </Field>
                </div>
              </FormSection>
            </div>
          )}

          {/* Save bar (company tabs only) */}
          {canManage && (
            <div className="sticky bottom-0 mt-8 flex items-center justify-end gap-3 border-t border-border bg-background/80 py-4 backdrop-blur">
              {isDirty && (
                <span className="text-xs text-muted-foreground">
                  Unsaved changes
                </span>
              )}
              <button
                type="submit"
                disabled={mutation.isPending || !isDirty}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save changes
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
