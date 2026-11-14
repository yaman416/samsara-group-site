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

  // Bottom bar and partner wall: SPL Season 3 partners, then the venue partner, then media partners.
  // `g` starts a labelled group in the bar. No `f` (logo file) = shown as a clean text name.
  window.PARTNERS = [
    { n: "SBA Property Group", f: "sba.png", g: "PARTNERS", img: "img/sba.png" },
    { n: "GTM Property Solutions", f: "gtm.png" },
    { n: "Capital Education & Migration", f: "capital-education.png" },
    { n: "Capital Remittance", f: "capital-remittance.png", sq: true },
    { n: "Nepali Haat Bazaar", f: "nepalihaat.png" },
    { n: "Chautari Mini Mart", f: "chautari.png" },
    { n: "Navitas Skilled Futures", f: "navitas.png" },
    { n: "Dikshant Dhungel, LJ Hooker", f: "dikshant.png" },
    { n: "Ooshman", f: "ooshman.png" },
    { n: "The Monkey Temple", f: "monkeytemple.png", dark: true, sq: true },
    { n: "Lhotse", f: "lhotse.png" },
    { n: "The Saharsh Pavilion", f: "saharsh-pavilion.png", sq: true, g: "VENUE PARTNER" },
    { n: "Avyukta", f: "avyukt.png", sq: true, text: true, g: "MEDIA PARTNERS" },
    { n: "Katha Visuals" },
  ];
  // One partner as HTML, for the bar (cls "") or the wall.
  window.partnerHtml = function (p) {
    var src = p.img || (p.f ? "sponsors/" + p.f : null);
    var im = src ? '<img src="' + src + '" alt=""' + (p.sq && !p.dark ? ' class="sq"' : "") + ">" : "";
    var name = !src || p.text ? '<span class="nm">' + Live.esc(p.n) + "</span>" : "";
    return p.dark ? '<span class="dk">' + im + "</span>" : '<span class="pt">' + im + name + "</span>";
  };


  // Fit the 1920 x 1080 canvas to whatever window shows it (OBS at 1920 x 1080 stays 1:1).
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    if (!isFinite(s) || s <= 0) s = 1;
    var b = document.body.style;
    b.transformOrigin = "0 0";
    b.transform = Math.abs(s - 1) < 0.002 ? "" : "scale(" + s + ")";
  }
  window.addEventListener("resize", fit);
  fit();

  // ?preview=1 (used by the links in the admin portal) adds a grass-coloured backdrop so the
  // white graphics are easy to see in a normal browser tab. Never use it in the streaming software.
  if (P.get("preview") === "1" && !document.querySelector(".brk")) {
    document.documentElement.style.background = "#4a5a48";
  }

  poll();
})();
