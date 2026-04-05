export default function PricingSection() {
    const plans = [
      {
        name: "Basic Plan",
        price: "₹999",
        duration: "/month",
        description: "Perfect for getting started with PCOD wellness.",
        features: [
          "Personalized diet suggestions",
          "Basic period tracker",
          "Weekly wellness tips",
          "Email support"
        ],
        highlighted: false
      },
      {
        name: "Premium Plan",
        price: "₹2999",
        duration: "/3 months",
        description: "Our most popular and recommended PCOD reversal program.",
        features: [
          "Custom PCOD lifestyle plan",
          "Nutrition + yoga guidance",
          "Hormonal health tracking",
          "1-on-1 coach consultation",
          "Priority support",
          "Exclusive webinars"
        ],
        highlighted: true
      },
      {
        name: "Conceive Plan",
        price: "₹4999",
        duration: "/3 months",
        description: "Designed for fertility support and conception wellness.",
        features: [
          "Fertility-focused nutrition plan",
          "Ovulation & cycle tracking",
          "Hormone wellness support",
          "Dedicated expert consultation",
          "Lifestyle coaching"
        ],
        highlighted: false
      }
    ];
  
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
                    ? "bg-white border-purple-200 shadow-2xl scale-105 relative"
                    : "bg-white border-slate-100 shadow-md hover:shadow-lg"
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
                    <li
                      key={idx}
                      className="text-slate-600 flex items-start gap-3"
                    >
                      <span className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
  
                <button
                  className={`w-full py-4 rounded-2xl font-semibold transition ${
                    plan.highlighted
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }