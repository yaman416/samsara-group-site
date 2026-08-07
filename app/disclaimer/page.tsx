import GoBackButton from "@/components/GoBackButton";
import { ORG } from "@/lib/splData";

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="shell-card px-6 py-8 sm:px-8">
        <h1 className="text-center text-3xl font-extrabold text-slate-900">Disclaimer</h1>
        <p className="mt-3 text-center text-sm text-slate-600">
          Last updated: {new Date().toLocaleDateString("en-AU")}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
          <p>
            The information on this website is published by {ORG.name} Canberra for general information about community sport, events, and related activities.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">General Information Only</h2>
          <p>
            Content on this website is provided for general informational purposes only. Fixtures, results, standings, event details, schedules, player information, and venue details may change and may not always reflect the latest updates immediately.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">No Professional Advice</h2>
          <p>
            Nothing on this website constitutes legal, financial, medical, employment, migration, or professional advice. You should seek independent advice where needed.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Volunteer-Managed Content</h2>
          <p>
            Many updates on this website are prepared or supplied by volunteers, organisers, contributors, or community members. While we make reasonable efforts to check information, we do not guarantee that all content is complete, current, or error-free.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Photos, Media, and External Material</h2>
          <p>
            Images, logos, sponsor names, social links, and external content may belong to their respective owners or contributors. Their appearance on this website does not imply a transfer of ownership or endorsement beyond the intended community or promotional context.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Advertising and External Services</h2>
          <p>
            This site may contain advertising, analytics tools, embedded content, or links to third-party services. We are not responsible for the accuracy, availability, or practices of those third parties.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Limitation of Responsibility</h2>
          <p>
            {ORG.name} Canberra is not responsible for any direct or indirect loss, inconvenience, or damage arising from use of this website, reliance on its content, or inability to access the site.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Contact and Corrections</h2>
          <p>
            If you identify incorrect information or want to request a correction, please contact us at <a href={`mailto:${ORG.email}`} className="font-medium text-slate-900 underline underline-offset-2">{ORG.email}</a>.
          </p>
        </div>
      </div>
      <GoBackButton />
    </div>
  );
}
