// Shared utility functions — populated as needed across phases

/**
 * Converts a string to a URL-safe slug.
 * e.g. "High Protein Plan" → "high-protein-plan"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Formats a number as a currency string for GCC markets.
 * e.g. formatCurrency(1500, 'AED') → "AED 1,500.00"
 */
export function formatCurrency(amount: number, currency: string = 'AED'): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Calculates pre-cooking weight from post-cooking target weight.
 * Used in kitchen shopping list generation.
 * e.g. chicken with 25% cooking loss: 100g post → 133.3g pre-cooking
 */
export function preCookingWeight(postCookingGrams: number, cookingLossPercent: number): number {
  return postCookingGrams / (1 - cookingLossPercent / 100)
}
