"use client";
import { kitName, type Kit } from "@/lib/jersey";

// Which kit a team wore in this match. The jersey number boxes use that kit's numbers.
export function KitToggle({ club, kit, altName, onChange }: { club: string; kit: Kit; altName: string | null; onChange: (k: Kit) => void }) {
  const chip = (on: boolean): React.CSSProperties => ({
    background: on ? "#101820" : "#fff", color: on ? "#fff" : "#101820", border: "1px solid rgba(17,24,39,.18)",
    fontSize: 13, fontWeight: 600, padding: "6px 12px", borderRadius: 999, cursor: "pointer", fontFamily: "'DM Sans',system-ui,sans-serif",
  });
  return (
    <div role="group" aria-label={`${club} jersey`} style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#66707d" }}>Jersey</span>
      {(["home", "alt"] as Kit[]).map(k => (
        <button key={k} type="button" aria-pressed={kit === k} style={chip(kit === k)} onClick={() => onChange(k)}>{kitName(k, altName)}</button>
      ))}
    </div>
  );
}
