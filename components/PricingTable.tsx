"use client";

import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function PricingTable() {
  const plans = [
    {
      name: 'Basic Plan',
      price: '₹999',
      numericPrice: 999,
      duration: '/month',
      description: 'Perfect for getting started with PCOD wellness.',
      features: [
        'Personalized diet suggestions',
        'Basic period tracker',
        'Weekly wellness tips',
        'Email support',
      ],
      highlighted: false,
    },
    {
      name: 'Premium Plan',
      price: '₹2999',
      numericPrice: 2999,
      duration: '/3 months',
      description: 'Our most popular and recommended PCOD reversal program.',
      features: [
        'Custom PCOD lifestyle plan',
        'Nutrition + yoga guidance',
        'Hormonal health tracking',
        '1-on-1 coach consultation',
        'Priority support',
        'Exclusive webinars',
      ],
      highlighted: true,
    },
    {
      name: 'Conceive Plan',
      price: '₹4999',
      numericPrice: 4999,
      duration: '/3 months',
      description: 'Designed for fertility support and conception wellness.',
      features: [
        'Fertility-focused nutrition plan',
        'Ovulation & cycle tracking',
        'Hormone wellness support',
        'Dedicated expert consultation',
        'Lifestyle coaching',
      ],
      highlighted: false,
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Helper to load Razorpay Checkout Script
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

  const initiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile) {
      setErrorMessage('Please fill in all details.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMessage('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // 2. Call backend proxy to create order
      const orderRes = await fetch('/api/public-proxy/payment/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlan.numericPrice,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          planName: selectedPlan.name,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order.');
      }

      // 3. Configure Razorpay Options
      const options = {
        key: orderData.razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'WombCare',
        description: `Enrollment - ${selectedPlan.name}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            setLoading(true);
            // 4. Verify payment on backend
            const verifyRes = await fetch('/api/public-proxy/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                email: formData.email,
                name: formData.name,
                mobile: formData.mobile,
                planName: selectedPlan.name,
                amount: orderData.totalAmount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setPaymentSuccess(true);
            } else {
              setErrorMessage(verifyData.message || 'Payment verification failed.');
            }
          } catch (err: any) {
            setErrorMessage(err.message || 'Error during payment verification.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: '#9333ea', // Solid purple color matching WombCare
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during payment setup.');
      setLoading(false);
    }
  };

  const basePrice = selectedPlan ? selectedPlan.numericPrice : 0;
  const gstAmount = Number((basePrice * 0.18).toFixed(2));
  const totalPrice = Number((basePrice + gstAmount).toFixed(2));

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Choose Your <span className="text-purple-600">Wellness Plan</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start your journey towards hormonal balance, PCOD reversal, and
            complete womb wellness.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 transition-all duration-300 border ${
                plan.highlighted
                  ? 'bg-white border-purple-200 shadow-2xl scale-105 relative'
                  : 'bg-white border-slate-100 shadow-md hover:shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">
                {plan.name}
              </h3>

              <div className="text-center mb-6">
                <span className="text-5xl font-bold text-slate-900">
                  {plan.price}
                </span>
                <span className="text-slate-500 ml-1">{plan.duration}</span>
              </div>

              <p className="text-slate-600 text-center mb-8">
                {plan.description}
              </p>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-slate-600 flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setSelectedPlan(plan);
                  setFormData({ name: '', email: '', mobile: '' });
                  setPaymentSuccess(false);
                  setErrorMessage('');
                }}
                className={`w-full block text-center py-4 rounded-2xl font-semibold cursor-pointer transition ${
                  plan.highlighted
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Checkout</h3>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              {!paymentSuccess ? (
                <form onSubmit={initiatePayment} className="space-y-5">
                  <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100/30">
                    <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Selected Plan</p>
                    <div className="flex justify-between items-baseline mt-1">
                      <span className="font-bold text-slate-800 text-lg">{selectedPlan.name}</span>
                      <span className="text-xs text-slate-500">{selectedPlan.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
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

                  {/* GST Calculation & Invoice */}
                  <div className="border-t border-slate-100 pt-4 space-y-2.5">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Base Plan Price</span>
                      <span>₹{basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>GST (18%)</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-2.5">
                      <span>Total Amount</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Pay ₹{totalPrice.toFixed(2)} Now</span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-6">
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
                  
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-slate-900">Thank You, {formData.name}! ✨</h4>
                    <p className="text-sm text-slate-500">Your subscription to {selectedPlan.name} is now active.</p>
                  </div>

                  <div className="bg-purple-50 border border-purple-100/50 rounded-2xl p-4 text-purple-700 font-semibold text-sm max-w-xs mx-auto">
                    Login details will be sent to you shortly.
                  </div>

                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    A payment confirmation email has been sent to {formData.email}. We are setting up your access dashboard now.
                  </p>

                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full transition cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
}