// components/MainFooter.tsx
import { ORG } from "@/lib/splData";

export default function MainFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="mt-10 border-t border-slate-200 bg-white text-[#15202b]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid gap-8 text-center sm:grid-cols-4 sm:gap-10 sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#607181]">Stay connected</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#15202b] md:text-3xl">
              Community sport and culture in Canberra
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-7 text-[#607181]">
              Follow fixtures, results, cup announcements, and community events from Samsara Group Canberra.
            </p>

            <a
              href="https://www.facebook.com/samsaragroupcbr"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[#d7222a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[#e13940]"
            >
              Follow us on Facebook
            </a>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#607181]">
              On this site
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-[#607181]">
              <li><a href="/#about" className="hover:text-[#15202b]">About Us</a></li>
              <li><a href="/#fixturesResults" className="hover:text-[#15202b]">Fixtures &amp; Results</a></li>
              <li><a href="/#fixturesResults" className="hover:text-[#15202b]">Season Hub</a></li>
              <li><a href="/gallery" className="hover:text-[#15202b]">Gallery</a></li>
              <li><a href="/#downloads" className="hover:text-[#15202b]">Downloads</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#607181]">
              Contact
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-[#607181]">
              <li>{ORG.location}</li>
              <li>
                <a href={`mailto:${ORG.email}`} className="hover:text-[#15202b]">
                  {ORG.email}
                </a>
              </li>
              <li>{ORG.phone}</li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#607181]">
              Elsewhere
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-[#607181]">
              <li>
                <a
                  href="https://www.youtube.com/@SamsaraGroupCanberra"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#15202b]"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/samsaragroup.cbr/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#15202b]"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@samsaragroupcanberra"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#15202b]"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/samsaragroupcbr"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#15202b]"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-7 border-t border-slate-200"></div>

        <div className="space-y-2 text-center">
          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-[#607181] md:text-xs">
            <a href="/terms" className="hover:text-[#15202b]">Terms &amp; Conditions</a>
            <a href="/privacy-policy" className="hover:text-[#15202b]">Privacy Policy</a>
            <a href="/disclaimer" className="hover:text-[#15202b]">Disclaimer</a>
            <a href="/contact" className="hover:text-[#15202b]">Contact Us</a>
          </div>
          <p className="text-[11px] text-[#607181]">
            © {year} Samsara Group Canberra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
