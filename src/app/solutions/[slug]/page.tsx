import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductHero } from "@/components/product/product-hero";
import { PainPoints } from "@/components/product/pain-points";
import { ProductFeatures } from "@/components/product/product-features";
import { ProductScreenshots } from "@/components/product/product-screenshots";
import { ProductModules } from "@/components/product/product-modules";
import { ProductBenefits } from "@/components/product/product-benefits";
import { ProductPricing } from "@/components/product/product-pricing";
import { ProductFAQ } from "@/components/product/product-faq";
import { ProductIntegrations } from "@/components/product/product-integrations";
import { ProductCTA } from "@/components/product/product-cta";
import { RelatedProducts } from "@/components/product/related-products";
import { getProductDetail, getProductSlugs } from "@/data/product-details";
import { getProduct } from "@/data/products";
import { SITE_CONFIG } from "@/lib/constants";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render every product page at build time. */
export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = getProductDetail(slug);
  if (!detail) return {};

  const url = `${SITE_CONFIG.url}/solutions/${detail.slug}`;
  return {
    title: detail.metaTitle,
    description: detail.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${detail.metaTitle} | ${SITE_CONFIG.name}`,
      description: detail.metaDescription,
      url,
      siteName: SITE_CONFIG.name,
      type: "website",
      images: [{ url: SITE_CONFIG.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: detail.metaTitle,
      description: detail.metaDescription,
    },
  };
}

/**
 * Universal product page — every section renders from the
 * PRODUCT_DETAILS entry matching the slug.
 */
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const detail = getProductDetail(slug);
  const product = detail ? getProduct(detail.productId) : undefined;

  if (!detail || !product) notFound();

  return (
    <>
      <ProductHero detail={detail} product={product} />
      <PainPoints detail={detail} />
      <ProductFeatures detail={detail} />
      <ProductScreenshots detail={detail} />
      <ProductModules detail={detail} />
      <ProductBenefits detail={detail} />
      <ProductPricing detail={detail} />
      <ProductFAQ detail={detail} />
      <ProductIntegrations detail={detail} />
      <ProductCTA detail={detail} product={product} />
      <RelatedProducts detail={detail} />
    </>
  );
}
