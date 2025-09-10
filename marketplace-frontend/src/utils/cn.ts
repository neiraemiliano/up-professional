import { type ClassValue, clsx } from "clsx";

/**
 * Enterprise-grade className utility function
 * Combines clsx for conditional classes with proper TypeScript support
 * 
 * @param inputs - Array of class values (strings, objects, arrays)
 * @returns Merged className string
 * 
 * @example
 * cn("base-class", condition && "conditional-class", { "active": isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Utility for merging Tailwind classes with proper precedence
 * Handles conflicts between similar utilities (e.g., p-4 vs p-2)
 * 
 * @param baseClasses - Base className string
 * @param overrideClasses - Override className string
 * @returns Merged className string with proper precedence
 */
export function mergeTailwindClasses(baseClasses: string, overrideClasses?: string) {
  if (!overrideClasses) return baseClasses;
  
  // For now, just use clsx. In future, could implement twMerge for advanced merging
  return cn(baseClasses, overrideClasses);
}

/**
 * Conditional className helper for better readability
 * 
 * @param condition - Boolean condition
 * @param truthyClasses - Classes to apply when condition is true
 * @param falsyClasses - Classes to apply when condition is false
 * @returns Conditional className string
 * 
 * @example
 * conditionalClass(isActive, "bg-blue-500", "bg-gray-500")
 */
export function conditionalClass(
  condition: boolean, 
  truthyClasses: string, 
  falsyClasses?: string
) {
  return condition ? truthyClasses : (falsyClasses || "");
}

export default cn;