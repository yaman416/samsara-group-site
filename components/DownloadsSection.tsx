// components/DownloadsSection.tsx
import { FileText } from "lucide-react";
import { DOWNLOADS } from "@/lib/siteContent";

export default function DownloadsSection() {
  return (
    <section id="downloads" className="mt-10">
      <div className="shell-card px-4 py-7 sm:px-6 md:px-8">
        <div className="section-divider">
          <div className="min-w-0">
            <p className="section-kicker">Resources</p>
            <h2 className="mt-2 inline-flex max-w-full items-center gap-2 font-display text-3xl md:text-4xl">
              <FileText size={22} className="text-[#18212a]" />
              <span className="text-[#15202b]">Downloads</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#607181]">
              Official Samsara Premier League documents for clubs, referees, team managers, and
              supporters.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {DOWNLOADS.map((d) => (
            <a
              key={d.title}
              href={d.href}
              download
              className="surface-muted px-5 py-5 text-left text-sm shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg"
            >
              <span className="pill-label">
                {d.meta}
              </span>
              <h3 className="mb-2 mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#15202b]">{d.title}</h3>
              <p className="mb-4 text-sm leading-6 text-[#607181]">{d.description}</p>
              <span className="button-primary text-xs uppercase tracking-[0.14em]">
                {d.cta}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
