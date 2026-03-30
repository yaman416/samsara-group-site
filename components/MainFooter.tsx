// components/MainFooter.tsx
export default function MainFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-6 border-t border-white/20 bg-[#10273a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto grid gap-10 text-center sm:grid-cols-3 sm:gap-12 sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <p className="section-kicker text-[#f2cd84]">Stay connected</p>
            <h3 className="mt-2 font-display text-2xl text-white md:text-3xl">
              Join our SPL community
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/72">
              Follow fixtures, results, and Samsara Premier League announcements.
            </p>

            <a
              href="https://www.facebook.com/samsaragroupcbr"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[#f2cd84] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#10273a] shadow-sm transition hover:bg-[#f7d99c]"
            >
              Follow us on Facebook
            </a>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
              On this site
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/72">
              <li><a href="#about" className="hover:text-[#f2cd84]">About Us</a></li>
              <li><a href="#fixturesResults" className="hover:text-[#f2cd84]">Fixtures &amp; Results</a></li>
              <li><a href="#table" className="hover:text-[#f2cd84]">League Table</a></li>
              <li><a href="#downloads" className="hover:text-[#f2cd84]">Downloads</a></li>
              <li><a href="#sponsors" className="hover:text-[#f2cd84]">Sponsors</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
              Elsewhere
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/72">
              <li>
                <a
                  href="https://www.youtube.com/@SamsaraGroupCanberra"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#f2cd84]"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/samsaragroup.cbr/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#f2cd84]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@samsaragroupcanberra"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#f2cd84]"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/samsaragroupcbr"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#f2cd84]"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-8 border-t border-white/10"></div>

        <div className="space-y-2 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-white/60 md:text-xs">
            <a href="/terms" className="hover:text-[#f2cd84]">Terms &amp; Conditions</a>
            <a href="/privacy-policy" className="hover:text-[#f2cd84]">Privacy Policy</a>
            <a href="/disclaimer" className="hover:text-[#f2cd84]">Disclaimer</a>
            <a href="/contact" className="hover:text-[#f2cd84]">Contact Us</a>
          </div>
          <p className="text-[11px] text-white/45">
            © {year} Samsara Group Canberra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
