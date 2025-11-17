// components/MainFooter.tsx
import { ORG } from "@/lib/splData";

export default function MainFooter() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-4 md:grid-cols-3 text-xs md:text-sm text-gray-700">
        <div>
          <div className="font-semibold text-sm md:text-base">{ORG.name}</div>
          <div className="text-gray-500">{ORG.tagline}</div>
        </div>
        <div className="space-y-1">
          <p>
            Email:{" "}
            <a className="text-blue-600 underline" href={`mailto:${ORG.email}`}>
              {ORG.email}
            </a>
          </p>
          <p>Phone: {ORG.phone}</p>
          <p>
            Website:{" "}
            <a className="text-blue-600 underline" href={ORG.website}>
              {ORG.website}
            </a>
          </p>
        </div>
        <div className="space-y-1">
          <p>
            Facebook:{" "}
            <a className="text-blue-600 underline" href={ORG.facebook} target="_blank" rel="noreferrer">
              Visit page
            </a>
          </p>
          <p className="text-gray-500">
            © {new Date().getFullYear()} {ORG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
