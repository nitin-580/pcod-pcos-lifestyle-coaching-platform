import FloatingNavbar from '@/components/FloatingNavbar';
import Footer from '@/components/Footer';
import { Plus, Minus } from 'lucide-react';

export const metadata = {
  title: 'Frequently Asked Questions | WombCare',
  description: 'Everything you need to know about WombCare, PCOD management, and our wellness programs.',
};

const faqs = [
  {
    question: "What is WombCare?",
    answer: "WombCare is India's most trusted digital wellness platform dedicated to helping women manage and reverse PCOD/PCOS through personalized lifestyle coaching, nutrition, and yoga."
  },
  {
    question: "How does the 3-month PCOD reversal program work?",
    answer: "Our program is built on four pillars: Science-backed nutrition, Hormonal yoga, Lifestyle coaching, and Health tracking. You'll get a personalized plan tailored to your symptoms and body type."
  },
  {
    question: "Is this a substitute for medical treatment?",
    answer: "WombCare provides lifestyle and wellness guidance. While our methods are science-backed, they are meant to complement, not replace, professional medical advice or prescriptions."
  },
  {
    question: "Can I join if I'm already taking medication?",
    answer: "Yes, many of our members use WombCare alongside their clinical treatments. Our lifestyle changes often help medications work more effectively by improving overall systemic health."
  },
  {
    question: "What happens after I sign up for Early Access?",
    answer: "Once you sign up, you'll receive a confirmation email. When a spot opens up, our health coach will contact you for an initial assessment to understand your goals."
  }
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans flex flex-col pt-24">
      <FloatingNavbar />
      
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 tracking-tight mb-6">
                Common <span className="text-pink-500">Queries</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                Everything you need to know about starting your journey with WombCare.
            </p>
        </div>
      </section>

      <section className="py-24 flex-1">
        <div className="max-w-3xl mx-auto px-6 space-y-4">
            {faqs.map((faq, i) => (
                <details key={i} className="group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <summary className="flex items-center justify-between p-6 md:p-8 cursor-pointer list-none">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                            {faq.question}
                        </h3>
                        <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-open:rotate-180 transition-transform">
                            <Plus className="w-5 h-5 group-open:hidden" />
                            <Minus className="w-5 h-5 hidden group-open:block" />
                        </div>
                    </summary>
                    <div className="px-6 md:px-8 pb-8 text-slate-600 leading-relaxed">
                        {faq.answer}
                    </div>
                </details>
            ))}
        </div>
      </section>

      <section className="py-24 bg-pink-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Still have questions?</h3>
            <p className="text-slate-600 mb-8">Our support team is here to help you 24/7.</p>
            <a href="mailto:support@wombcare.in" className="inline-block px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-xl hover:-translate-y-1 transition-all">
                Email Support Team
            </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
