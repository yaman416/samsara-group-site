// components/DownloadsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DownloadsSection() {
  return (
    <section id="downloads" className="mt-10 space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
        Downloads
      </h2>

      <Card className="rounded-2xl border bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm md:text-base">
            Official SPL Documents
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2 text-sm text-gray-700">
          
          {/* Fixtures file */}
          <div className="rounded-2xl border p-5 bg-gray-50 space-y-3">
            <h3 className="text-base font-semibold">SPL Fixtures 2025 to 2026</h3>
            <p className="text-xs md:text-sm text-gray-600">
              Full season schedule including match days, times, and grounds.
            </p>
            <a
              href="/files/Samsara-League-Fixtures.pdf"
              download
              className="inline-flex items-center justify-center rounded-full bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-700"
            >
              Download Fixtures (PDF)
            </a>
          </div>

          {/* Rulebook file */}
          <div className="rounded-2xl border p-5 bg-gray-50 space-y-3">
            <h3 className="text-base font-semibold">SPL Official Rulebook and Code of Conduct</h3>
            <p className="text-xs md:text-sm text-gray-600">
              Rules, competition format, player conduct, and discipline guidelines.
            </p>
            <a
              href="/files/SPL Official Rulebook & Code of Conduct.pdf"
              download
              className="inline-flex items-center justify-center rounded-full bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-700"
            >
              Download Rulebook (PDF)
            </a>
          </div>

        </CardContent>
      </Card>
    </section>
  );
}
