'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';


const journey = [
  {
    label: "DAY 1",
    title: "Doctor Consultation",
    description:
      "Doctor provides diagnosis and medical guidance while WombCare prepares the continuous support journey.",
    points: [
      "Consultation",
      "Treatment guidance",
      "Health goals"
    ],
  },

  {
    label: "WEEK 1",
    title: "Care Program Starts",
    description:
      "Patients begin structured lifestyle support alongside their doctor's medical advice.",
    points:[
      "PCOD support",
      "Pregnancy guidance",
      "Lifestyle planning"
    ],
  },

  {
    label:"ONGOING",
    title:"Between Visits Support",
    description:
      "WombCare keeps patients engaged with healthy habits and care routines.",
    points:[
      "Nutrition",
      "Yoga sessions",
      "Progress tracking"
    ],
  },

  {
    label:"FOLLOW-UP",
    title:"Better Care Continuity",
    description:
      "Doctors meet patients who are more informed, consistent and supported.",
    points:[
      "Better engagement",
      "Continuous care",
      "Improved experience"
    ],
  },
];



export default function DoctorValueProp(){

const containerRef = useRef(null);


const {scrollYProgress}=useScroll({
target:containerRef,
offset:[
"start center",
"end center"
]
});


const scaleY = useSpring(scrollYProgress,{
stiffness:100,
damping:30
});


return(

<section
className="
relative
overflow-hidden
py-28
bg-gradient-to-b
from-white
via-pink-50/40
to-white
"
>


{/* BG */}
<div className="
absolute top-20 -left-40
w-96 h-96
bg-pink-200/40
blur-[140px]
rounded-full"
/>

<div className="
absolute bottom-20 -right-40
w-96 h-96
bg-purple-200/40
blur-[140px]
rounded-full"
/>



<div className="
relative z-10
max-w-6xl
mx-auto
px-6
">


{/* HEADER */}

<div className="
text-center
max-w-3xl
mx-auto
mb-24
">


<div className="
inline-flex
px-5 py-2
rounded-full
bg-purple-50
border border-purple-100
text-purple-700
text-xs
font-bold
uppercase
tracking-wider
mb-6
">
For Gynecologists
</div>


<h2 className="
text-4xl md:text-6xl
font-bold
tracking-tight
text-slate-900
">

Extend Your Care

<br/>

<span className="
bg-gradient-to-r
from-pink-500
to-purple-600
bg-clip-text
text-transparent
">

Beyond The Clinic

</span>

</h2>


<p className="
mt-7
text-lg
text-slate-600
leading-relaxed
">

WombCare supports patients between appointments with
structured lifestyle, wellness and care programs.

</p>


</div>






{/* TIMELINE */}

<div
ref={containerRef}
className="
relative
max-w-5xl
mx-auto
"
>


{/* base line */}

<div className="
absolute
left-6
md:left-1/2
top-0
bottom-0
w-[2px]
bg-pink-100
"
/>



{/* animated line */}

<motion.div

style={{
scaleY,
transformOrigin:"top"
}}

className="
absolute
left-6
md:left-1/2
top-0
bottom-0
w-[3px]
bg-gradient-to-b
from-pink-500
to-purple-600
rounded-full
"

/>




<div className="
space-y-24
">


{journey.map((step,index)=>(


<motion.div

key={index}

initial={{
opacity:0,
y:40
}}

whileInView={{
opacity:1,
y:0
}}

viewport={{
once:true
}}

className={`
relative
flex
items-center

${
index%2===0
?
"md:justify-start"
:
"md:justify-end"
}

pl-16
md:pl-0
`

}

>



{/* circle */}

<div className="
absolute
left-4
md:left-1/2
-translate-x-1/2
w-5 h-5
rounded-full
bg-white
border-[5px]
border-pink-400
z-20
"/>





{/* CARD */}

<div className="
w-full
md:w-[43%]
rounded-[32px]
bg-white/80
backdrop-blur-xl
border
border-pink-100
p-8
shadow-[0_25px_80px_rgba(236,72,153,.12)]
">


<span className="
inline-flex
mb-5
text-xs
font-bold
tracking-widest
text-pink-600
">

{step.label}

</span>



<h3 className="
text-2xl
font-bold
text-slate-900
mb-4
">

{step.title}

</h3>


<p className="
text-slate-600
leading-relaxed
mb-6
">

{step.description}

</p>




<div className="
space-y-3
">

{step.points.map((p,i)=>(

<p
key={i}
className="
text-sm
text-slate-700
"
>

• {p}

</p>

))}


</div>


</div>


</motion.div>


))}



</div>



</div>






{/* CTA */}

<div className="
text-center
mt-24
">


<Link
href="/join-as-doctor"

className="
inline-flex
items-center
gap-3
px-9 py-4
rounded-full
bg-purple-600
text-white
font-bold
shadow-xl
hover:-translate-y-1
transition
"
>

Partner With WombCare

<ArrowRight size={18}/>

</Link>



<p className="
mt-5
text-sm
text-slate-500
">

Bring continuous care support to your patients beyond clinic visits.

</p>


</div>



</div>


</section>

)

}