'use client';

import { motion } from "framer-motion";
import Link from 'next/link';
import HormoneQuiz from '@/components/HormoneQuiz';

type FloatingCardProps = {
  position?: string;
  width?: string;
  delay?: number;
  children: React.ReactNode;
};

function FloatingCard({
  position = "",
  width = "w-[200px]",
  delay = 0,
  children,
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`absolute ${position} z-20 hidden md:block`}
    >
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
        className={`${width} backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-3xl p-5`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const col1 = [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498837167922-41c992d9bc02?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594824432258-f7b77ab6ef89?q=80&w=600&auto=format&fit=crop"
  ];

  const col2 = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop"
  ];

  const col3 = [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554721453-2ce52bf44bd2?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595152772096-72c45b0d0c35?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop"
  ];

  const col4 = [
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522844990619-4951c40f7eda?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556817411-31ae72fa3ea8?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1434493789847-2f02bffa93ea?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=600&auto=format&fit=crop"
  ];

  const scrollToRegister = () => {
    const section = document.getElementById("register");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToHormone = () => {
    const section = document.getElementById("hormone");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ImageColumn = ({
    images,
    direction,
    duration,
    hiddenClass = ""
  }: {
    images: string[];
    direction: 'up' | 'down';
    duration: number;
    hiddenClass?: string;
  }) => (
    <div className={`relative h-[150vh] w-[140px] sm:w-[200px] md:w-[240px] lg:w-[260px] overflow-hidden ${hiddenClass}`}>
      <motion.div
        className="flex flex-col gap-4 sm:gap-6"
        animate={{
          y: direction === 'up' ? ['-50%', '0%'] : ['0%', '-50%']
        }}
        transition={{
          y: {
            repeat: Infinity,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
      >
        {[...images, ...images].map((src, i) => (
          <div
            key={i}
            className="w-full h-[180px] sm:h-[260px] md:h-[300px] lg:h-[320px] rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm opacity-40 hover:opacity-60 transition-opacity duration-500"
          >
            <img
              src={src}
              alt="Wellness Lifestyle"
              loading="lazy"
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">

      {/* Background Images */}
      <div className="absolute inset-0 w-full h-full z-0 flex justify-center gap-4 sm:gap-6 lg:gap-8 pt-10 px-2 sm:px-4 transform -translate-y-10 overflow-hidden mask-hero-grid">
        <ImageColumn images={col1} direction="up" duration={35} />
        <ImageColumn images={col2} direction="down" duration={30} />
        <ImageColumn images={col3} direction="up" duration={38} hiddenClass="hidden md:block" />
        <ImageColumn images={col4} direction="down" duration={32} hiddenClass="hidden lg:block" />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.95) 100%)"
        }}
      />

      {/* Floating Cards */}
      {/* <FloatingCard position="top-[140px] left-[8%]" delay={0.2}>
        <p className="text-xs text-slate-500">Cycle Length</p>
        <p className="text-2xl font-bold text-pink-600">28 Days</p>
      </FloatingCard>

      <FloatingCard position="bottom-[220px] left-[10%]" width="w-[220px]" delay={0.4}>
        <p className="text-sm text-slate-600">Ovulation Window</p>
        <p className="text-lg font-semibold text-purple-600">Day 13 - 15</p>
      </FloatingCard>

      <FloatingCard position="bottom-[180px] right-[8%]" width="w-[220px]" delay={0.6}>
        <p className="text-xs text-slate-500">Progesterone</p>
        <p className="text-lg font-semibold text-pink-600">Moderate</p>
      </FloatingCard> */}

      {/* Main Hero Layout */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-slate-800 tracking-tight"
            >
              Take Control of PCOD &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                Period Health
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl"
            >
              Meet your personal AI lifestyle coach designed to help you
              balance hormones, master your cycle, and thrive every day.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToHormone}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold text-lg shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Start Hormone Check
              </button>

              <button
                onClick={scrollToRegister}
                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold text-lg shadow-sm"
              >
                Join Early Access
              </button>
            </div>
          </div>

          {/* Right Quiz */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="max-w-lg mx-auto w-full"
          >
            <div className="border rounded-[2rem] p-6 md:p-8">
              <HormoneQuiz />
            </div>
          </motion.div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .mask-hero-grid {
              -webkit-mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
              mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
            }
          `
        }}
      />
    </section>
  );
}
