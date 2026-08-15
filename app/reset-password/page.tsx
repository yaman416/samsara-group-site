"use client";
import { useState, useEffect } from "react";
import SiteLayout from "@/components/SiteLayout";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the token in the URL hash on redirect
    // Calling getSession picks it up automatically
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function updatePassword() {
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== password2) { setError("Passwords do not match."); return; }
    setBusy(true); setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) { setError(err.message); return; }
    setDone(true);
    setTimeout(() => { window.location.href = "/manager"; }, 2000);
  }

  const inputStyle = { width: "100%", boxSizing: "border-box" as const, border: "1px solid rgba(17,24,39,.18)", borderRadius: 12, fontSize: 16, padding: "14px 16px", color: "#101820", fontFamily: "'DM Sans',system-ui,sans-serif" };
  const labelStyle = { display: "block" as const, fontSize: 13, fontWeight: 500 as const, color: "#4a545f", marginBottom: 8 };
  const btnPrimary = { fontFamily: "'DM Sans',system-ui,sans-serif", background: "#101820", color: "#fff", border: 0, fontSize: 15, fontWeight: 500 as const, padding: "15px 30px", borderRadius: 999, cursor: busy ? "wait" as const : "pointer" as const, opacity: busy ? 0.7 : 1 };

  return (
    <SiteLayout>
      <section style={{ background: "#f4f4f1", padding: "72px 0 120px", minHeight: "60vh" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "clamp(32px,4vw,48px)" }}>

            {done ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#eef7f0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>✓</div>
                <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: 28, margin: "0 0 12px" }}>Password updated</h1>
                <p style={{ fontSize: 16, color: "#66707d" }}>Redirecting you to your portal...</p>
              </div>
            ) : !ready ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ fontSize: 16, color: "#66707d" }}>Verifying reset link...</p>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#e2372b" }}>Set new password</div>
                <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(24px,3vw,32px)", lineHeight: 1.2, letterSpacing: "-.015em", margin: "14px 0 0" }}>Choose a new password</h1>
                <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: 1.65, color: "#66707d" }}>Pick something secure. You will be signed in automatically after.</p>
                <div style={{ marginTop: 28, display: "grid", gap: 18 }}>
                  <div>
                    <label style={labelStyle}>New password</label>
                    <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="At least 8 characters" style={inputStyle} autoFocus />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm new password</label>
                    <input type="password" value={password2} onChange={e => { setPassword2(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && updatePassword()} placeholder="Repeat password" style={inputStyle} />
                  </div>
                  {error && <div style={{ background: "#fdecea", border: "1px solid #f5c6c0", borderRadius: 12, padding: "13px 16px", fontSize: 14, color: "#a3211a" }}>{error}</div>}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="button" onClick={updatePassword} disabled={busy} style={btnPrimary}>{busy ? "Updating..." : "Set new password"}</button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
