'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import HormoneQuiz from "@/components/HormoneQuiz";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";


export default function Hero(){


return (

<section
className="
relative
overflow-hidden
min-h-screen
bg-[#FFFBFA]
flex
items-center
"
>


{/* Soft background */}

<div
className="
absolute
top-10
right-0
w-[500px]
h-[500px]
bg-pink-100/60
rounded-full
blur-[130px]
"
/>

<div
className="
absolute
bottom-0
left-0
w-[450px]
h-[450px]
bg-purple-100/50
rounded-full
blur-[120px]
"
/>




<div
className="
relative
z-10
max-w-7xl
mx-auto
px-6
py-24
grid
lg:grid-cols-2
gap-20
items-center
"
>



{/* LEFT CONTENT */}


<motion.div

initial={{
opacity:0,
y:30
}}

animate={{
opacity:1,
y:0
}}

transition={{
duration:.7
}}

className="
max-w-2xl
"

>


<div
className="
inline-flex
items-center
gap-3
mb-8
text-sm
font-semibold
text-slate-600
"
>


<span
className="
w-2
h-2
rounded-full
bg-[#FF4D8D]
"
/>


India's digital PCOS & hormone care platform


</div>





<h1
className="
text-5xl
md:text-7xl
font-black
tracking-tight
leading-[1.08]
text-slate-950
"
>

Your body has
<br/>
a pattern.


<span
className="
relative
inline-block
ml-3
mt-3
"
>


{/* tilted background */}
<span
className="
absolute
inset-0
bg-[#FFF7EF]
rounded-3xl
rotate-[-3deg]
shadow-sm
border
border-orange-100
"
/>


<span
className="
relative
z-10
px-5
py-1
inline-block
text-[#FF4D8D]
"
>

WombCare

</span>


</span>


<br/>


helps you find it.


</h1>




<p
className="
mt-8
text-xl
leading-relaxed
text-slate-600
max-w-xl
"
>

Understand your cycle, PCOS symptoms,
mood changes and lifestyle patterns through
personalized wellness insights.


</p>





{/* CTA */}


<div
className="
mt-10
flex
flex-col
sm:flex-row
gap-4
"
>


<Link

href="/hormonal-check"

className="
px-8
py-4
rounded-full
bg-slate-950
text-white
font-bold
flex
items-center
justify-center
gap-2
shadow-lg
hover:-translate-y-1
transition
"

>

Start free check

<ArrowRight size={18}/>


</Link>




<button

onClick={()=>{

document
.getElementById("register")
?.scrollIntoView({
behavior:"smooth"
})


}}

className="
px-8
py-4
rounded-full
bg-white
border
border-slate-200
font-bold
text-slate-700
shadow-sm
"

>

Book Consultation


</button>



</div>







{/* TRUST LINE */}


<div
className="
mt-14
flex
items-center
gap-4
"
>


<div
className="
w-12
h-12
rounded-full
bg-white
shadow
flex
items-center
justify-center
"
>

<ShieldCheck
className="
text-[#FF4D8D]
"
/>


</div>



<div>


<p
className="
font-bold
text-slate-900
"
>

Designed with women's wellness experts

</p>


<p
className="
text-sm
text-slate-500
"
>

Cycle tracking • PCOS care • Lifestyle guidance

</p>


</div>


</div>



</motion.div>







{/* RIGHT QUIZ */}


<motion.div

initial={{
opacity:0,
x:40
}}

animate={{
opacity:1,
x:0
}}

transition={{
duration:.8,
delay:.2
}}

className="
relative
flex
justify-center
"

>


{/* Background glow */}

<div
className="
absolute
top-20
w-[420px]
h-[420px]
blur-[100px]
"
/>





{/* Floating Character */}

<motion.div
  animate={{
    y:[0,-14,0]
  }}
  transition={{
    duration:5,
    repeat:Infinity,
    ease:"easeInOut"
  }}
  className="
    absolute
    -top-20
    left-1/2
    -translate-x-1/2
    z-20
    hidden
    md:block
  "
>

<Image
  src="/images/wellness-character.png"
  alt="Women's wellness"
  width={400}
  height={400}
  className="
    drop-shadow-2xl
  "
/>

</motion.div>





{/* Quiz Card */}

<div
className="
relative
mt-16
rounded-[2rem]
shadow-[0_35px_90px_rgba(255,77,141,0.16)]

"

>

<HormoneQuiz/>


</div>



</motion.div>




</div>


</section>


)

}