'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

import Link from 'next/link';

import {
  determineHormoneProfile,
  type HormoneProfile
} from '@/lib/quizLogic';



const QUESTIONS = [
 {
 id:'sleep',
 text:'How would you describe your current sleep quality?',
 options:[
  {value:'poor',label:'Restless, I wake up tired'},
  {value:'average',label:'Okay, but could be better'},
  {value:'good',label:'I sleep deeply and wake up refreshed'}
 ]
 },
 {
 id:'stress',
 text:'What is your average daily stress level?',
 options:[
 {value:'high',label:'Consistently high, feeling overwhelmed'},
 {value:'moderate',label:'Manageable but present'},
 {value:'low',label:'Generally calm and relaxed'}
 ]
 },
 {
 id:'exercise',
 text:'How often do you engage in exercise?',
 options:[
 {value:'high',label:'4+ times a week'},
 {value:'moderate',label:'Walking, yoga or moderate activity'},
 {value:'low',label:'Rarely'}
 ]
 },
 {
 id:'sugarCravings',
 text:'Do you experience sugar or carb cravings?',
 options:[
 {value:'frequent',label:'Almost every day'},
 {value:'occasional',label:'Sometimes during my cycle'},
 {value:'rare',label:'Rarely'}
 ]
 }
];





export default function HormoneQuiz(){

const [step,setStep]=useState(0);

const [selected,setSelected]=useState("");

const [answers,setAnswers]=useState<Record<string,string>>({});

const [result,setResult]=useState<{
profile:HormoneProfile;
description:string;
}|null>(null);



const progress =
((step+1)/QUESTIONS.length)*100;




function next(){

if(!selected)return;


const updated={
...answers,
[QUESTIONS[step].id]:selected
};


setAnswers(updated);



if(step < QUESTIONS.length-1){

setStep(step+1);

setSelected("");

}

else{

setResult(
determineHormoneProfile(updated)
);

}

}




function reset(){

setStep(0);
setSelected("");
setAnswers({});
setResult(null);

}




return (

<div
className="
w-full
max-w-xl
mx-auto
rounded-[2rem]
shadow-[0_30px_80px_rgba(0,0,0,0.08)]

p-8
"
>


{!result ? (

<>


{/* HEADER */}


<div
className="
text-center
mb-8
"
>

<h3
className="
text-2xl
font-black
text-slate-900
"
>
Discover Your Hormone Profile
</h3>


<p
className="
mt-2
text-sm
text-slate-500
"
>
Answer 4 quick questions to understand your body better.
</p>


</div>






{/* Progress */}

<div
className="
flex
items-center
gap-4
mb-10
"
>

<div
className="
flex-1
h-1.5
bg-slate-100
rounded-full
overflow-hidden
"
>


<div

style={{
width:`${progress}%`
}}

className="
h-full
bg-[#FF4D8D]
transition-all
duration-500
"

/>


</div>



<span
className="
text-sm
font-medium
text-slate-500
"
>

{step+1}/{QUESTIONS.length}

</span>


</div>






<AnimatePresence mode="wait">


<motion.div

key={step}

initial={{
opacity:0,
y:20
}}

animate={{
opacity:1,
y:0
}}

exit={{
opacity:0,
y:-20
}}

transition={{
duration:.3
}}

>


<h4
className="
text-xl
font-bold
text-slate-900
mb-6
"
>

{QUESTIONS[step].text}

</h4>





<div className="space-y-4">


{QUESTIONS[step].options.map(option=>{


const active =
selected===option.value;


return (


<button

key={option.value}

onClick={()=>
setSelected(option.value)
}

className={`
w-full
px-5
py-4
rounded-xl
border
flex
items-center
justify-between
text-left
transition

${active
?
'border-[#FF4D8D] bg-pink-50'
:
'border-slate-200 hover:border-pink-200'
}

`}

>


<span
className="
font-medium
text-slate-700
"
>

{option.label}

</span>



{active ? (

<CheckCircle2
className="
text-[#FF4D8D]
"
/>

):(

<div
className="
w-5
h-5
rounded-full
border-2
border-slate-200
"
/>

)}



</button>


)


})}



</div>




{/* Footer */}

<div
className="
mt-10
flex
items-center
justify-between
"
>



<div className="flex gap-2">


{QUESTIONS.map((_,i)=>(


<div

key={i}

className={`
w-2.5
h-2.5
rounded-full

${i===step
?'bg-[#FF4D8D]'
:'bg-slate-200'}

`}

/>

))}


</div>




<button

onClick={next}

className="
w-14
h-14
rounded-2xl
bg-[#FF4D8D]
text-white
flex
items-center
justify-center
shadow-lg
hover:scale-105
transition
"

>

<ArrowRight/>


</button>


</div>



</motion.div>


</AnimatePresence>



</>

):(


<motion.div

initial={{
opacity:0,
scale:.95
}}

animate={{
opacity:1,
scale:1
}}

className="
text-center
py-8
"

>


<div
className="
mx-auto
w-16
h-16
rounded-full
bg-pink-100
text-[#FF4D8D]
font-black
text-3xl
flex
items-center
justify-center
mb-5
"
>

{result.profile[0]}

</div>



<h3
className="
text-2xl
font-black
"
>

{result.profile}

</h3>



<p
className="
mt-4
text-slate-500
"
>

{result.description}

</p>




<div
className="
mt-8
flex
justify-center
gap-3
"
>


<Link

href="/pricing"

className="
px-6
py-3
rounded-xl
bg-slate-900
text-white
font-bold
"

>

Get Plan

</Link>



<button

onClick={reset}

className="
px-5
py-3
border
rounded-xl
flex
gap-2
items-center
"

>

<RotateCcw size={16}/>

Retry

</button>



</div>



</motion.div>


)}



</div>


)

}