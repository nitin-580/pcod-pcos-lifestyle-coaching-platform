'use client';

import Link from "next/link";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingTable() {

const plans = [
{
name:"Essential Care",
price:"₹999",
duration:"1 Month",
tag:"Start your journey",
description:
"For women beginning their PCOD wellness journey.",
features:[
"Personalized lifestyle guidance",
"Cycle & wellness tracking",
"Weekly health insights",
"Basic care support",
],
highlighted:false
},

{
name:"Complete PCOD Care",
price:"₹2999",
duration:"3 Months",
tag:"Recommended",
description:
"A guided PCOD care program with expert support.",
features:[
"Personalized PCOD lifestyle plan",
"Nutrition guidance",
"Yoga & wellness sessions",
"Hormonal health tracking",
"1-on-1 care consultation",
"Priority support",
],
highlighted:true
},

{
name:"Conceive Care",
price:"₹4999",
duration:"3 Months",
tag:"Fertility support",
description:
"Designed for women preparing their conception journey.",
features:[
"Fertility-focused lifestyle plan",
"Ovulation & cycle support",
"Nutrition assistance",
"Expert consultation",
"Wellness coaching",
],
highlighted:false
}

];


return(

<section
className="
relative overflow-hidden
py-24
bg-gradient-to-b
from-white
via-pink-50/40
to-white
"
>


{/* background */}
<div className="
absolute -top-20 -left-20
w-80 h-80
bg-pink-200/40
blur-[120px]
rounded-full"
/>

<div className="
absolute bottom-0 -right-20
w-80 h-80
bg-purple-200/40
blur-[120px]
rounded-full"
/>



<div className="
relative z-10
max-w-7xl
mx-auto
px-5
">



{/* Heading */}

<div className="
text-center
max-w-3xl
mx-auto
mb-16
">


<div className="
inline-flex
mb-5
px-5 py-2
rounded-full
bg-purple-50
border
border-purple-100
text-purple-700
text-xs
font-bold
uppercase
tracking-wider
">

Care Programs

</div>



<h2 className="
text-4xl
md:text-5xl
font-bold
tracking-tight
text-slate-900
">

Choose Your

<span className="
bg-gradient-to-r
from-pink-500
to-purple-600
bg-clip-text
text-transparent
">
{" "}WombCare Journey
</span>

</h2>



<p className="
mt-5
text-lg
text-slate-600
leading-relaxed
">

Doctor-guided wellness programs designed around
PCOD, hormonal health and fertility care.

</p>


</div>





{/* cards */}

<div className="
grid
grid-cols-1
md:grid-cols-3
gap-8
items-stretch
">


{plans.map((plan,index)=>(


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

transition={{
delay:index*.1
}}

viewport={{
once:true
}}


className={`

relative
rounded-[2rem]
p-7 md:p-8
flex
flex-col

border
transition-all

${
plan.highlighted
?
`
bg-white
border-purple-200
shadow-[0_30px_90px_rgba(168,85,247,.20)]
md:-translate-y-6
`
:
`
bg-white/80
border-pink-100
shadow-lg
`
}

`}

>


{/* tag */}

<div
className={`
self-start
mb-6
px-4 py-1.5
rounded-full
text-xs
font-bold

${
plan.highlighted
?
"bg-purple-600 text-white"
:
"bg-pink-50 text-pink-600"
}

`}
>

{plan.tag}

</div>




<h3 className="
text-2xl
font-bold
text-slate-900
">

{plan.name}

</h3>


<p className="
mt-3
text-slate-600
text-sm
leading-relaxed
min-h-[45px]
">

{plan.description}

</p>





<div className="
mt-8
flex
items-end
gap-2
">


<span className="
text-5xl
font-bold
text-slate-900
">

{plan.price}

</span>


<span className="
text-slate-500
mb-2
">

/ {plan.duration}

</span>


</div>






<div className="
my-8
h-px
bg-gradient-to-r
from-transparent
via-pink-200
to-transparent
"/>





<ul className="
space-y-4
flex-1
">


{plan.features.map((item,i)=>(

<li
key={i}
className="
flex
gap-3
text-sm
text-slate-700
"
>


<div className="
shrink-0
mt-0.5
w-5 h-5
rounded-full
bg-pink-50
flex
items-center
justify-center
">


<Check
size={13}
className="
text-pink-500
"
/>


</div>


{item}


</li>

))}


</ul>






<Link

href={`/checkout?plan=${plan.name}`}

className={`
mt-10
w-full
py-4
rounded-full
text-center
font-bold
transition

${
plan.highlighted
?
"bg-purple-600 text-white hover:bg-purple-700 shadow-lg"
:
"bg-purple-50 text-purple-700 hover:bg-purple-100"
}

`}

>


Start Care Journey


</Link>



</motion.div>


))}



</div>



</div>


</section>


)

}