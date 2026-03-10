export {
  createSupabaseBrowserClient,
  createSupabaseServerClient,
  createSupabaseAdminClient,
} from './client'

export type { Database, CookieStore } from './client'
export type { Json } from './types'

export {
  getVendorBySlug,
  getPlansByVendorId,
  getPlanBySlug,
  getPackagesForPlan,
  getPackageBySlug,
  getTiersForPlan,
  getPackagesForVendor,
  getAllTiersForVendor,
  getPlanPackagesForVendor,
  getMealTypesForVendor,
} from './queries/storefront'

export type {
  StorefrontVendor,
  StorefrontPlan,
  StorefrontPackage,
  StorefrontTier,
  PlanPackageLink,
  StorefrontMealType,
} from './queries/storefront'

export {
  getPortionSizes,
  getMealTypesWithPortions,
  upsertPortionSizes,
  createMealType,
  updateMealType,
  deleteMealType,
  reorderMealTypes,
} from './queries/dashboard'

export type {
  PortionSize,
  DashboardMealType,
  MealTypePortionPrice,
} from './queries/dashboard'
