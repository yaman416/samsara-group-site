import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Clubs store their community as "Nepalese" / "Bhutanese"; labels show the country.
export function communityCountry(community: string | null | undefined) {
  const map: Record<string, string> = { Nepalese: "Nepal", Bhutanese: "Bhutan" };
  return community ? map[community] ?? community : "";
}
