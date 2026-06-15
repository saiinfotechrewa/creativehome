import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import {
  productSchema,
  serviceSchema,
  industrySchema,
} from "@/lib/validators";
import {
  createCatalogAdminApi,
  createCatalogPublicApi,
  type CatalogConfig,
} from "@/lib/admin/catalog";

/**
 * One config per catalog resource. The Prisma delegate is cast to the factory's
 * structural `CatalogDelegate` (Prisma's overloaded signatures don't assign
 * directly). Building both admin + public APIs here keeps every route file a
 * thin re-export.
 */

type Delegate = CatalogConfig["delegate"];

const productConfig: CatalogConfig = {
  module: "products",
  label: "Product",
  delegate: prisma.product as unknown as Delegate,
  schema: productSchema,
  viewPermission: PERMISSIONS.PRODUCTS_VIEW,
  managePermission: PERMISSIONS.PRODUCTS_MANAGE,
  searchFields: ["name", "tagline", "slug"],
  publicListSelect: {
    id: true,
    slug: true,
    name: true,
    tagline: true,
    descriptions: true,
    icon: true,
    color: true,
    gradient: true,
    badge: true,
    order: true,
  },
};

const serviceConfig: CatalogConfig = {
  module: "services",
  label: "Service",
  delegate: prisma.service as unknown as Delegate,
  schema: serviceSchema,
  viewPermission: PERMISSIONS.SERVICES_VIEW,
  managePermission: PERMISSIONS.SERVICES_MANAGE,
  searchFields: ["name", "description", "slug"],
  publicListSelect: {
    id: true,
    slug: true,
    name: true,
    description: true,
    icon: true,
    color: true,
    order: true,
  },
};

const industryConfig: CatalogConfig = {
  module: "industries",
  label: "Industry",
  delegate: prisma.industry as unknown as Delegate,
  schema: industrySchema,
  viewPermission: PERMISSIONS.INDUSTRIES_VIEW,
  managePermission: PERMISSIONS.INDUSTRIES_MANAGE,
  searchFields: ["name", "description", "slug"],
  publicListSelect: {
    id: true,
    slug: true,
    name: true,
    description: true,
    icon: true,
    color: true,
    order: true,
  },
};

export const productsAdminApi = createCatalogAdminApi(productConfig);
export const productsPublicApi = createCatalogPublicApi(productConfig);

export const servicesAdminApi = createCatalogAdminApi(serviceConfig);
export const servicesPublicApi = createCatalogPublicApi(serviceConfig);

export const industriesAdminApi = createCatalogAdminApi(industryConfig);
export const industriesPublicApi = createCatalogPublicApi(industryConfig);
