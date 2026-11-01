"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";

const questions:any={
 arabic_letters:{title:"تمييز الحروف",q:"أي حرف تبدأ به كلمة بَيت؟",choices:["ب","ت","ث"],answer:"ب",hint:"استمع إلى الصوت الأول في كلمة بَيت."},
 numbers:{title:"تعلم الأرقام",q:"ما العدد الذي يأتي بعد 7؟",choices:["6","8","9"],answer:"8",hint:"عدّ: 7 ثم العدد الذي يليه."},
 multiplication:{title:"جدول الضرب",q:"كم يساوي 3 × 2؟",choices:["5","6","8"],answer:"6",hint:"الضرب هنا يعني 3 مجموعات، في كل مجموعة شيئان."},
 operations:{title:"الجمع",q:"كم يساوي 5 + 3؟",choices:["7","8","9"],answer:"8",hint:"ابدأ من 5 وعدّ ثلاث خطوات إلى الأمام."},
 word_problems:{title:"مسألة حياتية",q:"مع ليلى 4 أقلام واشترت قلمين. كم قلمًا أصبح معها؟",choices:["5","6","7"],answer:"6",hint:"عندما نضيف أقلامًا نستخدم الجمع."},
 grammar:{title:"تمييز الكلمة",q:"أي كلمة تدل على فعل؟",choices:["كتب","كتاب","قلم"],answer:"كتب",hint:"الفعل يدل على حدث."},
 handwriting:{title:"تدريب الخط",q:"اختر الحرف الذي نتدرب على كتابته اليوم.",choices:["ب","م","س"],answer:"ب",hint:"تذكر أن للحرف باء نقطة واحدة أسفل جسمه."},
 arabic_quiz:{title:"اختبار اللغة العربية",q:"أي كلمة تبدأ بحرف م؟",choices:["موز","باب","قلم"],answer:"موز",hint:"ابحث عن الحرف الأول."},
 math_quiz:{title:"اختبار الرياضيات",q:"كم يساوي 10 - 4؟",choices:["5","6","7"],answer:"6",hint:"ابدأ من 10 وارجع أربع خطوات."}
};
export default function Activities(){
 const params=useSearchParams(); const skill=params.get("skill")||"operations"; const item=questions[skill]||questions.operations;
 const [choice,setChoice]=useState("");const [result,setResult]=useState("");const [hint,setHint]=useState(false);
 async function check(){if(!choice)return;const correct=choice===item.answer;setResult(correct?"أحسنت! إجابة صحيحة.":"محاولة جيدة، لا بأس من الخطأ. "+item.hint);
   try{await fetch("/api/assessment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject:skill.startsWith("math")||["numbers","multiplication","operations","word_problems"].includes(skill)?"math":"arabic",skill,question:item.q,answer:choice,correct})});}catch{}
 }
 return <main className="shell"><header className="topbar"><Link href="/" className="pill">← الرئيسية</Link><div className="brand">مساحة التعلم</div></header><section className="panel" style={{maxWidth:700,margin:"35px auto"}}><div className="pill">{item.title}</div><h1 style={{fontSize:27,marginTop:20}}>{item.q}</h1><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,margin:"25px 0"}}>{item.choices.map((c:string)=><button key={c} className={choice===c?"btn":"btn secondary"} onClick={()=>{setChoice(c);setResult("");}} style={{fontSize:22,padding:20}}>{c}</button>)}</div><div className="actions"><button className="btn" onClick={check}>تحقق من الإجابة</button><button className="btn ghost" onClick={()=>setHint(!hint)}>أحتاج إلى تلميح</button></div>{hint&&<div className="feedback">{item.hint}</div>}{result&&<div className="feedback">{result}</div>}<p style={{fontSize:12,color:"var(--muted)"}}>هذا نشاط أولي. حفظ النتائج يتطلب تسجيل التلميذ وربطه بحساب في قاعدة البيانات.</p></section></main>;
}
