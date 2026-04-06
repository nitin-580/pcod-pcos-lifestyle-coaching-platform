import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Womb<span className="text-pink-500">Care</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Your trusted wellness platform for PCOD, PCOS, hormonal balance,
              cycle tracking, fertility support, and complete women’s health.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-3 text-sm">
              <Link
                href="/"
                className="block hover:text-pink-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/what-we-do"
                className="block hover:text-pink-400 transition-colors"
              >
                What We Do
              </Link>
              <Link
                href="/pricing"
                className="block hover:text-pink-400 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="block hover:text-pink-400 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <div className="space-y-3 text-sm">
              <Link
                href="/privacy-policy"
                className="block hover:text-pink-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund-policy"
                className="block hover:text-pink-400 transition-colors"
              >
                Refund Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                className="block hover:text-pink-400 transition-colors"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <p>
                Email:{" "}
                <a
                  href="mailto:support@wombcare.in"
                  className="hover:text-pink-400 transition-colors"
                >
                  support@wombcare.in
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+91 90319 09188"
                  className="hover:text-pink-400 transition-colors"
                >
                  +91 90319 09188
                </a>
              </p>
              <p>Available Mon – Sat, 9 AM – 7 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} WombCare. All rights reserved.
          </p>
          <p>Built with care for women’s wellness 🌸</p>
        </div>
      </div>
    </footer>
  );
}
