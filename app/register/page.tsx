"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";
import { supabase } from "@/lib/supabase";

type View = "public" | "code" | "setup" | "done" | "signin" | "forgot" | "forgot_sent";

export default function RegisterPage() {
  const [view, setView] = useState<View>("public");

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("signin") === "1") {
      setView("signin");
    }
  }, []);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [clubName, setClubName] = useState("");
  const [community, setCommunity] = useState("Nepalese");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [setupError, setSetupError] = useState("");
  const [siEmail, setSiEmail] = useState("");
  const [siPass, setSiPass] = useState("");
  const [siError, setSiError] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");

  async function verifyCode() {
    const v = code.trim().toUpperCase().replace(/\s/g, "");
    if (!v) { setCodeError("Enter the invitation code from your email."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/invite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: v }) });
      const data = await res.json();
      if (!res.ok) { setCodeError(data.error); }
      else { setClubName(data.clubName); setCommunity(data.community ?? "Nepalese"); setView("setup"); setCodeError(""); }
    } catch { setCodeError("Network error. Try again."); }
    finally { setBusy(false); }
  }

  async function createAccount() {
    if (!email) { setSetupError("Enter your email address."); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setSetupError("Enter a valid email address."); return; }
    if (password.length < 8) { setSetupError("Password must be at least 8 characters."); return; }
    if (password !== password2) { setSetupError("Passwords do not match."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase().replace(/\s/g, ""),
          acct: { name: "", email, phone: "", pass: password, pass2: password2 },
          club: { name: clubName, short: "", ground: "", founded: "" },
          community,
          kit: { hp: "#b3122b", hs: "#101820", ap: "#ffffff", as: "#b3122b" },
          squad: [],
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSetupError(data.error || "Registration failed. Try again."); return; }
      // auto sign in so browser session is established
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError || !authData.session) { setView("done"); return; }
      localStorage.setItem("spl_token", authData.session.access_token);
      window.location.href = "/manager";
    } catch { setSetupError("Network error. Try again."); }
    finally { setBusy(false); }
  }

  async function signIn() {
    if (!siEmail || !siPass) { setSiError("Enter your email and password."); return; }
    setBusy(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: siEmail, password: siPass });
      if (error || !data.session) { setSiError("Incorrect email or password."); return; }
      localStorage.setItem("spl_token", data.session.access_token);
      window.location.href = "/manager";
    } catch { setSiError("Network error. Try again."); }
    finally { setBusy(false); }
  }

  async function sendReset() {
    if (!forgotEmail.trim()) { setForgotError("Enter your email address."); return; }
    setBusy(true); setForgotError("");
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) { setForgotError(error.message); return; }
    setView("forgot_sent");
  }

  const inputStyle = { width: "100%", boxSizing: "border-box" as const, border: "1px solid rgba(17,24,39,.18)", borderRadius: 12, fontSize: 16, padding: "14px 16px", color: "#101820", fontFamily: "'DM Sans',system-ui,sans-serif" };
  const labelStyle = { display: "block" as const, fontSize: 13, fontWeight: 500 as const, color: "#4a545f", marginBottom: 8 };
  const btnPrimary = { fontFamily: "'DM Sans',system-ui,sans-serif", background: "#101820", color: "#fff", border: 0, fontSize: 15, fontWeight: 500 as const, padding: "15px 30px", borderRadius: 999, cursor: busy ? "wait" as const : "pointer" as const, opacity: busy ? 0.7 : 1 };
  const btnRed = { ...btnPrimary, background: "#e2372b" };

  return (
    <SiteLayout>
      <style>{`a{color:#e2372b;text-decoration:none;} a:hover{color:#c22b20;} input:focus{outline:2px solid #101820;outline-offset:1px;}`}</style>

      {/* PUBLIC */}
      {view === "public" && (
        <>
          <section style={{ background: "#101820", color: "#fff", overflow: "hidden", position: "relative" }}>
            <Image src="/gallery/FINAL%20SPL%202025-26/645590660_122201103038559639_895508620839760949_n.jpg" alt="" fill style={{ objectFit: "cover", objectPosition: "center 32%", opacity: .25 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(16,24,32,.72) 0%,rgba(16,24,32,.96) 100%)" }} />
            <div style={{ position: "relative", maxWidth: 1340, margin: "0 auto", padding: "72px 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 56, alignItems: "end" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase", color: "#98a1ab" }}>Season 3 · 2026-27</div>
                <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 600, fontSize: "clamp(34px,4.6vw,58px)", lineHeight: 1.06, letterSpacing: "-.02em", margin: "20px 0 0" }}>Register your club</h1>
                <p style={{ margin: "22px 0 0", fontSize: 18, lineHeight: 1.7, color: "#c3cad2", maxWidth: "52ch" }}>
                  Entry to the Samsara Premier League is by invitation. Your manager will have received a six-character code by email.
                </p>
                <div style={{ marginTop: 34, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => setView("code")} style={btnRed}>Enter invitation code</button>
                  <button type="button" onClick={() => setView("signin")} style={{ ...btnPrimary, background: "none", border: "1px solid rgba(255,255,255,.3)", color: "#fff" }}>I already have an account</button>
                </div>
              </div>
              <div style={{ display: "grid", gap: 1, background: "rgba(255,255,255,.14)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 18, overflow: "hidden" }}>
                {[["Registration closes", "17 October 2026"], ["Squad", "Max 22 players"], ["Invites accepted", "0 of 12 clubs"]].map(([label, val]) => (
                  <div key={label} style={{ background: "rgba(11,17,22,.5)", padding: "26px 28px" }}>
                    <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#98a1ab" }}>{label}</div>
                    <div style={{ fontSize: 22, fontWeight: 500, marginTop: 8, letterSpacing: "-.01em" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </>
      )}

      {/* CODE ENTRY */}
      {view === "code" && (
        <section style={{ background: "#f4f4f1", padding: "72px 0 120px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "clamp(32px,4vw,48px)" }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#e2372b" }}>Step 1 of 2</div>
              <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(26px,3vw,34px)", lineHeight: 1.2, letterSpacing: "-.015em", margin: "14px 0 0" }}>Enter your invitation code</h1>
              <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: 1.65, color: "#66707d" }}>Six characters, from the email sent to your club manager.</p>
              <div style={{ marginTop: 28 }}>
                <label htmlFor="codeInput" style={labelStyle}>Invitation code</label>
                <input id="codeInput" type="text" value={code} onChange={e => { setCode(e.target.value); setCodeError(""); }}
                  onKeyDown={e => e.key === "Enter" && verifyCode()}
                  placeholder="SPL3-XXXX" autoFocus
                  style={{ ...inputStyle, fontSize: 24, fontWeight: 500, letterSpacing: ".14em", textTransform: "uppercase" }} />
                {codeError && <div style={{ marginTop: 10, background: "#fdecea", border: "1px solid #f5c6c0", borderRadius: 12, padding: "13px 16px", fontSize: 14, color: "#a3211a" }}>{codeError}</div>}
              </div>
              <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button type="button" onClick={() => setView("public")} style={{ ...btnPrimary, background: "none", border: "1px solid rgba(17,24,39,.18)", color: "#101820" }}>Cancel</button>
                <button type="button" onClick={verifyCode} disabled={busy} style={btnPrimary}>{busy ? "Checking..." : "Verify code"}</button>
              </div>
              <p style={{ marginTop: 24, fontSize: 14, color: "#66707d" }}>
                Lost your code? Email <a href="mailto:samsaragroup.cbr@gmail.com">samsaragroup.cbr@gmail.com</a>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ACCOUNT SETUP */}
      {view === "setup" && (
        <section style={{ background: "#f4f4f1", padding: "72px 0 120px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "clamp(32px,4vw,48px)" }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#e2372b" }}>Step 2 of 2</div>
              <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(26px,3vw,34px)", lineHeight: 1.2, letterSpacing: "-.015em", margin: "14px 0 0" }}>Create your manager account</h1>
              {clubName && (
                <div style={{ marginTop: 16, background: "#eef7f0", border: "1px solid #c7e3ce", borderRadius: 12, padding: "14px 18px", fontSize: 15, color: "#1f6b37" }}>
                  Code accepted. Registering <strong>{clubName}</strong> for Season 3.
                </div>
              )}
              <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.65, color: "#66707d" }}>One login per club. You will use this to manage your squad and portal all season.</p>
              <div style={{ marginTop: 28, display: "grid", gap: 18 }}>
                <div>
                  <label htmlFor="email" style={labelStyle}>Email address</label>
                  <input id="email" type="email" value={email} onChange={e => { setEmail(e.target.value); setSetupError(""); }} placeholder="manager@yourclub.com.au" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="pass" style={labelStyle}>Password</label>
                  <input id="pass" type="password" value={password} onChange={e => { setPassword(e.target.value); setSetupError(""); }} placeholder="At least 8 characters" style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="pass2" style={labelStyle}>Confirm password</label>
                  <input id="pass2" type="password" value={password2} onChange={e => { setPassword2(e.target.value); setSetupError(""); }}
                    onKeyDown={e => e.key === "Enter" && createAccount()}
                    placeholder="Repeat password" style={inputStyle} />
                </div>
                {setupError && <div style={{ background: "#fdecea", border: "1px solid #f5c6c0", borderRadius: 12, padding: "13px 16px", fontSize: 14, color: "#a3211a" }}>{setupError}</div>}
              </div>
              <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button type="button" onClick={() => setView("code")} style={{ ...btnPrimary, background: "none", border: "1px solid rgba(17,24,39,.18)", color: "#101820" }}>Back</button>
                <button type="button" onClick={createAccount} disabled={busy} style={btnPrimary}>{busy ? "Creating account..." : "Create account"}</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DONE */}
      {view === "done" && (
        <section style={{ background: "#f4f4f1", padding: "72px 0 120px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "clamp(32px,4vw,48px)", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#eef7f0", border: "1px solid #c7e3ce", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: 24 }}>&#10003;</div>
              <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(24px,3vw,32px)", lineHeight: 1.2, letterSpacing: "-.015em", margin: "20px 0 0" }}>Account created</h1>
              <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.65, color: "#66707d" }}>
                {clubName} is registered. Log in to your club portal to add players, set kit colours and submit your squad for approval.
              </p>
              <a href="/manager" style={{ display: "inline-block", marginTop: 28, background: "#101820", color: "#fff", fontSize: 15, fontWeight: 500, padding: "15px 30px", borderRadius: 999, textDecoration: "none" }}>Go to my club portal</a>
            </div>
          </div>
        </section>
      )}

      {/* SIGN IN */}
      {view === "signin" && (
        <section style={{ background: "#f4f4f1", padding: "72px 0 120px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "clamp(32px,4vw,48px)" }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#e2372b" }}>Club login</div>
              <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(26px,3vw,34px)", lineHeight: 1.2, letterSpacing: "-.015em", margin: "14px 0 0" }}>Welcome back</h1>
              <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: 1.65, color: "#66707d" }}>Sign in to manage your club, squad and fixtures.</p>
              <div style={{ marginTop: 28, display: "grid", gap: 18 }}>
                <div>
                  <label htmlFor="siEmail" style={labelStyle}>Email</label>
                  <input id="siEmail" type="email" value={siEmail} onChange={e => { setSiEmail(e.target.value); setSiError(""); }} placeholder="manager@yourclub.com.au" style={inputStyle} autoFocus />
                </div>
                <div>
                  <label htmlFor="siPass" style={labelStyle}>Password</label>
                  <input id="siPass" type="password" value={siPass} onChange={e => { setSiPass(e.target.value); setSiError(""); }}
                    onKeyDown={e => e.key === "Enter" && signIn()}
                    placeholder="••••••••" style={inputStyle} />
                </div>
                {siError && <div style={{ background: "#fdecea", border: "1px solid #f5c6c0", borderRadius: 12, padding: "13px 16px", fontSize: 14, color: "#a3211a" }}>{siError}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => { setForgotEmail(siEmail); setForgotError(""); setView("forgot"); }} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "none", border: 0, padding: 0, fontSize: 14, color: "#66707d", cursor: "pointer" }}>Forgot password?</button>
                  <button type="button" onClick={signIn} disabled={busy} style={btnPrimary}>{busy ? "Signing in..." : "Sign in"}</button>
                </div>
              </div>
              <div style={{ marginTop: 28, borderTop: "1px solid rgba(17,24,39,.08)", paddingTop: 24, fontSize: 15, color: "#66707d" }}>
                First time here? <button type="button" onClick={() => setView("code")} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "none", border: 0, padding: 0, color: "#e2372b", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>Register with an invitation code</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FORGOT PASSWORD */}
      {view === "forgot" && (
        <section style={{ background: "#f4f4f1", padding: "72px 0 120px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "clamp(32px,4vw,48px)" }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", color: "#e2372b" }}>Password reset</div>
              <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(24px,3vw,32px)", lineHeight: 1.2, letterSpacing: "-.015em", margin: "14px 0 0" }}>Forgot your password?</h1>
              <p style={{ margin: "12px 0 0", fontSize: 16, lineHeight: 1.65, color: "#66707d" }}>Enter your account email and we will send you a link to reset your password.</p>
              <div style={{ marginTop: 28, display: "grid", gap: 18 }}>
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input type="email" value={forgotEmail} onChange={e => { setForgotEmail(e.target.value); setForgotError(""); }} onKeyDown={e => e.key === "Enter" && sendReset()} placeholder="manager@yourclub.com.au" style={inputStyle} autoFocus />
                </div>
                {forgotError && <div style={{ background: "#fdecea", border: "1px solid #f5c6c0", borderRadius: 12, padding: "13px 16px", fontSize: 14, color: "#a3211a" }}>{forgotError}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                  <button type="button" onClick={() => setView("signin")} style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "none", border: 0, padding: 0, fontSize: 14, color: "#66707d", cursor: "pointer" }}>Back to sign in</button>
                  <button type="button" onClick={sendReset} disabled={busy} style={btnPrimary}>{busy ? "Sending..." : "Send reset link"}</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FORGOT SENT */}
      {view === "forgot_sent" && (
        <section style={{ background: "#f4f4f1", padding: "72px 0 120px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ background: "#fff", border: "1px solid rgba(17,24,39,.10)", borderRadius: 18, padding: "clamp(32px,4vw,48px)", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#eef7f0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>✓</div>
              <h1 style={{ fontFamily: "Lora,Georgia,serif", fontWeight: 500, fontSize: "clamp(22px,3vw,30px)", lineHeight: 1.2, margin: "0 0 14px" }}>Check your email</h1>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#66707d", margin: 0 }}>If <strong style={{ color: "#101820" }}>{forgotEmail}</strong> is registered, you will receive a reset link shortly. Click it to set a new password.</p>
              <p style={{ fontSize: 14, color: "#98a1ab", marginTop: 16 }}>Check your spam folder if it does not arrive within a few minutes. Make sure you registered with this exact email address.</p>
              <button type="button" onClick={() => setView("signin")} style={{ ...btnPrimary, marginTop: 28 }}>Back to sign in</button>
            </div>
          </div>
        </section>
      )}

    </SiteLayout>
  );
}
