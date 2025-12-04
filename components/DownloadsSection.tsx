// components/DownloadsSection.tsx
import { FileText } from "lucide-react";

const DOWNLOADS = [
  {
    title: "SPL Fixtures 2025 to 2026",
    description:
      "Full season schedule with match days, kick off times, and grounds.",
    href: "/files/Samsara-League-Fixtures.pdf",
    cta: "Download Fixtures (PDF)",
  },
  {
    title: "SPL Official Rulebook and Code of Conduct",
    description:
      "Competition rules, discipline process, and player conduct guidelines.",
    href: "/files/SPL Official Rulebook & Code of Conduct.pdf",
    cta: "Download Rulebook (PDF)",
  },
];

export default function DownloadsSection() {
  return (
    <section id="downloads" className="mt-10">
      <div className="rounded-3xl border bg-white px-4 py-7 shadow-sm sm:px-6 md:px-8">
        {/* Heading, similar style to sponsors */}
        <div className="text-center">
          <h2 className="inline-flex items-center justify-center gap-2 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            <FileText size={22} className="text-orange-600" />
            <span>Downloads</span>
          </h2>
          <p className="mt-2 text-xs md:text-sm text-gray-600 max-w-2xl mx-auto">
            Official Samsara Premier League documents for clubs, referees, team
            managers, and supporters.
          </p>
        </div>

        {/* Cards row, compact like sponsor slider but only two items */}
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:justify-center">
          {DOWNLOADS.map((d) => (
            <a
              key={d.title}
              href={d.href}
              download
              className="flex-1 min-w-[240px] max-w-sm rounded-2xl border bg-gray-50 px-4 py-4 text-center text-xs md:text-sm text-gray-800 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="mb-1 text-sm md:text-base font-semibold">
                {d.title}
              </h3>
              <p className="mb-3 text-[11px] md:text-xs text-gray-600 leading-snug">
                {d.description}
              </p>
              <span className="inline-flex items-center justify-center rounded-full bg-orange-600 px-4 py-1.5 text-[11px] font-medium text-white">
                {d.cta}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
