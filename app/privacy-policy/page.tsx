import FloatingNavbar from '@/components/FloatingNavbar';

export const metadata = {
  title: 'Privacy Policy | WombCare',
  description:
    'Read WombCare’s privacy policy to understand how we collect, use, protect, and retain your personal and health information.',
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
            Your privacy, data security, and transparent data practices are our top priorities at WombCare.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Effective Date: April 15, 2026 (Last Updated: July 30, 2026)
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 space-y-12">

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              1. Developer, Ownership & App Purpose
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                WombCare is owned, developed, and operated by <strong>Wombcare</strong> (&quot;Developer&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). 
              </p>
              <p>
                The primary purpose of WombCare is to function as a PCOD/PCOS lifestyle coaching and wellness platform. The application provides educational content, wellness habit tracking, menstrual cycle tracking, symptom logs, and personalized lifestyle coaching recommendations. 
              </p>
              <p>
                We are committed to full transparency regarding our identity, ownership, and the purpose of this application. We do not engage in misrepresentation or hide our origin, identity, or ownership.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              2. Information We Collect
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
                  <li>PMOS and PCOD/PCOS symptoms</li>
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
                This information helps us deliver personalized lifestyle coaching and program experiences.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 leading-relaxed">
              <li>Provide and personalize the WombCare PCOD/PCOS lifestyle coaching program</li>
              <li>Recommend diet and lifestyle improvements</li>
              <li>Improve our mobile application and web-based services</li>
              <li>Communicate program updates, reminders, and relevant health information</li>
              <li>Provide customer support</li>
              <li>Conduct internal research and metrics validation</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              4. Data Retention and Deletion Policy
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                We value your right to control your personal and health information. Our data retention and deletion practices are as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Retention Period:</strong> We retain your personal and health data only for as long as your WombCare account remains active or as required to provide you with coaching services.
                </li>
                <li>
                  <strong>Account Deletion:</strong> You can request the permanent deletion of your account and all associated data at any time. This can be done directly within the WombCare application by navigating to <strong>Profile &rarr; Delete Account</strong>, or by emailing us at <a href="mailto:support@wombcare.in" className="text-purple-600 hover:text-purple-700 underline font-semibold">support@wombcare.in</a>.
                </li>
                <li>
                  <strong>Purging and Anonymization:</strong> Once you initiate account deletion, we permanently delete or anonymize your profile info, email address, cycle tracking history, symptom logs, assessment answers, and AI chat history from our active databases within <strong>30 days</strong>.
                </li>
                <li>
                  <strong>Exceptions:</strong> We may temporarily retain limited technical or transactional logs if strictly necessary for legal compliance, fraud prevention, or security troubleshooting. Such retained data is securely isolated and never used for marketing or lifestyle coaching purposes.
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              5. Data Protection and Security
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              WombCare takes appropriate technical and organizational measures
              to protect your data.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Secure servers</li>
              <li>Encrypted communication (HTTPS / SSL/TLS)</li>
              <li>Restricted internal access to sensitive health data</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              However, while we strive to protect your information, no transmission system
              can guarantee complete security.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              6. Sharing of Information
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              WombCare does not sell, rent, or trade your personal or health data. We only share information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Verified healthcare professionals associated with your coaching plan</li>
              <li>Technology and server hosting partners that support our system infrastructure</li>
              <li>Legal authorities when mandatory under applicable law</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              All third-party partners are contractually required to maintain confidentiality and use data solely to support WombCare.
            </p>
          </div>

          <div className="bg-pink-50 border border-pink-100 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              7. Health Disclaimer
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare provides lifestyle guidance and educational content
              related to PCOD/PCOS and PMOS management. Our services are not a substitute
              for professional medical advice, clinical diagnosis, or medical treatment. 
              Users should always consult qualified healthcare professionals or doctors for medical needs.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              8. Cookies and Tracking
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Improve user experience</li>
              <li>Analyze web traffic</li>
              <li>Understand user preferences</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              Users can disable cookies through browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              9. Your Rights
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Access your personal and health information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of data (Right to be forgotten)</li>
              <li>Withdraw consent for data usage at any time</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              10. Children’s Privacy
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare services are intended for users 18 years and older. We
              do not knowingly collect personal information from minors.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-slate-600 leading-relaxed">
              WombCare may update this Privacy Policy periodically. Updates will
              be posted on our website. Users are encouraged to review this page
              regularly.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              12. Contact Us
            </h2>
            <p className="text-slate-600 leading-relaxed">
              <strong>WombCare Support Team</strong>
              <br />
              Developer/Owner: Wombcare
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