"use client";
import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) {
      setMsg("Subscribed! You'll receive fixture updates and announcements.");
      setEmail("");
    } else {
      setMsg(data.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 flex flex-col gap-2">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-[#15202b] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a56db]"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-[#18212a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#253240] disabled:opacity-60"
      >
        {busy ? "Subscribing..." : "Subscribe"}
      </button>
      {msg && (
        <p className={`text-xs leading-5 ${msg.startsWith("Subscribed") ? "text-green-700" : "text-red-600"}`}>
          {msg}
        </p>
      )}
    </form>
  );
}
