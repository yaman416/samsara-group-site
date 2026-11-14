// Shared live feed for the OBS overlay pages. Polls /api/public/live and calls back with fresh data.
// URL options (all pages): ?fixture=<id> to pin a match instead of the one set "on stream" in the admin portal.
(function () {
  var P = new URLSearchParams(location.search);
  var fixture = P.get("fixture");
  var url = "/api/public/live" + (fixture ? "?fixture=" + encodeURIComponent(fixture) : "");
  var subs = [], last = null, offset = 0;

  function poll() {
    fetch(url, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d) return;
        offset = Date.parse(d.now) - Date.now();
        last = d;
        subs.forEach(function (fn) { fn(d); });
      })
      .catch(function () { /* keep showing the last good data */ })
      .finally(function () { setTimeout(poll, 1500); });
  }

  window.Live = {
    param: function (k) { return P.get(k); },
    on: function (fn) { subs.push(fn); if (last) fn(last); },
    now: function () { return Date.now() + offset; }, // server-aligned time
    // Same rule as lib/live.ts matchClock.
    clock: function (l) {
      if (!l) return "";
      if (l.period === "HT") return "HT";
      if (l.period === "FT") return "FT";
      if (l.period === "pre" || !l.period_started_at) return "";
      var base = l.period === "2H" ? l.half_minutes * 60 : 0;
      var s = base + Math.max(0, Math.floor((Live.now() - Date.parse(l.period_started_at)) / 1000));
      return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    },
    periodLabel: function (l) {
      return { pre: "KICK-OFF", "1H": "1ST HALF", HT: "HALF TIME", "2H": "2ND HALF", FT: "FULL TIME" }[(l && l.period) || "pre"];
    },
    logo: function (c) { return c && c.logo ? encodeURI(c.logo) : "img/spl-crest.png"; },
    time: function (iso) {
      return iso ? new Date(iso).toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit", timeZone: "Australia/Sydney" }).toUpperCase() : "";
    },
    esc: function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); },
  };

  // Season 3 partners, in stage-script order (SBA Property Group appears separately as presenting partner).
  window.PARTNERS = [
    { n: "GTM", f: "gtm.png" },
    { n: "Capital Education & Migration", f: "capital-education.png" },
    { n: "Capital Remittance", f: "capital-remittance.png", sq: true },
    { n: "Nepali Haat Bazaar", f: "nepalihaat.png" },
    { n: "The Monkey Temple", f: "monkeytemple.png", dark: true, sq: true },
    { n: "Lhotse", f: "lhotse.png" },
    { n: "Ooshman", f: "ooshman.png" },
    { n: "Dikshant Dhungel, LJ Hooker", f: "dikshant.png" },
    { n: "Global Consult Canberra", f: "global-consultant.png" },
    { n: "Navitas Skilled Futures", f: "navitas.png" },
    { n: "Aussie Finance and Home Loans", f: "aussie-homes.png", sq: true },
    { n: "Bittersweet Café", f: "bittersweet.png", sq: true },
    { n: "Sherpa Removals", f: "sherpa-removal.png" },
    { n: "Chautari Mini Mart", f: "chautari.png" },
    { n: "The Saharsh Pavilion", f: "saharsh-pavilion.png", sq: true },
  ];

  poll();
})();
