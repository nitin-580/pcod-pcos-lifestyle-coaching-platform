import FloatingNavbar from '@/components/FloatingNavbar';

export const metadata = {
  title: 'Terms & Conditions | WombCare',
  description:
    'Read the terms and conditions for using WombCare wellness programs and digital services.',
};

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-pink-100 selection:text-pink-900 pt-24">
      <FloatingNavbar />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-pink-50 to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-6">
            Terms & <span className="text-purple-600">Conditions</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Please read these terms carefully before using WombCare services and
            wellness programs.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Effective Date: 01/05/2026
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 space-y-12">

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              1. About WombCare
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare is a digital wellness platform that provides lifestyle
              guidance and educational programs related to PCOD/PCOS management,
              including nutrition guidance, yoga sessions, health tracking
              tools, and lifestyle coaching.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              WombCare services are intended for educational and wellness
              purposes only.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              2. Eligibility
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>You must be at least 18 years old</li>
              <li>Users below 18 require parental consent</li>
              <li>You must provide accurate and truthful information</li>
              <li>You must comply with these terms</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              WombCare reserves the right to suspend or terminate accounts that
              provide false information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              3. Services Provided
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>PCOD assessment questionnaires</li>
              <li>Nutrition and lifestyle plans</li>
              <li>Yoga and wellness guidance</li>
              <li>Diet, period, and water trackers</li>
              <li>Hormonal health educational content</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              Services may be updated or modified at any time.
            </p>
          </div>

          <div className="bg-pink-50 border border-pink-100 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              4. Medical Disclaimer
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare does not provide medical diagnosis, treatment, or
              prescription services.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              The information provided through WombCare programs is for general
              wellness and educational purposes only.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              Users should consult qualified healthcare professionals before
              making medical decisions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              5. Payments and Fees
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Certain WombCare services require payment.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 mt-4">
              <li>PCOD Reversal Program – ₹2999 for 3 months</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              WombCare reserves the right to change pricing at any time.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              6. Refund Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Payments are generally non-refundable</li>
              <li>Refunds may be issued in exceptional circumstances</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              7. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Provide accurate health information</li>
              <li>Use services lawfully</li>
              <li>Not disrupt platform operations</li>
              <li>Keep login credentials confidential</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              8. Intellectual Property
            </h2>
            <p className="text-slate-600 leading-relaxed">
              All content including program materials, graphics, logos, and
              educational content is the intellectual property of WombCare.
            </p>
            <p className="text-slate-600 leading-relaxed mt-4">
              Reproduction or distribution without written permission is
              prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              9. Limitation of Liability
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Health outcomes resulting from program use</li>
              <li>Reliance on educational content</li>
              <li>Service interruptions or technical issues</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              Users participate at their own responsibility.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              10. Data Protection
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare collects and processes user information according to its
              Privacy Policy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              11. Termination of Services
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare may suspend or terminate access if terms are violated or
              fraudulent activity is detected.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare may update these terms at any time and notify users of
              significant changes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              13. Governing Law
            </h2>
            <p className="text-slate-600 leading-relaxed">
              These terms are governed by the laws of India and fall under the
              jurisdiction of Indian courts.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              14. Contact Information
            </h2>
            <p className="text-slate-600 leading-relaxed">
              <strong>WombCare Support Team</strong>
              <br />
              Email: support@wombcare.in
              <br />
              Phone: [Insert Contact Number]
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