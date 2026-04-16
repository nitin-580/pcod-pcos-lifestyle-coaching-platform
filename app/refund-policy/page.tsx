import FloatingNavbar from '@/components/FloatingNavbar';

export const metadata = {
  title: 'Refund Policy | WombCare',
  description:
    'Read WombCare’s refund and cancellation policy for all wellness programs and services.',
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-pink-100 selection:text-pink-900 pt-24">
      <FloatingNavbar />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-pink-50 to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-6">
            Refund <span className="text-purple-600">Policy</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Transparent refund terms for all WombCare wellness programs and
            digital services.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Effective Date: April 15, 2026
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 space-y-12">

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              1. Program Fees
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare offers digital wellness programs, including the PCOD
              Reversal Program priced at <span className="font-semibold">₹2999 for 3 months</span>.
              All payments must be made through approved payment methods
              available on the WombCare platform.
            </p>
          </div>

          <div className="bg-pink-50 border border-pink-100 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              2. No Refund Policy
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Due to the nature of digital health and lifestyle programs,
              payments made for WombCare programs are generally
              <span className="font-semibold"> non-refundable </span>
              once the program has been accessed or started.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              This policy helps ensure fairness and maintain the integrity of
              our digital services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              3. Eligible Refund Cases
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Refunds may be considered under the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Duplicate payment made by the user</li>
              <li>Payment made but program access not provided</li>
              <li>Technical issues preventing access to the program</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              In such cases, users must contact WombCare support within
              <span className="font-semibold"> 7 days </span>
              of the payment date.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              4. Refund Process
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              To request a refund, users must email the support team with the
              following details:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Full Name</li>
              <li>Registered Email ID</li>
              <li>Payment Receipt or Transaction ID</li>
              <li>Reason for refund request</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              Email: <span className="font-medium">support@wombcare.in</span>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              5. Refund Approval
            </h2>
            <p className="text-slate-600 leading-relaxed">
              If the refund request is approved, the refund will be processed
              within <span className="font-semibold">7–10 business days</span>
              to the original payment method.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              Processing time may vary depending on the payment provider or bank.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              6. Program Cancellation
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Users may cancel their participation in the program at any time.
              However, cancellation does not guarantee a refund unless it falls
              under the eligible cases mentioned above.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              7. Changes to Refund Policy
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare reserves the right to update or modify this Refund Policy
              at any time. Changes will be posted on the WombCare website.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              8. Contact Us
            </h2>
            <p className="text-slate-600 leading-relaxed">
              <strong>WombCare Support Team</strong>
              <br />
              Email: support@wombcare.in
              <br />
              Phone: +91 90319 09188
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm border-t border-slate-800">
        <p>
          &copy; {new Date().getFullYear()} WombCare. All rights reserved.
        </p>
      </footer>
    </main>
  );
}