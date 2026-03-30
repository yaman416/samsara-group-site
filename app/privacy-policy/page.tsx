import GoBackButton from "@/components/GoBackButton";
import { ORG } from "@/lib/splData";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="shell-card px-6 py-8 sm:px-8">
        <h1 className="text-center text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="mt-3 text-center text-sm text-slate-600">
          Last updated: {new Date().toLocaleDateString("en-AU")}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-700">
          <p>
            This Privacy Policy explains how {ORG.name} Canberra collects, uses, and protects information when you visit this website. This site provides information about community football, events, cultural activities, news, photos, and downloadable resources.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Who We Are</h2>
          <p>
            This website is operated by {ORG.name} Canberra in Australia. If you have any privacy questions, you can contact us at <a href={`mailto:${ORG.email}`} className="font-medium text-slate-900 underline underline-offset-2">{ORG.email}</a>.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Information We May Collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Information you choose to send to us by email or contact form, such as your name, team name, phone number, or email address.</li>
            <li>Basic technical information such as browser type, device type, IP address, pages visited, and referring pages.</li>
            <li>Cookie and usage information used to improve site functionality, measure traffic, and support advertising services.</li>
          </ul>

          <h2 className="text-lg font-semibold text-slate-900">How We Use Information</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>To respond to enquiries, registrations, volunteer requests, and community communications.</li>
            <li>To publish and maintain community information such as fixtures, results, announcements, and event updates.</li>
            <li>To maintain website security, monitor performance, and improve the visitor experience.</li>
            <li>To support advertising and analytics services where those services are enabled on the site.</li>
          </ul>

          <h2 className="text-lg font-semibold text-slate-900">Cookies and Advertising</h2>
          <p>
            This website may use cookies and similar technologies. Cookies help the site function properly, measure traffic, and support third-party advertising services including Google AdSense. Third-party vendors, including Google, may use cookies to serve ads based on a user&apos;s visit to this and other websites.
          </p>
          <p>
            Visitors can learn more about how Google uses information in advertising by visiting Google&apos;s advertising and privacy resources. You can also control cookies through your browser settings.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Third-Party Services</h2>
          <p>
            We may use trusted third-party services for hosting, analytics, embedded media, forms, or advertising. Those services may process limited technical or usage information according to their own privacy policies.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">External Links</h2>
          <p>
            This website may link to social media platforms, sponsors, partners, and other external websites. We are not responsible for the privacy practices or content of third-party websites.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Data Retention and Security</h2>
          <p>
            We only keep personal information for as long as reasonably necessary for community administration, event communication, record keeping, or legal purposes. We take reasonable steps to protect information from loss, misuse, and unauthorised access.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Your Choices</h2>
          <p>
            You may contact us at any time to request correction or removal of personal information you have provided directly, subject to any legal or administrative requirements that apply.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any updated version will be posted on this page with the revised date shown above.
          </p>

          <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
          <p>
            {ORG.name} Canberra
            <br />
            {ORG.location}
            <br />
            Email: <a href={`mailto:${ORG.email}`} className="font-medium text-slate-900 underline underline-offset-2">{ORG.email}</a>
          </p>
        </div>
      </div>
      <GoBackButton />
    </div>
  );
}
