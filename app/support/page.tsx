import FloatingNavbar from '@/components/FloatingNavbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'WombCare Support | Help, Account, & Tracking Assistance',
  description:
    'Need help with the WombCare app? Read common support topics about account settings, cycle tracking, app usage, or contact our support team at support@wombcare.in.',
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-pink-100 selection:text-pink-900 flex flex-col pt-24">
      <FloatingNavbar />

      <div className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden bg-white">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-pink-50 to-transparent opacity-60 pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-6">
              WombCare <span className="text-pink-500">Support</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Welcome to WombCare Support. We are here to help you with any questions, technical issues, account problems, or feedback related to the WombCare app.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p className="text-lg">
                WombCare helps women track their menstrual cycle, understand wellness patterns, monitor mood and lifestyle habits, and access personalized health insights.
              </p>
              
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100/80 space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">For assistance, contact us:</h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Email Support</span>
                    <a href="mailto:support@wombcare.in" className="text-lg font-bold text-pink-500 hover:text-pink-600 transition-colors">
                      support@wombcare.in
                    </a>
                  </div>
                  <div className="text-sm text-slate-500">
                    Our team will respond to your request as soon as possible.
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Common Support Topics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 text-xl font-bold mb-4 font-sans">👤</div>
                    <h3 className="font-semibold text-slate-800 mb-2">Account and profile help</h3>
                    <p className="text-sm text-slate-500">Need help creating your account, editing your profile details, logging in, or resetting passwords?</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 text-xl font-bold mb-4 font-sans">📱</div>
                    <h3 className="font-semibold text-slate-800 mb-2">App usage questions</h3>
                    <p className="text-sm text-slate-500">Get guidance on navigating the app features, reading health analytics, or accessing your metrics history.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-xl font-bold mb-4 font-sans">🩸</div>
                    <h3 className="font-semibold text-slate-800 mb-2">Cycle and wellness tracking support</h3>
                    <p className="text-sm text-slate-500">Learn how to track periods, log symptoms, record wellness stats like water, mood, or sleep, and review cycle logs.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-xl font-bold mb-4 font-sans">🐛</div>
                    <h3 className="font-semibold text-slate-800 mb-2">Technical issues and bug reports</h3>
                    <p className="text-sm text-slate-500">Experiencing a glitch, unexpected behavior, or a crash? Submit a report so our engineering team can fix it.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 text-xl font-bold mb-4 font-sans">💡</div>
                    <h3 className="font-semibold text-slate-800 mb-2">Feedback and suggestions</h3>
                    <p className="text-sm text-slate-500">Have suggestions for new features, program enhancements, or overall usability? We are eager to hear your feedback.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 text-center border border-pink-100/50 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Thank you for using WombCare.</h3>
              <p className="text-sm text-slate-600">We appreciate you trusting us with your health and wellness journey.</p>
            </div>

          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
