import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const protocol =
  process.env.NODE_ENV === 'production' ? 'https' : 'http';
export const rootDomain = process.env.NODE_ENV === 'production' ?
  (process.env.NEXT_PUBLIC_ROOT_DOMAIN as string) : 'localhost:3000';
export const baseUrl = `${protocol}://${rootDomain}`

  export const getInitials = (str: string): string => {
  if (typeof str !== "string" || !str.trim()) return "?";

  return (
    str
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
};

