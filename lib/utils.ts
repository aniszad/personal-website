import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves conflicting Tailwind utilities,
 * so a caller can always override a component's default classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
