'use client';

import { useMemo } from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';

interface DoctorItem {
  name: string;
  specialization: string;
  credentials: string;
  photo: string;
}

const DOCTORS: DoctorItem[] = [
  {
    name: "Dr. Akansha Gupta",
    specialization: "Gynaecology & PCOS Expert",
    credentials: "MD, DGO • 12+ Years Exp",
    photo: "/doctor/akansha-gupta.png"
  },
  {
    name: "Dr. Deepa Gupta",
    specialization: "Clinical Nutritionist & Dietitian",
    credentials: "M.Sc. Nutrition • 8+ Years Exp",
    photo: "/doctor/deepa-gupta.png"
  },
  {
    name: "Dr. Manisha Ranjan",
    specialization: "Senior Consultant Gynecologist",
    credentials: "MBBS, MS • 15+ Years Exp",
    photo: "/doctor/manisha-ranjan.png"
  },
  {
    name: "Dr. Megha Mehra",
    specialization: "Hormonal Balance & Lifestyle Coach",
    credentials: "BAMS, MD (Ayurveda) • 9+ Years Exp",
    photo: "/doctor/megha-mehra.png"
  },
  {
    name: "Dr. Neha Raj",
    specialization: "PCOS & Fertility Consultant",
    credentials: "DNB, Gynec • 10+ Years Exp",
    photo: "/doctor/neha-raj.png"
  },
  {
    name: "Dr. Nyyaya Saini",
    specialization: "Women's Mental Health Specialist",
    credentials: "MD Psychiatry • 7+ Years Exp",
    photo: "/doctor/nyyaya-saini.png"
  },
  {
    name: "Dr. Prerna Gupta",
    specialization: "Endocrinologist & Metabolic Lead",
    credentials: "DM Endocrinology • 11+ Years Exp",
    photo: "/doctor/prerna-gupta.png"
  },
  {
    name: "Dr. Sanheeta Dasgupta",
    specialization: "Yoga & Pelvic Floor Coach",
    credentials: "RYT 500, Physio • 6+ Years Exp",
    photo: "/doctor/sanheeta-dasgupta.png"
  },
  {
    name: "Dr. Uma Mishra",
    specialization: "Holistic Health Advisor",
    credentials: "BAMS • 14+ Years Exp",
    photo: "/doctor/uma-mishra.png"
  }
];


export default function DoctorMarquee() {

  const marqueeItems = useMemo(
    () => [...DOCTORS, ...DOCTORS],
    []
  );


  return (

    <section
      className="
      py-14
      bg-gradient-to-b
      from-slate-50
      to-white
      overflow-hidden
      relative
      "
    >


      {/* marquee animation */}
      <style
        dangerouslySetInnerHTML={{
          __html:`

          @keyframes marqueeScroll {

          0% {
          transform:translateX(0)
          }

          100% {
          transform:translateX(-50%)
          }

          }


          .animate-marquee-infinite {
          display:flex;
          width:max-content;
          animation:marqueeScroll 45s linear infinite;
          }


          .animate-marquee-infinite:hover {
          animation-play-state:paused;
          }

          `
        }}
      />





      {/* HEADER */}

      <div className="max-w-7xl mx-auto px-6 mb-10">


        <div
          className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          justify-between
          gap-5
          "
        >


          <div>


            <span
              className="
              inline-flex
              px-3
              py-1
              rounded-full
              text-[10px]
              font-black
              uppercase
              tracking-[0.2em]
              bg-pink-50
              text-pink-600
              border
              border-pink-100
              "
            >
              Clinical Excellence
            </span>



            <h2
              className="
              mt-3
              text-3xl
              md:text-4xl
              font-extrabold
              text-slate-900
              "
            >

              Meet WombCare's Expert Care Team

            </h2>



            <p
              className="
              mt-3
              text-slate-500
              max-w-2xl
              "
            >

              Dedicated specialists in PCOS, fertility,
              nutrition, hormonal health and holistic wellness.

            </p>


          </div>




          <div
            className="
            flex
            items-center
            gap-2
            bg-white
            rounded-full
            px-4
            py-2
            shadow-sm
            border
            "
          >

            <Sparkles className="w-4 h-4 text-pink-500"/>

            <span className="text-xs font-semibold text-slate-500">
              Hover to pause
            </span>


          </div>


        </div>





        {/* NATURAL TRUST SECTION */}

        <div
          className="
          mt-8
          flex
          flex-col
          sm:flex-row
          sm:items-center
          gap-5
          "
        >


          {/* overlapping doctors */}

          <div className="flex -space-x-3">


            {DOCTORS.slice(0,5).map((doctor)=>(

              <div

                key={doctor.name}

                className="
                w-12
                h-12
                rounded-full
                overflow-hidden
                border-2
                border-white
                shadow
                bg-slate-100
                "
              >

                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="
                  w-full
                  h-full
                  object-cover
                  "
                />

              </div>

            ))}



            <div
              className="
              w-12
              h-12
              rounded-full
              bg-[#FF4D8D]
              text-white
              flex
              items-center
              justify-center
              font-bold
              text-xs
              border-2
              border-white
              "
            >

              +45

            </div>


          </div>





          <div>


            <h3
              className="
              text-lg
              font-extrabold
              text-slate-900
              "
            >

              50+ women's health experts

            </h3>


            <p
              className="
              text-sm
              text-slate-500
              "
            >

              Gynecologists, nutritionists and wellness specialists
              supporting personalized care.

            </p>


          </div>


        </div>



      </div>







      {/* DOCTOR SLIDER */}


      <div className="relative overflow-hidden py-4">


        <div className="animate-marquee-infinite gap-6 px-4">


          {marqueeItems.map((doctor,index)=>(


            <div

              key={`${doctor.name}-${index}`}

              className="
              w-[360px]
              shrink-0
              bg-white
              rounded-3xl
              border
              border-slate-100
              p-5
              shadow-sm
              hover:shadow-xl
              hover:border-pink-200
              transition-all
              "
            >



              <div className="flex gap-4">


                <img

                  src={doctor.photo}

                  alt={doctor.name}

                  className="
                  w-20
                  h-20
                  rounded-2xl
                  object-cover
                  "
                />



                <div>


                  <div className="flex gap-2">


                    <h3 className="font-bold text-sm">

                      {doctor.name}

                    </h3>


                    <CheckCircle
                      className="
                      w-4
                      h-4
                      text-green-500
                      "
                    />


                  </div>




                  <p className="text-xs font-semibold text-pink-600 mt-1">

                    {doctor.specialization}

                  </p>


                  <p className="text-xs text-slate-500 mt-1">

                    {doctor.credentials}

                  </p>



                  <span
                    className="
                    inline-block
                    mt-3
                    px-2
                    py-1
                    bg-green-50
                    text-green-700
                    rounded-md
                    text-[9px]
                    font-bold
                    "
                  >

                    WombCare Verified

                  </span>


                </div>



              </div>



            </div>


          ))}



        </div>


      </div>



    </section>

  );

}