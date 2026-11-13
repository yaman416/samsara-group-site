// Show player names as "Firstname Lastname": first letter of each word upper case,
// the rest lower case. Two-letter all-caps words (initials such as "KC") and tags such
// as "(C)" are kept as entered.
export function formatPlayerName(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .map(w => (/^[A-Z]{2}$/.test(w) || /^[^A-Za-z]/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
}
