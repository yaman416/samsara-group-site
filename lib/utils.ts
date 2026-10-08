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

// All league times are Canberra local time, whatever timezone the viewer's device is in.
export const LEAGUE_TZ = "Australia/Sydney"

function sydneyParts(ts: number) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: LEAGUE_TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date(ts))
      .map(x => [x.type, x.value])
  )
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, mi: +p.minute }
}

// ISO timestamp -> "YYYY-MM-DDTHH:mm" in Canberra time, for <input type="datetime-local">.
export function toLeagueInput(iso: string | null | undefined) {
  if (!iso) return ""
  const p = sydneyParts(new Date(iso).getTime())
  const z = (n: number) => String(n).padStart(2, "0")
  return `${p.y}-${z(p.m)}-${z(p.d)}T${z(p.h)}:${z(p.mi)}`
}

// "YYYY-MM-DDTHH:mm" typed as Canberra time -> UTC ISO timestamp.
export function fromLeagueInput(value: string) {
  const [date, time = "00:00"] = value.split("T")
  const [y, m, d] = date.split("-").map(Number)
  const [h, mi] = time.split(":").map(Number)
  const wall = Date.UTC(y, m - 1, d, h, mi)
  const offset = (ts: number) => { const p = sydneyParts(ts); return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi) - Math.floor(ts / 60000) * 60000 }
  // Two passes so times near a daylight-saving change land on the right offset.
  const first = wall - offset(wall)
  return new Date(wall - offset(first)).toISOString()
}
