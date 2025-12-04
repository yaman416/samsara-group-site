// components/MainFooter.tsx

export default function MainFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-4 border-t bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 lg:py-12">

        {/* TOP: Center entire block */}
        <div className="mx-auto grid gap-10 text-center sm:grid-cols-3 sm:gap-12 sm:text-left">

          {/* LEFT: CTA */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-base font-semibold text-slate-900 md:text-lg">
              Join our SPL community
            </h3>
            <p className="mt-2 text-xs text-slate-600 md:text-sm leading-relaxed max-w-xs">
              Follow fixtures, results, and Samsara Premier League announcements.
            </p>

            <a
              href="https://www.facebook.com/samsaragroupcbr"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-700"
            >
              Follow us on Facebook
            </a>
          </div>

          {/* MIDDLE: Site links */}
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Here
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600 md:text-sm">
              <li><a href="#about" className="hover:text-orange-600">About Us</a></li>
              <li><a href="#fixturesResults" className="hover:text-orange-600">Fixtures &amp; Results</a></li>
              <li><a href="#table" className="hover:text-orange-600">League Table</a></li>
              <li><a href="#downloads" className="hover:text-orange-600">Downloads</a></li>
              <li><a href="#sponsors" className="hover:text-orange-600">Sponsors</a></li>
            </ul>
          </div>

          {/* RIGHT: Social links */}
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              And there
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-600 md:text-sm">
              <li>
                <a
                  href="https://www.youtube.com/@SamsaraGroupCanberra"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-600"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/samsaragroup.cbr/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-600"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@samsaragroupcanberra"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-600"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/samsaragroupcbr"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-orange-600"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t"></div>

        {/* Bottom legal */}
        <div className="space-y-2 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-600 md:text-xs">
            <a href="/terms" className="hover:text-orange-600">Terms &amp; Conditions</a>
            <a href="/privacy-policy" className="hover:text-orange-600">Privacy Policy</a>
            <a href="/disclaimer" className="hover:text-orange-600">Disclaimer</a>
            <a href="/contact" className="hover:text-orange-600">Contact Us</a>
          </div>
          <p className="text-[11px] text-gray-500">
            © {year} Samsara Group Canberra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
