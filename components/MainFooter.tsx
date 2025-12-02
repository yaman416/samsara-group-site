// components/MainFooter.tsx
import { ORG } from "@/lib/splData";

export default function MainFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Top section */}
        <div className="grid gap-6 text-xs md:text-sm text-gray-700 md:grid-cols-4 md:items-start">
          {/* Brand / Logo */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-2">
              <img
                src="/samsara-logo-light.png"
                alt="Samsara Group logo"
                className="h-8 w-auto"
              />
            </div>
            <p className="max-w-xs text-center text-[11px] text-gray-500 md:text-left">
              Community led organisation in Canberra supporting Nepalese and
              Bhutanese communities through culture, sport, and events.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center gap-1 md:items-start">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Contact
            </p>
            <p>
              Email:{" "}
              <a
                className="text-blue-600 underline hover:text-blue-700"
                href={`mailto:${ORG.email}`}
              >
                {ORG.email}
              </a>
            </p>
            <p>Phone: {ORG.phone}</p>
            <p>Location: {ORG.location}</p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center gap-1 md:items-start">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Quick links
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("top")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-700 hover:text-blue-700 text-left"
            >
              Home
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("table")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-700 hover:text-blue-700 text-left"
            >
              League Table
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("fixturesResults")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-700 hover:text-blue-700 text-left"
            >
              Fixtures and Results
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("sponsors")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-700 hover:text-blue-700 text-left"
            >
              Sponsors
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("downloads")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-700 hover:text-blue-700 text-left"
            >
              Downloads
            </button>
            <a
              href="/privacy-policy"
              className="mt-1 text-[11px] text-gray-500 hover:underline"
            >
              Privacy Policy
            </a>
          </div>

          {/* Social / Legal */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Connect
            </p>
            <a
              href={ORG.facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-blue-600 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-600 hover:text-white"
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                f
              </span>
              <span>Follow on Facebook</span>
            </a>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t pt-4 text-center text-[11px] text-gray-500 md:text-xs">
          <p>
            © {year} {ORG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
