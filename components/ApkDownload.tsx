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
              Android Release
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
                Now on Android
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
                WombCare APK v1.0.1
              </Feature>


              <Feature>
                Cycle & lifestyle tracking
              </Feature>


              <div className="flex items-center gap-3">

                <ShieldCheck
                  className="
                  w-5
                  h-5
                  text-purple-500
                  "
                />

                <span className="font-semibold text-slate-700">
                  Secure official download
                </span>

              </div>


            </div>



            {/* BUTTON */}

            <div className="pt-5 space-y-3">


              <a

                href="https://pub-a67185b5775c4b26ab3cebd36d579b22.r2.dev/wombcare.apk"

                download

                className="
                inline-flex
                items-center
                gap-3
                px-8
                py-4
                bg-slate-900
                text-white
                rounded-2xl
                font-bold
                shadow-xl
                hover:scale-105
                hover:bg-slate-800
                transition-all
                "
              >

                <Download className="animate-bounce"/>

                Download APK

              </a>



              <p className="text-sm text-slate-500">
                Size: ~112MB • Android Package (.apk)
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