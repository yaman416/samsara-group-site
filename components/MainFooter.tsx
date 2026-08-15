// components/MainFooter.tsx
import Link from "next/link";
import { ORG } from "@/lib/splData";
import SubscribeForm from "@/components/SubscribeForm";

export default function MainFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="mt-8 px-4 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1340px]">
        <div className="shell-card px-5 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid gap-8 text-center sm:grid-cols-4 sm:gap-10 sm:text-left">
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#607181]">Stay connected</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#101820] md:text-3xl">
                Community sport and culture in Canberra
              </h3>
              <p className="mt-3 max-w-xs text-sm leading-7 text-[#607181]">
                Follow fixtures, results, cup announcements, and community events from Samsara Group Canberra.
              </p>

              <a
                href="https://www.facebook.com/samsaragroupcbr"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center justify-center rounded-full bg-[#18212a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition hover:bg-[#253240]"
              >
                Follow us on Facebook
              </a>

              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#607181]">Email updates</p>
              <p className="mt-1 text-xs text-[#607181]">Get fixture schedules and league news straight to your inbox.</p>
              <SubscribeForm />
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#607181]">
                On this site
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-[#607181]">
                <li><Link href="/#league" className="hover:text-[#15202b]">Premier League</Link></li>
                <li><Link href="/#fixturesResults" className="hover:text-[#15202b]">Season Hub</Link></li>
                <li><Link href="/#newYearCup" className="hover:text-[#15202b]">New Year Cup</Link></li>
                <li><Link href="/gallery" className="hover:text-[#15202b]">Gallery</Link></li>
                <li><Link href="/#more" className="hover:text-[#15202b]">Updates</Link></li>
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
      </div>
    </footer>
  );
}
