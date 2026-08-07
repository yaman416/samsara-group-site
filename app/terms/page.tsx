import GoBackButton from "@/components/GoBackButton";
import { ORG } from "@/lib/splData";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="shell-card px-6 py-8 sm:px-8">
        <h1 className="text-center text-3xl font-extrabold text-slate-900">Terms and Conditions</h1>
        <p className="mt-3 text-center text-sm text-slate-600">
          Last updated: {new Date().toLocaleDateString("en-AU")}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
          <p>
            These Terms and Conditions govern your use of the {ORG.name} Canberra website. By accessing or using this site, you agree to these Terms.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Website Purpose</h2>
          <p>
            This website is provided to share information about community football competitions, fixtures, results, cultural events, announcements, sponsors, photos, and related activities coordinated or promoted by {ORG.name} Canberra.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Acceptable Use</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>You must use this website lawfully and respectfully.</li>
            <li>You must not misuse the website, interfere with its operation, or attempt unauthorised access to the site or its systems.</li>
            <li>You must not copy, scrape, republish, or exploit website content in a misleading, harmful, or commercial way without permission.</li>
          </ul>

          <h2 className="text-lg font-semibold text-slate-900">Content Accuracy</h2>
          <p>
            We aim to keep website content current and accurate. However, fixtures, results, standings, event details, venue information, registrations, and schedules may change without notice. All information is provided on a best-effort basis.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Intellectual Property</h2>
          <p>
            Unless otherwise stated, website content including text, layout, branding, graphics, and original media is owned by or used with permission by {ORG.name} Canberra. Third-party logos, sponsor names, and external media remain the property of their respective owners.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">External Links and Third-Party Services</h2>
          <p>
            This website may link to third-party websites, social media pages, sponsor pages, or services such as advertising and analytics platforms. We are not responsible for third-party content, availability, or policies.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Advertising</h2>
          <p>
            This site may display third-party advertising, including Google AdSense. Advertisements are served by external providers and may be tailored using cookies or usage data as described in our Privacy Policy.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, {ORG.name} Canberra is not liable for any loss, damage, delay, inconvenience, or reliance arising from use of this website or from any errors, omissions, interruptions, or outdated information published on it.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Changes to the Site or Terms</h2>
          <p>
            We may update this website and these Terms at any time. Continued use of the site after changes are posted means you accept the updated Terms.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Governing Contact</h2>
          <p>
            For questions about these Terms, contact {ORG.name} Canberra at <a href={`mailto:${ORG.email}`} className="font-medium text-slate-900 underline underline-offset-2">{ORG.email}</a>.
          </p>
        </div>
      </div>
      <GoBackButton />
    </div>
  );
}
