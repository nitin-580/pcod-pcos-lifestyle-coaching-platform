import FloatingNavbar from '@/components/FloatingNavbar';

export const metadata = {
  title: 'Privacy Policy | WombCare',
  description:
    'Read WombCare’s privacy policy to understand how we collect, use, and protect your personal and health information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-pink-100 selection:text-pink-900 pt-24">
      <FloatingNavbar />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-pink-50 to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-6">
            Privacy <span className="text-purple-600">Policy</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Your privacy and health data security are our top priorities at
            WombCare.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Effective Date: April 15, 2026
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 space-y-12">

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                When you use WombCare services, we may collect the following
                information:
              </p>

              <div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Personal Information
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Age and gender</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Health Information
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>PCOD/PCOS symptoms</li>
                  <li>Menstrual cycle details</li>
                  <li>Diet and lifestyle habits</li>
                  <li>Health assessment responses</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Technical Information
                </h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Device information</li>
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Website usage data</li>
                </ul>
              </div>

              <p>
                This information helps us deliver personalized health programs.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 leading-relaxed">
              <li>Provide the WombCare PCOD reversal program</li>
              <li>Personalize diet and lifestyle recommendations</li>
              <li>Improve our services and digital tools</li>
              <li>Communicate program updates and health information</li>
              <li>Provide customer support</li>
              <li>Conduct internal research and analytics</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              3. Data Protection and Security
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              WombCare takes appropriate technical and organizational measures
              to protect your data.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Secure servers</li>
              <li>Encrypted communication</li>
              <li>Restricted data access</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              However, while we strive to protect your information, no system
              can guarantee complete security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              4. Sharing of Information
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              WombCare does not sell your personal data.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Healthcare professionals involved in the program</li>
              <li>Technology partners that support our platform</li>
              <li>Legal authorities if required by law</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              All third-party partners are required to maintain confidentiality.
            </p>
          </div>

          <div className="bg-pink-50 border border-pink-100 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              5. Health Disclaimer
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare provides lifestyle guidance and educational content
              related to PCOD/PCOS management. Our services are not a substitute
              for professional medical diagnosis or treatment. Users should
              consult qualified healthcare professionals for medical advice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              6. Cookies and Tracking
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Improve user experience</li>
              <li>Analyze website traffic</li>
              <li>Understand user preferences</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              Users can disable cookies through browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              7. Your Rights
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Access personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of data</li>
              <li>Withdraw consent for data usage</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              8. Children’s Privacy
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare services are intended for users 18 years and older. We
              do not knowingly collect personal information from minors.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare may update this Privacy Policy periodically. Updates will
              be posted on our website. Users are encouraged to review this page
              regularly.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              10. Contact Us
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