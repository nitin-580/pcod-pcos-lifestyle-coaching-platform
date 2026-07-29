'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';

export default function ApkDownload() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#F8F4FF] via-white to-[#FFF0F5] relative overflow-hidden">

      {/* Decorative Glow */}
      <div className="absolute -left-48 top-12 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -right-48 bottom-12 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse" />


      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div
          className="
          flex 
          flex-col 
          lg:flex-row 
          items-center 
          justify-between 
          gap-16
          "
        >


          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity:0, x:-40 }}
            whileInView={{ opacity:1, x:0 }}
            transition={{ duration:0.7 }}
            viewport={{once:true}}
            className="flex-1 space-y-7"
          >


             {/* Badge */}
            <span
              className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              bg-pink-100
              text-[#FF4D8D]
              rounded-full
              text-xs
              font-black
              uppercase
              tracking-wider
              "
            >
              <Smartphone size={15}/>
              Google Play Store
            </span>



            {/* Heading */}
            <h2
              className="
              text-4xl
              md:text-6xl
              font-black
              tracking-tight
              text-slate-900
              leading-tight
              "
            >

              Your Hormone <br/>

              Wellness App

              <br/>

              <span className="text-[#FF4D8D]">
                Now on Google Play
              </span>

            </h2>



            <p
              className="
              text-lg
              text-slate-600
              max-w-xl
              leading-relaxed
              "
            >

              Track your menstrual cycle, symptoms,
              mood, hydration and wellness journey
              with your personal WombCare companion.

            </p>



            {/* FEATURES */}
            <div className="space-y-4">


              <Feature>
                WombCare for Android
              </Feature>


              <Feature>
                Cycle & lifestyle tracking
              </Feature>


              <div className="flex items-center gap-3">

                <ShieldCheck
                  className="
                  w-5
                  h-5
                  text-emerald-500
                  "
                />

                <span className="font-semibold text-slate-700">
                  Verified by Play Protect
                </span>

              </div>


            </div>



            {/* BUTTON */}

            <div className="pt-5 space-y-3">


              <a

                href="https://play.google.com/store/apps/details?id=com.wombcare.app"

                target="_blank"

                rel="noopener noreferrer"

                className="
                inline-flex
                items-center
                gap-4
                px-7
                py-3
                bg-slate-950
                text-white
                rounded-2xl
                font-bold
                shadow-xl
                hover:scale-105
                hover:bg-slate-900
                border
                border-slate-800
                transition-all
                "
              >

                <svg viewBox="0 0 512 512" className="w-8 h-8 select-none pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#ffcc00"/>
                  <path d="M26.4 0C11.9 0 0 11.9 0 26.4v459.2C0 500.1 11.9 512 26.4 512c7.1 0 13.9-2.9 18.9-8.1L271 283.4 45.3 8.1C40.3 2.9 33.5 0 26.4 0z" fill="#00e5ff"/>
                  <path d="M325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" fill="#ff3366"/>
                  <path d="M385.4 174.2L493 236.8c11.6 6.7 19 19 19 32.4s-7.4 25.7-19 32.4L385.4 337.8l-60.1-60.1 60.1-63.5z" fill="#48ff48"/>
                </svg>

                <div className="flex flex-col items-start leading-none">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">GET IT ON</span>
                  <span className="text-lg font-bold font-sans mt-0.5">Google Play</span>
                </div>

              </a>



              <p className="text-sm text-slate-500">
                Official Release • Free Download
              </p>


            </div>



          </motion.div>





          {/* RIGHT MOCKUP */}
          <div
            className="
            flex-1
            relative
            flex
            justify-center
            items-center
            "
          >


            {/* Glow behind phone */}

            <div
              className="
              absolute
              w-[420px]
              h-[420px]
              bg-[#FF4D8D]/20
              rounded-full
              blur-3xl
              "
            />



            <motion.div

              initial={{opacity:0,y:60}}

              whileInView={{opacity:1,y:0}}

              transition={{duration:.8}}

              viewport={{once:true}}

              className="relative"


            >


              {/* YOUR REAL MOCKUP IMAGE */}

              <Image

                src="/images/handholdingphone.png"

                alt="WombCare mobile app"

                width={520}

                height={700}

                priority

                className="
                relative
                z-10
                drop-shadow-[0_45px_70px_rgba(255,77,141,0.25)]
                hover:scale-[1.03]
                transition-transform
                duration-500
                "

              />




            </motion.div>



          </div>


        </div>

      </div>

    </section>
  );
}





function Feature({
  children
}:{
  children:React.ReactNode
}) {

return (

<div className="flex items-center gap-3">

<CheckCircle2
className="
w-5
h-5
text-emerald-500
"
/>


<span className="font-semibold text-slate-700">

{children}

</span>


</div>

)

}