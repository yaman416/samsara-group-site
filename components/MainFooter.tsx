// components/MainFooter.tsx
import { ORG } from "@/lib/splData";

export default function MainFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6 md:space-y-0 md:grid md:grid-cols-4 text-xs md:text-sm text-gray-700">
        {/* Brand / Logo */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/samsara-logo-light.png"
              alt="Samsara Group logo"
              className="h-8 w-auto"
            />
          </div>
          <p/>
          <p className="text-[11px] md:text-xs text-gray-500 max-w-xs text-center md:text-left">
            Community led organisation in Canberra supporting
            communities through culture, <br/>sport, 
            and events.
          </p>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="font-semibold text-xs uppercase tracking-wide text-gray-500">
            Contact
          </p>
          <p>
            Email:{" "}
            <a
              className="text-blue-600 hover:text-blue-700 underline"
              href={`mailto:${ORG.email}`}
            >
              {ORG.email}
            </a>
          </p>
          <p>Phone: {ORG.phone}</p>
          <p>Location: {ORG.location}</p>
        </div>

        {/* Quick links */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="font-semibold text-xs uppercase tracking-wide text-gray-500">
            Quick links
          </p>
          <button
            onClick={() => document.getElementById("top")?.scrollIntoView({ behavior: "smooth" })}
            className="text-gray-700 hover:text-blue-700 text-left"
          >
            Home
          </button>
          <button
            onClick={() =>
              document.getElementById("table")?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-gray-700 hover:text-blue-700 text-left"
          >
            League Table
          </button>
          <button
            onClick={() =>
              document.getElementById("fixturesResults")?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-gray-700 hover:text-blue-700 text-left"
          >
            Fixtures and Results
          </button>
          <button
            onClick={() =>
              document.getElementById("sponsors")?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-gray-700 hover:text-blue-700 text-left"
          >
            Sponsors
          </button>
          <a
            href="/privacy-policy"
            className="mt-1 text-[11px] text-gray-500 hover:underline"
          >
            Privacy Policy
          </a>
        </div>

        {/* Social / Legal */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="font-semibold text-xs uppercase tracking-wide text-gray-500">
            Connect
          </p>
          <a
            href={ORG.facebook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-blue-600 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-600 hover:text-white transition"
          >
            {/* Simple Facebook icon using SVG */}
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
              f
            </span>
            <span>Follow on Facebook</span>
          </a>

          <p className="mt-2 text-[11px] text-gray-500 text-center md:text-left">
            © {year} {ORG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
