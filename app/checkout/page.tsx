"use client";

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, ShieldCheck, MailCheck } from 'lucide-react';
import FloatingNavbar from '@/components/FloatingNavbar';
import Footer from '@/components/Footer';

const PLANS = {
  basic: {
    name: 'Basic Plan',
    price: 999,
    duration: '/month',
    description: 'Perfect for getting started with PCOD wellness.',
    features: [
      'Personalized diet suggestions',
      'Basic period tracker',
      'Weekly wellness tips',
      'Email support',
    ]
  },
  premium: {
    name: 'Premium Plan',
    price: 2999,
    duration: '/3 months',
    description: 'Our most popular and recommended PCOD reversal program.',
    features: [
      'Custom PCOD lifestyle plan',
      'Nutrition + yoga guidance',
      'Hormonal health tracking',
      '1-on-1 coach consultation',
      'Priority support',
      'Exclusive webinars',
    ]
  },
  conceive: {
    name: 'Conceive Plan',
    price: 4999,
    duration: '/3 months',
    description: 'Designed for fertility support and conception wellness.',
    features: [
      'Fertility-focused nutrition plan',
      'Ovulation & cycle tracking',
      'Hormone wellness support',
      'Dedicated expert consultation',
      'Lifestyle coaching',
    ]
  }
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planKey = (searchParams.get('plan') || 'premium').toLowerCase();
  const selectedPlan = PLANS[planKey as keyof typeof PLANS] || PLANS.premium;

  const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const basePrice = selectedPlan.price;
  const gstAmount = Number((basePrice * 0.18).toFixed(2));
  const totalPrice = Number((basePrice + gstAmount).toFixed(2));

  // Helper to load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // 1. Load script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please verify your connection.');
      }

      // 2. Create order on backend
      const response = await fetch('/api/public-proxy/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: basePrice,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          planName: selectedPlan.name
        })
      });

      const orderData = await response.json();
      if (!response.ok || !orderData.success) {
        throw new Error(orderData.message || 'Error occurred while establishing transaction.');
      }

      // 3. Trigger Razorpay checkout
      const options = {
        key: orderData.razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'WombCare',
        description: `Enrollment - ${selectedPlan.name}`,
        order_id: orderData.order.id,
        handler: async function (paymentResponse: any) {
          try {
            setLoading(true);
            // 4. Verify payment
            const verifyRes = await fetch('/api/public-proxy/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                email: formData.email,
                name: formData.name,
                mobile: formData.mobile,
                planName: selectedPlan.name,
                amount: orderData.totalAmount
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setPaymentSuccess(true);
            } else {
              setErrorMessage(verifyData.message || 'Signature verification failed.');
            }
          } catch (err: any) {
            setErrorMessage(err.message || 'Error occurred during payment confirmation.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile
        },
        theme: {
          color: '#9333ea' // Solid purple theme color
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing error.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
      
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-purple-600 transition mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Plans
      </button>

      {!paymentSuccess ? (
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Area (Left) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">Secure Checkout</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 mb-4 tracking-tight">
                Complete Your Enrollment
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                Please enter your details below. Your transaction is encrypted and secured by Razorpay.
              </p>
            </div>

            <form onSubmit={handlePayment} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-purple-50/20 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4">Personal Details</h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-800 bg-slate-50 focus:bg-white transition"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="yourname@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-800 bg-slate-50 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mobile Number</label>
                    <input 
                      type="tel" 
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-800 bg-slate-50 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Secure 256-bit SSL encrypted checkout</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <span>Pay ₹{totalPrice.toFixed(2)} Now</span>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Pricing Invoice Summary (Right) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-purple-50/20 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4">Order Summary</h3>

              <div className="space-y-4">
                <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100/30">
                  <h4 className="font-extrabold text-slate-800 text-lg">{selectedPlan.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{selectedPlan.description}</p>
                </div>

                <ul className="space-y-3 pl-1">
                  {selectedPlan.features.map((feat, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Calculations */}
                <div className="border-t border-slate-100 pt-6 space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-100 pt-4">
                    <span>Grand Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Success screen */
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-12 max-w-2xl mx-auto text-center space-y-8 my-10">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-600">Payment Confirmed</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Thank You, {formData.name}! ✨</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Your subscription to the **{selectedPlan.name}** has been processed successfully. We've verified your transaction.
            </p>
          </div>

          <div className="bg-purple-600 text-white rounded-2xl p-5 font-bold text-base max-w-sm mx-auto shadow-md">
            Login details will be sent to you shortly.
          </div>

          <div className="border-t border-slate-50 pt-8 max-w-md mx-auto space-y-4 text-xs text-slate-400 leading-relaxed">
            <div className="flex justify-center items-center gap-2">
              <MailCheck className="w-4 h-4 text-purple-500" />
              <span>A payment invoice was dispatched to <strong>{formData.email}</strong>.</span>
            </div>
            <p>
              Our automated credential generator is setting up your secure dashboard access profile. Check your inbox and spam folder in 2-5 minutes for your sign-in link and passcode.
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full transition-all shadow hover:shadow-lg cursor-pointer"
          >
            Return to WombCare Homepage
          </button>
        </div>
      )}

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-pink-100 selection:text-pink-900">
      <FloatingNavbar />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600 mx-auto" />
            <p className="text-sm text-slate-500 font-medium">Loading secure checkout environment...</p>
          </div>
        </div>
      }>
        <CheckoutContent />
      </Suspense>

      <Footer />
    </main>
  );
}
