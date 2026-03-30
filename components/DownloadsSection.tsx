// components/DownloadsSection.tsx
import { FileText } from "lucide-react";
import { DOWNLOADS } from "@/lib/siteContent";

export default function DownloadsSection() {
  return (
    <section id="downloads" className="mt-10">
      <div className="shell-card px-4 py-7 sm:px-6 md:px-8">
        <div className="text-center">
          <p className="section-kicker">Resources</p>
          <h2 className="mt-2 inline-flex items-center justify-center gap-2 font-display text-3xl text-slate-900 md:text-4xl">
            <FileText size={22} className="text-[#8a6a35]" />
            <span>Downloads</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#526070]">
            Official Samsara Premier League documents for clubs, referees, team managers, and
            supporters.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:justify-center">
          {DOWNLOADS.map((d) => (
            <a
              key={d.title}
              href={d.href}
              download
              className="flex-1 min-w-[240px] max-w-sm rounded-[1.5rem] border border-[#14324a]/10 bg-[#fcfaf6] px-5 py-5 text-center text-sm text-[#1c2430] shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="inline-flex rounded-full bg-[#f2eadb] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a6a35]">
                {d.meta}
              </span>
              <h3 className="mb-2 font-display text-2xl leading-tight">{d.title}</h3>
              <p className="mb-4 text-sm leading-6 text-[#5a6776]">{d.description}</p>
              <span className="inline-flex items-center justify-center rounded-full bg-[#14324a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                {d.cta}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
