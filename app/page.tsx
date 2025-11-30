// app/page.tsx
import HomePage from "@/components/HomePage";
import LeagueTableSection from "@/components/LeagueTableSection";
import ResultsSection from "@/components/ResultsSection";

// ...

<section className="grid gap-4 md:grid-cols-2">
  <LeagueTableSection />
  <ResultsSection />
</section>


export default function Page() {
  return <HomePage />;
}
