import GoBackButton from "@/components/GoBackButton";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 text-center">
        Terms and Conditions
      </h1>

      <p className="mt-3 text-center text-sm text-slate-600">
        Last updated: {new Date().toLocaleDateString("en-AU")}
      </p>

      <div className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">

        <p>
          These Terms and Conditions govern your use of the SBA Samsara Premier
          League website, operated by Samsara Group Canberra. By continuing to
          use this website, you agree to comply with these terms.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">Use of Website</h2>
        <p>
          You must use this website responsibly and must not engage in any
          activity that may cause damage, interruptions, or misuse of content.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">Accuracy of Information</h2>
        <p>
          All fixtures, results, and match information are provided on a best-effort basis by
          volunteer coordinators. We aim for accuracy but cannot guarantee all details will be
          error-free or updated instantly.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">External Links</h2>
        <p>
          We may link to external sites for convenience. We do not control these sites and are
          not responsible for their content or policies.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">Limitation of Liability</h2>
        <p>
          Samsara Group Canberra is not responsible for any loss, damage, or inconvenience caused
          through the use of this website or the information provided.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Updated versions will always be posted on
          this page.
        </p>

        <h2 className="text-lg font-semibold text-slate-900">Contact Us</h2>
        <p>
          For questions regarding these Terms, contact:
        </p>

        <p className="font-medium">Email: samsaragroup.cbr@gmail.com</p>

      </div>
      <GoBackButton />
    </div>
  );
}
