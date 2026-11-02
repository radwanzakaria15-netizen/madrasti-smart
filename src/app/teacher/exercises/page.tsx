"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {ArrowRight,Sparkles,Plus,RefreshCw,Save,Trash2,BookOpen,CheckCircle2,Lightbulb,GraduationCap} from "lucide-react";
type Exercise={id:string;title:string;question:string;choices:string[];answer:string;hint:string;explanation:string;source:"ai"|"manual"};
const KEY="madrasti-teacher-exercises-v1",RECENT="madrasti-recent-ai-exercises-v1";
export default function TeacherExercises(){
 const [subject,setSubject]=useState("العربية"),[skill,setSkill]=useState("الحروف والحركات"),[level,setLevel]=useState("السنة الثالثة ابتدائي"),[type,setType]=useState("اختيار من متعدد");
 const [title,setTitle]=useState("تمرين جديد"),[question,setQuestion]=useState(""),[choices,setChoices]=useState(["","",""]),[answer,setAnswer]=useState(""),[hint,setHint]=useState(""),[explanation,setExplanation]=useState("");
 const [exercise,setExercise]=useState<Exercise|null>(null),[saved,setSaved]=useState<Exercise[]>([]),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem(KEY)||"[]"));}catch{}},[]);
 function persist(list:Exercise[]){setSaved(list);localStorage.setItem(KEY,JSON.stringify(list));}
 function add(ex:Exercise){const list=[ex,...saved];persist(list);setMessage("تمت إضافة التمرين إلى مكتبة الأستاذ على هذا الجهاز.");}
 async function generate(){setBusy(true);setMessage("");try{let recent:string[]=[];try{recent=JSON.parse(localStorage.getItem(RECENT)||"[]");}catch{}const r=await fetch("/api/teacher/generate-exercise",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject,skill,level,type,recent})});const data=await r.json();if(!r.ok)throw new Error(data.error||"تعذر إنشاء التمرين");const ex:Exercise=data.exercise;setExercise(ex);localStorage.setItem(RECENT,JSON.stringify([ex.question,...recent].slice(0,30)));}catch(e){setMessage(e instanceof Error?e.message:"حدث خطأ غير متوقع.");}finally{setBusy(false);}}
 function createManual(){if(!question.trim()||choices.filter(x=>x.trim()).length<2||!answer.trim()||!choices.includes(answer)){setMessage("أدخل السؤال وخيارين على الأقل، وحدد الإجابة الصحيحة من الخيارات.");return;}setExercise({id:crypto.randomUUID(),title,question,choices:choices.filter(Boolean),answer,hint,explanation,source:"manual"});setMessage("تم إعداد التمرين، اضغط حفظ لإضافته إلى المكتبة.");}
 return <main className="teacher-exercises">
  <header className="teacher-ex-header"><Link href="/subjects/arabic" className="subject-back"><ArrowRight size={17}/> العودة إلى المادة</Link><div className="subject-brand"><span><GraduationCap size={20}/></span> مَدْرَسَتي الذكية</div></header>
  <section className="teacher-ex-hero"><div><span className="subject-kicker">إدارة المحتوى التعليمي</span><h1>إنشاء التمارين</h1><p>أضف تمرينك بنفسك أو دع الذكاء الاصطناعي يقترح تمرينًا جديدًا في كل مرة.</p></div><div className="teacher-ex-hero-icon"><BookOpen size={48}/></div></section>
  <section className="exercise-builder">
   <div className="builder-heading"><div><span className="builder-step">01</span><h2>إعداد التمرين</h2></div><p>حدّد المادة والمهارة والمستوى الدراسي.</p></div>
   <div className="builder-fields">
    <label>المادة<select value={subject} onChange={e=>setSubject(e.target.value)}><option>العربية</option><option>الرياضيات</option></select></label>
    <label>المهارة<input value={skill} onChange={e=>setSkill(e.target.value)} placeholder="مثال: الهمزة أو الجمع"/></label>
    <label>المستوى<select value={level} onChange={e=>setLevel(e.target.value)}>{["السنة الأولى ابتدائي","السنة الثانية ابتدائي","السنة الثالثة ابتدائي","السنة الرابعة ابتدائي","السنة الخامسة ابتدائي"].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>نوع التمرين<select value={type} onChange={e=>setType(e.target.value)}><option>اختيار من متعدد</option><option>فهم واستيعاب</option><option>تطبيق عملي</option><option>مراجعة وتقييم</option></select></label>
   </div>
   <div className="builder-actions"><button className="ai-generate" onClick={generate} disabled={busy}><Sparkles size={18}/>{busy?"جارٍ إعداد تمرين جديد...":"دع الذكاء الاصطناعي ينشئ تمرينًا"}</button><span>يتم استبعاد الأسئلة المولّدة مؤخرًا لتقليل التكرار.</span></div>
  </section>
  <section className="exercise-builder manual-builder">
   <div className="builder-heading"><div><span className="builder-step">02</span><h2>أو أضف تمرينًا بنفسك</h2></div><p>تحكم في السؤال والخيارات والإجابة.</p></div>
   <div className="manual-fields"><label>عنوان التمرين<input value={title} onChange={e=>setTitle(e.target.value)}/></label><label>السؤال<textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="اكتب نص السؤال هنا..."/></label>
    <div className="manual-choice-grid">{choices.map((v,i)=><label key={i}>الخيار {i+1}<input value={v} onChange={e=>setChoices(old=>old.map((x,j)=>j===i?e.target.value:x))}/></label>)}</div>
    <label>الإجابة الصحيحة<select value={answer} onChange={e=>setAnswer(e.target.value)}><option value="">اختر الإجابة الصحيحة</option>{choices.filter(Boolean).map(x=><option key={x}>{x}</option>)}</select></label>
    <label>تلميح (اختياري)<input value={hint} onChange={e=>setHint(e.target.value)}/></label><label>شرح الإجابة (اختياري)<textarea value={explanation} onChange={e=>setExplanation(e.target.value)}/></label>
    <button className="manual-create" onClick={createManual}><Plus size={17}/> معاينة التمرين</button>
   </div>
  </section>
  {message&&<div className="exercise-message" role="status">{message}</div>}
  {exercise&&<section className="exercise-preview"><div className="preview-top"><span><CheckCircle2 size={17}/> معاينة التمرين</span><span>{exercise.source==="ai"?"أنشأه الذكاء الاصطناعي":"تمرين من إعداد الأستاذ"}</span></div><h2>{exercise.title}</h2><p className="preview-question">{exercise.question}</p><div className="preview-options">{exercise.choices.map((x,i)=><div key={i}>{["أ","ب","ج","د"][i]}. {x}</div>)}</div><p className="preview-answer">الإجابة الصحيحة: {exercise.answer}</p>{exercise.hint&&<p className="preview-extra"><Lightbulb size={15}/>{exercise.hint}</p>}{exercise.explanation&&<p className="preview-extra">{exercise.explanation}</p>}<div className="preview-actions"><button onClick={()=>add(exercise)}><Save size={17}/> حفظ في مكتبتي</button>{exercise.source==="ai"&&<button className="preview-regenerate" onClick={generate} disabled={busy}><RefreshCw size={16}/> تمرين مختلف</button>}</div></section>}
  <section className="saved-exercises"><div className="builder-heading"><div><span className="builder-step">03</span><h2>مكتبتي من التمارين</h2></div><strong>{saved.length} تمرين</strong></div>{saved.length===0?<p className="empty-exercises">لم تحفظ تمارين بعد. أنشئ تمرينًا وأضفه إلى مكتبتك.</p>:saved.map(ex=><article className="saved-exercise" key={ex.id}><div><strong>{ex.title}</strong><p>{ex.question}</p><small>{ex.source==="ai"?"مولّد بالذكاء الاصطناعي":"إعداد الأستاذ"}</small></div><button aria-label="حذف التمرين" onClick={()=>persist(saved.filter(x=>x.id!==ex.id))}><Trash2 size={17}/></button></article>)}</section>
 </main>;
}
