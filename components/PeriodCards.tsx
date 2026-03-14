import React from "react";
import { Scan, CreditCard, ArrowRight } from "lucide-react";

export default function PeriodCards() {
  return (
    <section className="bg-white py-24 font-sans">
      <div className="max-w-7xl mx-auto px-6">

        {/* Horizontal Scroll Container */}
        <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6">

          {/* Card */}
          <Card
            icon={<Scan className="w-6 h-6 stroke-[1.5]" />}
            tag="Track & Analyze"
            title="Decode your monthly cycle."
            image="https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=800&auto=format&fit=crop"
          />

          <Card
            icon={<Scan className="w-6 h-6 stroke-[1.5]" />}
            tag="Hormone Insights"
            title="Understand hormonal shifts."
            image="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800&auto=format&fit=crop"
          />

          <Card
            icon={<Scan className="w-6 h-6 stroke-[1.5]" />}
            tag="Lifestyle"
            title="Balance sleep and nutrition."
            image="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=800&auto=format&fit=crop"
          />

          <Card
            icon={<CreditCard className="w-6 h-6 stroke-[1.5]" />}
            tag="Personalized Care"
            title="PCOD care on your terms."
            image="https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=800&auto=format&fit=crop"
            purple
          />

        </div>
      </div>
    </section>
  );
}

type CardProps = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  image: string;
  purple?: boolean;
};

function Card({ icon, tag, title, image, purple = false }: CardProps) {
  return (
    <div className="snap-start flex-shrink-0 w-[380px] relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden min-h-[520px] flex flex-col pt-12 px-10 group">

      {/* Header */}
      <div className="flex items-center gap-3 text-white/70 mb-6 z-20">
        {icon}
        <span className="text-xs tracking-[0.2em] font-medium uppercase font-mono">
          {tag}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[2.4rem] font-bold text-white leading-[1.1] mb-8 tracking-tight whitespace-pre-line">
        {title}
      </h3>

      {/* Button */}
      <button className="flex items-center gap-4 px-6 py-4 border border-white text-white text-xs tracking-[0.2em] font-bold hover:bg-white hover:text-black transition-all duration-300 rounded-sm w-fit group-hover:pl-8">
        KNOW MORE
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
      </button>

      {/* Bottom Image */}
      <div className="mt-auto relative h-[320px] flex justify-center items-end">

        {/* Glow */}
        <div
          className={`absolute w-[280px] h-[280px] blur-[100px] opacity-40 rounded-full mix-blend-screen transition-opacity duration-700 group-hover:opacity-60 ${
            purple ? "bg-purple-500 top-20" : "bg-pink-500 bottom-10"
          }`}
        />

        {/* Image Container */}
        <div className="relative z-10 w-full h-[260px] flex justify-center items-end group-hover:-translate-y-2 transition-transform duration-700 ease-out">
          <div className="w-[85%] h-full relative rounded-t-[2.5rem] overflow-hidden border-x border-t border-white/10 shadow-2xl">

            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />

            <div
              className={`absolute inset-0 mix-blend-overlay z-10 ${
                purple ? "bg-purple-500/10" : "bg-pink-500/10"
              }`}
            />

            <img
              src={image}
              alt="wellness"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />

            {/* Floating UI */}
            <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <span className="text-[10px] text-white font-mono tracking-widest">
                HEALTH DATA
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}