"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  inputClass,
  textareaClass,
  Field,
  FormSection,
} from "@/components/admin/ui/form";
import { fetchProductOptions, catalogKeys } from "@/lib/admin/catalog-client";
import {
  createCaseStudy,
  updateCaseStudy,
  caseStudyKeys,
  slugify,
  CASE_STUDY_STATUSES,
  type CaseStudyDetail,
  type CaseStudyInput,
  type CaseStudyResult,
} from "@/lib/admin/case-studies-client";

function emptyInput(): CaseStudyInput {
  return {
    slug: "",
    status: "DRAFT",
    title: "",
    client: { name: "", industry: "", size: "", logo: "", website: "" },
    challenge: "",
    solution: "",
    results: [{ metric: "", value: "", label: "" }],
    productsUsed: [],
    testimonial: { quote: "", name: "", role: "" },
    featuredImage: "",
    seo: { title: "", description: "", keywords: [], ogImage: "" },
  };
}

function fromDetail(cs: CaseStudyDetail): CaseStudyInput {
  return {
    slug: cs.slug,
    status: cs.status,
    title: cs.title,
    client: {
      name: cs.client?.name ?? "",
      industry: cs.client?.industry ?? "",
      size: cs.client?.size ?? "",
      logo: cs.client?.logo ?? "",
      website: cs.client?.website ?? "",
    },
    challenge: cs.challenge ?? "",
    solution: cs.solution ?? "",
    results:
      cs.results?.length > 0
        ? cs.results.map((r) => ({
            metric: r.metric ?? "",
            value: r.value ?? "",
            label: r.label ?? "",
          }))
        : [{ metric: "", value: "", label: "" }],
    productsUsed: cs.productsUsed ?? [],
    testimonial: {
      quote: cs.testimonial?.quote ?? "",
      name: cs.testimonial?.name ?? "",
      role: cs.testimonial?.role ?? "",
    },
    featuredImage: cs.featuredImage ?? "",
    seo: {
      title: cs.seo?.title ?? "",
      description: cs.seo?.description ?? "",
      keywords: cs.seo?.keywords ?? [],
      ogImage: cs.seo?.ogImage ?? "",
    },
  };
}

export function CaseStudyForm({ existing }: { existing?: CaseStudyDetail }) {
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = !!existing;

  const [form, setForm] = useState<CaseStudyInput>(
    existing ? fromDetail(existing) : emptyInput(),
  );
  // Track whether the user has hand-edited the slug (auto-fill until then).
  const [slugTouched, setSlugTouched] = useState(isEdit);

  const { data: products } = useQuery({
    queryKey: catalogKeys.products,
    queryFn: fetchProductOptions,
    staleTime: 5 * 60_000,
  });

  const patch = (p: Partial<CaseStudyInput>) => setForm((f) => ({ ...f, ...p }));
  const patchClient = (p: Partial<CaseStudyInput["client"]>) =>
    setForm((f) => ({ ...f, client: { ...f.client, ...p } }));
  const patchTestimonial = (p: Partial<CaseStudyInput["testimonial"]>) =>
    setForm((f) => ({ ...f, testimonial: { ...f.testimonial, ...p } }));
  const patchSeo = (p: Partial<CaseStudyInput["seo"]>) =>
    setForm((f) => ({ ...f, seo: { ...f.seo, ...p } }));

  function onTitleChange(value: string) {
    patch({
      title: value,
      ...(slugTouched ? {} : { slug: slugify(value) }),
    });
  }

  function setResult(index: number, p: Partial<CaseStudyResult>) {
    setForm((f) => ({
      ...f,
      results: f.results.map((r, i) => (i === index ? { ...r, ...p } : r)),
    }));
  }
  function addResult() {
    setForm((f) => ({
      ...f,
      results: [...f.results, { metric: "", value: "", label: "" }],
    }));
  }
  function removeResult(index: number) {
    setForm((f) => ({
      ...f,
      results: f.results.filter((_, i) => i !== index),
    }));
  }

  function toggleProduct(slug: string) {
    setForm((f) => ({
      ...f,
      productsUsed: f.productsUsed.includes(slug)
        ? f.productsUsed.filter((s) => s !== slug)
        : [...f.productsUsed, slug],
    }));
  }

  const mutation = useMutation({
    mutationFn: () => {
      // Drop empty result rows before saving.
      const payload: CaseStudyInput = {
        ...form,
        challenge: form.challenge?.trim() || undefined,
        solution: form.solution?.trim() || undefined,
        featuredImage: form.featuredImage?.trim() || undefined,
        results: form.results.filter((r) => r.metric.trim() || r.value.trim()),
      };
      return isEdit
        ? updateCaseStudy(existing.slug, payload)
        : createCaseStudy(payload);
    },
    onSuccess: (saved) => {
      toast.success(isEdit ? "Case study updated" : "Case study created");
      qc.invalidateQueries({ queryKey: caseStudyKeys.all });
      router.push(`/admin/case-studies/${saved.slug}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const titleInvalid = form.title.trim().length < 3;
  const slugInvalid = form.slug.trim().length < 1;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/case-studies"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to case studies
      </Link>

      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-foreground">
          {isEdit ? "Edit case study" : "New case study"}
        </h1>
        <button
          type="button"
          disabled={titleInvalid || slugInvalid || mutation.isPending}
          onClick={() => mutation.mutate()}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {mutation.isPending ? "Saving…" : "Save"}
        </button>
      </header>

      <div className="space-y-6">
        {/* Basics */}
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Title"
              className="sm:col-span-2"
              error={
                titleInvalid && form.title.length > 0
                  ? "At least 3 characters"
                  : undefined
              }
            >
              <input
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="How Acme cut onboarding time by 70%"
                className={inputClass}
              />
            </Field>
            <Field label="Slug" error={slugInvalid ? "Required" : undefined}>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  patch({ slug: slugify(e.target.value) });
                }}
                placeholder="acme-onboarding"
                className={inputClass}
              />
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  patch({ status: e.target.value as CaseStudyInput["status"] })
                }
                className={inputClass}
              >
                {CASE_STUDY_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Card>

        {/* Client */}
        <Card>
          <FormSection title="Client" description="Who this case study is about.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client name">
                <input
                  value={form.client.name ?? ""}
                  onChange={(e) => patchClient({ name: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Industry">
                <input
                  value={form.client.industry ?? ""}
                  onChange={(e) => patchClient({ industry: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Company size">
                <input
                  value={form.client.size ?? ""}
                  onChange={(e) => patchClient({ size: e.target.value })}
                  placeholder="50–200 employees"
                  className={inputClass}
                />
              </Field>
              <Field label="Website">
                <input
                  value={form.client.website ?? ""}
                  onChange={(e) => patchClient({ website: e.target.value })}
                  placeholder="https://…"
                  className={inputClass}
                />
              </Field>
              <Field label="Logo URL" className="sm:col-span-2">
                <input
                  value={form.client.logo ?? ""}
                  onChange={(e) => patchClient({ logo: e.target.value })}
                  placeholder="https://…"
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>
        </Card>

        {/* Challenge & solution (rich text / HTML) */}
        <Card>
          <FormSection
            title="Story"
            description="Challenge and solution accept HTML / MDX."
          >
            <Field label="Challenge">
              <textarea
                value={form.challenge ?? ""}
                onChange={(e) => patch({ challenge: e.target.value })}
                rows={5}
                placeholder="What problem did the client face?"
                className={cn(textareaClass, "min-h-[140px] font-mono text-xs")}
              />
            </Field>
            <Field label="Solution">
              <textarea
                value={form.solution ?? ""}
                onChange={(e) => patch({ solution: e.target.value })}
                rows={5}
                placeholder="How did our product solve it?"
                className={cn(textareaClass, "min-h-[140px] font-mono text-xs")}
              />
            </Field>
          </FormSection>
        </Card>

        {/* Results */}
        <Card>
          <FormSection
            title="Results"
            description="Headline metrics shown as stat cards."
          >
            <div className="space-y-3">
              {form.results.map((r, i) => (
                <div
                  key={i}
                  className="grid gap-2 sm:grid-cols-[1fr_1fr_1.4fr_auto]"
                >
                  <input
                    value={r.value}
                    onChange={(e) => setResult(i, { value: e.target.value })}
                    placeholder="Value (e.g. 70%)"
                    className={inputClass}
                  />
                  <input
                    value={r.metric}
                    onChange={(e) => setResult(i, { metric: e.target.value })}
                    placeholder="Metric (e.g. faster)"
                    className={inputClass}
                  />
                  <input
                    value={r.label ?? ""}
                    onChange={(e) => setResult(i, { label: e.target.value })}
                    placeholder="Label (e.g. onboarding)"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => removeResult(i)}
                    aria-label="Remove result"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-rose-400 transition hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addResult}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-foreground transition hover:bg-accent"
              >
                <Plus className="h-4 w-4" /> Add result
              </button>
            </div>
          </FormSection>
        </Card>

        {/* Products used */}
        <Card>
          <FormSection
            title="Products used"
            description="Which products this case study showcases."
          >
            {!products ? (
              <p className="text-sm text-muted-foreground">Loading products…</p>
            ) : products.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No products available.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {products.map((p) => {
                  const active = form.productsUsed.includes(p.slug);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleProduct(p.slug)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-sm font-medium transition",
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent",
                      )}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            )}
          </FormSection>
        </Card>

        {/* Testimonial */}
        <Card>
          <FormSection
            title="Featured testimonial"
            description="Optional pull-quote from the client."
          >
            <Field label="Quote">
              <textarea
                value={form.testimonial.quote ?? ""}
                onChange={(e) => patchTestimonial({ quote: e.target.value })}
                rows={3}
                className={textareaClass}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input
                  value={form.testimonial.name ?? ""}
                  onChange={(e) => patchTestimonial({ name: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Role">
                <input
                  value={form.testimonial.role ?? ""}
                  onChange={(e) => patchTestimonial({ role: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>
        </Card>

        {/* Featured image */}
        <Card>
          <FormSection title="Featured image">
            <div className="flex items-start gap-4">
              {form.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.featuredImage}
                  alt=""
                  className="h-24 w-40 shrink-0 rounded-md border border-border object-cover"
                />
              ) : (
                <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                  No image
                </div>
              )}
              <Field label="Image URL" className="flex-1">
                <input
                  value={form.featuredImage ?? ""}
                  onChange={(e) => patch({ featuredImage: e.target.value })}
                  placeholder="https://…"
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>
        </Card>

        {/* SEO */}
        <Card>
          <FormSection
            title="SEO"
            description="Overrides for search engines and social cards."
          >
            <Field label="Meta title">
              <input
                value={form.seo.title ?? ""}
                onChange={(e) => patchSeo({ title: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Meta description">
              <textarea
                value={form.seo.description ?? ""}
                onChange={(e) => patchSeo({ description: e.target.value })}
                rows={2}
                className={textareaClass}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Keywords" hint="Comma-separated.">
                <input
                  value={(form.seo.keywords ?? []).join(", ")}
                  onChange={(e) =>
                    patchSeo({
                      keywords: e.target.value
                        .split(",")
                        .map((k) => k.trim())
                        .filter(Boolean),
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="OG image URL">
                <input
                  value={form.seo.ogImage ?? ""}
                  onChange={(e) => patchSeo({ ogImage: e.target.value })}
                  placeholder="https://…"
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>
        </Card>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      {children}
    </section>
  );
}
