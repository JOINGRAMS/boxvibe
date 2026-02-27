import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// shadcn/ui's standard cn() utility for conditional class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
