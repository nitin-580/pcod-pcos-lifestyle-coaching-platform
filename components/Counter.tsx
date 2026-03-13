'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(0, { bounce: 0, duration: 2500 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export default function Counter() {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Small delay before setting the numbers for the animation effect
    const timer = setTimeout(() => setHasStarted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-12 bg-white relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 shadow-sm border border-pink-100 flex flex-col md:flex-row justify-around items-center gap-8">
          
          <div className="flex flex-col items-center">
            <h4 className="text-pink-600 font-medium mb-2 uppercase tracking-wide text-sm">Women Joined</h4>
            <div className="text-5xl font-bold text-slate-800 flex items-center">
              {hasStarted ? <AnimatedNumber value={2483} /> : "0"}
              <span className="text-pink-500 ml-1">+</span>
            </div>
            <p className="text-slate-500 text-sm mt-2">in our early access program</p>
          </div>
          
          <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-pink-200 to-transparent"></div>
          
          <div className="flex flex-col items-center">
            <h4 className="text-purple-600 font-medium mb-2 uppercase tracking-wide text-sm">Early Bird Spots Left</h4>
            <div className="text-5xl font-bold text-slate-800">
              {hasStarted ? <AnimatedNumber value={117} /> : "0"}
            </div>
            <p className="text-slate-500 text-sm mt-2">claiming fast</p>
          </div>

        </div>
      </div>
    </section>
  );
}
