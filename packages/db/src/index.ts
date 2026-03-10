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
  getDashboardPlans,
  createPlan,
  updatePlanDetails,
  updatePlanMacros,
  updatePlanPriceAdjustment,
  togglePlanActive,
  deletePlan,
} from './queries/dashboard'

export type {
  PortionSize,
  DashboardMealType,
  MealTypePortionPrice,
  DashboardPlan,
} from './queries/dashboard'
