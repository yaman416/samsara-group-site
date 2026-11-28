"use client";
import type { Kit } from "@/lib/jersey";

// Which jersey colour a team wore in this match. The jersey number boxes use that jersey's numbers.
export function KitToggle({ club, kit, names, colours, onChange }: {
  club: string; kit: Kit; names: { home: string; alt: string }; colours: { home: string | null; alt: string | null }; onChange: (k: Kit) => void;
}) {
  const chip = (on: boolean): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    background: on ? "#101820" : "#fff", color: on ? "#fff" : "#101820", border: "1px solid rgba(17,24,39,.18)",
    fontSize: 13, fontWeight: 600, padding: "6px 12px", borderRadius: 999, cursor: "pointer", fontFamily: "'DM Sans',system-ui,sans-serif",
  });
  return (
    <div role="group" aria-label={`${club} jersey colour`} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d" }}>Jersey</span>
      {(["home", "alt"] as Kit[]).map(k => (
        <button key={k} type="button" aria-pressed={kit === k} style={chip(kit === k)} onClick={() => onChange(k)}>
          {colours[k] && <span aria-hidden style={{ width: 12, height: 12, borderRadius: 999, background: colours[k]!, border: "1px solid rgba(17,24,39,.3)" }} />}
          {names[k]}
        </button>
      ))}
    </div>
  );
}
