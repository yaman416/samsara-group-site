import GoBackButton from "@/components/GoBackButton";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-slate-900 text-center">
        Contact Us
      </h1>

      <p className="mt-3 text-center text-sm text-slate-600">
        We welcome enquiries from players, families, and community members.
      </p>

      <div className="mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">

        <h2 className="text-lg font-semibold text-slate-900">Email</h2>
        <p>samsaragroup.cbr@gmail.com</p>

        <h2 className="text-lg font-semibold text-slate-900">Location</h2>
        <p>Canberra, Australia</p>

        <h2 className="text-lg font-semibold text-slate-900">Community Support</h2>
        <p>
          Our team is volunteer led. We aim to respond to messages within 
          48 to 72 hours.
        </p>
      </div>
      <GoBackButton />
    </div>
  );
}
