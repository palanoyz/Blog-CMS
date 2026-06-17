/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function flattenZodError(error: any): Record<string, string[]> {
  const flattened: Record<string, string[]> = {};

  function traverse(node: any, path: string[] = []) {
    if (node.errors && node.errors.length > 0) {
      const key = path.join(".");
      flattened[key] = node.errors;
    }
    if (node.properties) {
      for (const key in node.properties) {
        traverse(node.properties[key], [...path, key]);
      }
    }
  }

  traverse(error);
  return flattened;
}
