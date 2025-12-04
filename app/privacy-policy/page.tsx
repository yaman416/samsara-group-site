import GoBackButton from "@/components/GoBackButton";

// app/privacy-policy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 text-center">
        Privacy Policy
      </h1>

      <p className="mt-3 text-center text-sm text-slate-600">
        Last updated: {new Date().toLocaleDateString("en-AU")}
      </p>

      <div className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        
        <p>
          This Privacy Policy explains how the SBA Samsara Premier League website, 
          managed by Samsara Group Canberra, collects, uses, and protects personal 
          information. We are committed to ensuring your privacy is protected when 
          using this website.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">Information We Collect</h2>
        <p>We may collect the following information:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Basic contact information such as name and email (only if you contact us directly)</li>
          <li>Non-identifiable data such as browser type, device type, and pages visited</li>
          <li>Information provided voluntarily through forms or email submissions</li>
        </ul>

        <h2 className="text-lg font-semibold text-slate-900">How We Use Information</h2>
        <p>Information collected may be used for:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Responding to enquiries or support requests</li>
          <li>Improving website performance and user experience</li>
          <li>Ensuring website security and preventing misuse</li>
          <li>Displaying community football information such as fixtures, results, and updates</li>
        </ul>

        <h2 className="text-lg font-semibold text-slate-900">Use of Cookies</h2>
        <p>
          This website may use cookies to improve functionality and analyse usage. 
          These cookies do not store personal information and you can disable them 
          in your browser settings if preferred.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">Third-Party Services</h2>
        <p>
          We may use third-party services such as Google Analytics or Google AdSense. 
          These services may collect non-personal usage data for ad delivery and analytics. 
          We do not control how third-party providers use this information.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">Data Protection</h2>
        <p>
          We do not sell or share personal information with external parties. 
          Any data collected is used only for legitimate website and community purposes.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">External Links</h2>
        <p>
          Our website may contain links to external pages. We are not responsible for 
          the privacy policies or content of those websites.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">Your Consent</h2>
        <p>
          By using this website, you consent to this Privacy Policy. If you do not 
          agree with any part, please discontinue use of the website.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">Contact Us</h2>
        <p>
          If you have any questions regarding this Privacy Policy, please contact us at:
        </p>
        <p className="font-medium">
          Email: samsaragroup.cbr@gmail.com
        </p>
      </div>
      <GoBackButton />
    </div>
  );
}

