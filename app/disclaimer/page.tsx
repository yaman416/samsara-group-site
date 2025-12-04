import GoBackButton from "@/components/GoBackButton";

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 text-center">
        Disclaimer
      </h1>

      <p className="mt-3 text-center text-sm text-slate-600">
        Last updated: {new Date().toLocaleDateString("en-AU")}
      </p>

      <div className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">

        <p>
          This website is operated by Samsara Group Canberra and provides community
          football information for the SBA Samsara Premier League.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">General Information</h2>
        <p>
          All match results, fixtures, statistics, and player information are provided
          by volunteers. While we aim to be accurate, we do not guarantee completeness
          or absolute accuracy.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">No Professional Advice</h2>
        <p>
          The content on this website is for general community interest and does not
          constitute professional advice.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">External Content</h2>
        <p>
          Any external links or media belong to their respective owners. We do not
          claim ownership or responsibility for external content.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">Errors or Updates</h2>
        <p>
          If you find incorrect or outdated information, please contact us so we can
          correct it promptly.
        </p>

        <p className="font-medium">Email: samsaragroup.cbr@gmail.com</p>

      </div>
      <GoBackButton />
    </div>
  );
}
