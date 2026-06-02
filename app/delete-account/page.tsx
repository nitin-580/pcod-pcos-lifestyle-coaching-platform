import FloatingNavbar from '@/components/FloatingNavbar';

export const metadata = {
  title: 'Delete Account | WombCare',
  description:
    'Read instructions on how to permanently delete your WombCare account and associated personal and health data.',
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-pink-100 selection:text-pink-900 pt-24">
      <FloatingNavbar />

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-pink-50 to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-6">
            Delete Your <span className="text-purple-600">Account</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            At WombCare, you have full control over your personal and health information.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          <div>
            <p className="text-lg text-slate-600 leading-relaxed">
              You can permanently delete your WombCare account and associated data at any time.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              How to delete your account from the WombCare app
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-slate-600 leading-relaxed">
              <li>Open the WombCare app.</li>
              <li>Login to your account.</li>
              <li>Go to Profile.</li>
              <li>Select &quot;Delete Account&quot;.</li>
              <li>Confirm your request.</li>
            </ol>
            <p className="text-slate-600 leading-relaxed mt-4">
              After confirmation, your account and associated data will be permanently deleted.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Data deleted
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              When you delete your account, WombCare deletes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 leading-relaxed">
              <li>Account profile information</li>
              <li>Email associated with your account</li>
              <li>Menstrual cycle history</li>
              <li>Period tracking information</li>
              <li>Symptoms and wellness information</li>
              <li>AI wellness conversation history</li>
              <li>Personal health preferences</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Data retention
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              After account deletion, your personal and health information is removed from our active systems.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Some limited information may be temporarily retained if required for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 leading-relaxed">
              <li>security purposes</li>
              <li>fraud prevention</li>
              <li>legal obligations</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-4">
              Such data will not be used for any other purpose.
            </p>
          </div>

          <div className="bg-pink-50 border border-pink-100 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Need help?
            </h2>
            <p className="text-slate-600 leading-relaxed">
              If you cannot access your account or need assistance deleting your data, contact us:
              <br />
              <a href="mailto:support@wombcare.in" className="text-purple-600 hover:text-purple-700 font-semibold underline mt-2 inline-block">
                support@wombcare.in
              </a>
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Application: WombCare
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
