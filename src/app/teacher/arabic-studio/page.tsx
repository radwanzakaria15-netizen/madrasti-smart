"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {ArrowRight,BookOpen,CaseSensitive,Check,ChevronDown,Circle,FileText,Highlighter,Minus,Plus,Save,Sparkles,Square,Trash2,Type,Underline,Eye,PenLine} from "lucide-react";

type Block={id:string;kind:"text"|"instruction"|"shape";text:string;shape?: "circle"|"square"|"line"};
const STORE="madrasti-arabic-studio-v1";
export default function ArabicStudio(){
 const [title,setTitle]=useState("تمرين في اللغة العربية");
 const [grade,setGrade]=useState("السنة الثالثة ابتدائي");
 const [instruction,setInstruction]=useState("اقرأ الجملة ثم أجب عن المطلوب.");
 const [blocks,setBlocks]=useState<Block[]>([{id:"b1",kind:"text",text:"دخل المعلم المدرسة."}]);
 const [active,setActive]=useState("b1");
 const [mode,setMode]=useState<"edit"|"preview">("edit");
 const [dict,setDict]=useState("");
 const [dictResult,setDictResult]=useState("");
 const [dictBusy,setDictBusy]=useState(false);
 const [dictError,setDictError]=useState("");
 const [dictation,setDictation]=useState("ذهب التلميذ إلى المدرسة في الصباح.");
 const [studentText,setStudentText]=useState("");
 const [review,setReview]=useState<{corrected:string;notes:string[]}|null>(null);
 const [reviewBusy,setReviewBusy]=useState(false);
 const [notice,setNotice]=useState("");
 const editor=useRef<HTMLDivElement>(null);
 useEffect(()=>{try{const x=localStorage.getItem(STORE);if(x){const v=JSON.parse(x);setTitle(v.title||title);setGrade(v.grade||grade);setInstruction(v.instruction||instruction);setBlocks(v.blocks||blocks);}}catch{}},[]);
 function updateBlock(id:string,patch:Partial<Block>){setBlocks(old=>old.map(b=>b.id===id?{...b,...patch}:b));}
 function addBlock(kind:Block["kind"],shape?:Block["shape"]){const b:Block={id:crypto.randomUUID(),kind,shape,text:kind==="instruction"?"اكتب المطلوب من التلميذ هنا...":kind==="shape"?"ضع الكلمة أو السؤال هنا":"اكتب نص السؤال أو الجملة هنا..."};setBlocks(old=>[...old,b]);setActive(b.id);}
 function save(){localStorage.setItem(STORE,JSON.stringify({title,grade,instruction,blocks}));setNotice("حُفظ التمرين في هذا المتصفح.");}
 function format(command:string,value?:string){editor.current?.focus();document.execCommand(command,false,value);if(editor.current){const html=editor.current.innerHTML;updateBlock(active,{text:html});}}
 async function lookup(){if(!dict.trim())return;setDictBusy(true);setDictError("");setDictResult("");try{const r=await fetch("https://ar.wiktionary.org/w/api.php?action=query&format=json&origin=*&prop=extracts&explaintext=1&exintro=1&titles="+encodeURIComponent(dict.trim()));const j=await r.json();const p=Object.values(j.query.pages)[0] as {extract?:string};if(p?.extract)setDictResult(p.extract.slice(0,1800));else setDictError("لم نعثر على مدخل واضح لهذه الكلمة.");}catch{setDictError("تعذر الاتصال بالقاموس. تحقق من الإنترنت وحاول مجددًا.");}finally{setDictBusy(false);}}
 async function proofread(){setReviewBusy(true);setReview(null);try{const r=await fetch("/api/teacher/proofread-arabic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({source:dictation,student:studentText})});const j=await r.json();if(!r.ok)throw new Error(j.error||"تعذرت مراجعة النص");setReview(j.review);}catch(e){setNotice(e instanceof Error?e.message:"تعذر التصحيح الآن.");}finally{setReviewBusy(false);}}
 return <main className="arabic-studio">
  <header className="studio-top"><Link href="/subjects/arabic" className="subject-back"><ArrowRight size={17}/> العودة إلى اللغة العربية</Link><div className="subject-brand"><span><BookOpen size={20}/></span> مَدْرَسَتي الذكية</div></header>
  <section className="studio-hero"><div><span className="subject-kicker">مساحة الأستاذ الإبداعية</span><h1>استوديو اللغة العربية</h1><p>أنشئ ورقة عمل تفاعلية بطريقتك، وحدّد الكلمات والأجزاء التي تريد من التلميذ الانتباه إليها.</p></div><PenLine size={48}/></section>
  <nav className="studio-tabs"><button className={mode==="edit"?"selected":""} onClick={()=>setMode("edit")}><PenLine size={16}/> إنشاء تمرين</button><button className={mode==="preview"?"selected":""} onClick={()=>setMode("preview")}><Eye size={16}/> معاينة التلميذ</button></nav>
  {mode==="edit"?<>
   <section className="studio-panel"><div className="studio-panel-head"><div><span>01</span><h2>معلومات التمرين</h2></div><button onClick={save}><Save size={16}/> حفظ</button></div><div className="studio-meta"><label>عنوان التمرين<input value={title} onChange={e=>setTitle(e.target.value)}/></label><label>المستوى الدراسي<select value={grade} onChange={e=>setGrade(e.target.value)}>{["السنة الأولى ابتدائي","السنة الثانية ابتدائي","السنة الثالثة ابتدائي","السنة الرابعة ابتدائي","السنة الخامسة ابتدائي"].map(x=><option key={x}>{x}</option>)}</select></label><label className="wide">تعليمات التلميذ<input value={instruction} onChange={e=>setInstruction(e.target.value)}/></label></div></section>
   <section className="studio-panel"><div className="studio-panel-head"><div><span>02</span><h2>محرّر التمرين الحر</h2></div><small>أضف العناصر ورتّبها كما تريد</small></div>
    <div className="studio-toolbar"><button onClick={()=>addBlock("text")}><Type size={16}/> نص أو جملة</button><button onClick={()=>addBlock("instruction")}><FileText size={16}/> تعليمات</button><button onClick={()=>addBlock("shape","circle")}><Circle size={16}/> دائرة</button><button onClick={()=>addBlock("shape","square")}><Square size={16}/> مربع</button><button onClick={()=>addBlock("shape","line")}><Minus size={16}/> خط</button></div>
    <div className="studio-workspace"><div className="studio-paper"><div className="paper-title">{title}</div><div className="paper-instruction">{instruction}</div>{blocks.map((b,i)=><div key={b.id} className={"studio-block "+(active===b.id?"is-active":"")} onClick={()=>setActive(b.id)}><span className="block-index">{i+1}</span>{b.kind==="shape"?<div className={"shape-edit "+b.shape}><input value={b.text} onChange={e=>updateBlock(b.id,{text:e.target.value})} aria-label="نص الشكل"/></div>:<textarea value={b.text} onChange={e=>updateBlock(b.id,{text:e.target.value})} rows={Math.max(2,Math.ceil(b.text.length/55))} aria-label="محتوى العنصر"/>}{active===b.id&&<button className="remove-block" onClick={e=>{e.stopPropagation();setBlocks(old=>old.filter(x=>x.id!==b.id));}} aria-label="حذف العنصر"><Trash2 size={15}/></button>}</div>)}</div></div>
    <div className="studio-editor-help"><strong>تلميح:</strong> اختر عنصرًا من الورقة لتعديله. يمكنك إضافة جمل وتعليمات وأشكال متعددة، ثم معاينة ما سيراه التلميذ.</div>
   </section>
   <section className="studio-panel"><div className="studio-panel-head"><div><span>03</span><h2>أدوات تنسيق النص</h2></div><small>حدّد النص داخل عنصر ثم اختر التنسيق</small></div><div className="studio-toolbar format-tools"><button onClick={()=>format("underline")}><Underline size={16}/> تسطير</button><button onClick={()=>format("bold")}><CaseSensitive size={16}/> عريض</button><button onClick={()=>format("hiliteColor","#fff0a8")}><Highlighter size={16}/> تمييز</button><button onClick={()=>format("foreColor","#d14b4b")}>لون أحمر</button></div><div className="format-note">تعمل أدوات التنسيق عند تحديد نص داخل محرّر النص في الورقة. ويمكن استخدام الدائرة والمربع لتحديد مواضع خاصة في التمرين.</div></section>
  </>:<section className="studio-panel student-preview"><span className="subject-kicker">عرض التلميذ</span><h2>{title}</h2><p>{grade}</p><div className="student-instruction">{instruction}</div>{blocks.map((b,i)=><div className="student-block" key={b.id}>{b.kind==="shape"?<div className={"shape-edit "+b.shape}>{b.text}</div>:<div dangerouslySetInnerHTML={{__html:b.text}}/>}</div>)}</section>}
  {notice&&<div className="studio-notice" role="status">{notice}</div>}
  <section className="studio-panel"><div className="studio-panel-head"><div><span>04</span><h2>القاموس العربي</h2></div><BookOpen size={20}/></div><p className="studio-muted">ابحث عن كلمة للوصول إلى مدخلها ومعناها في ويكاموس العربي.</p><div className="dictionary-search"><input value={dict} onChange={e=>setDict(e.target.value)} onKeyDown={e=>e.key==="Enter"&&lookup()} placeholder="اكتب كلمة مثل: المدرسة"/><button onClick={lookup} disabled={dictBusy}>{dictBusy?"جارٍ البحث...":"ابحث"}</button></div>{dictError&&<p className="studio-error">{dictError}</p>}{dictResult&&<div className="dictionary-result"><strong>نتيجة البحث عن: {dict}</strong><p>{dictResult}</p><a href={"https://ar.wiktionary.org/wiki/"+encodeURIComponent(dict)} target="_blank" rel="noreferrer">فتح المدخل في ويكاموس</a></div>}</section>
  <section className="studio-panel"><div className="studio-panel-head"><div><span>05</span><h2>ورشة الإملاء والتصحيح</h2></div><Sparkles size={20}/></div><p className="studio-muted">اكتب النص النموذجي، ثم أدخل كتابة التلميذ ليقارنها النظام ويعرض مواضع الاختلاف والتصحيح المقترح.</p><label className="proof-label">النص النموذجي<textarea value={dictation} onChange={e=>setDictation(e.target.value)} rows={3}/></label><label className="proof-label">كتابة التلميذ<textarea value={studentText} onChange={e=>setStudentText(e.target.value)} rows={5} placeholder="يكتب التلميذ النص هنا..."/></label><button className="proof-button" onClick={proofread} disabled={reviewBusy||!studentText.trim()}><Sparkles size={17}/>{reviewBusy?"جارٍ مراجعة النص...":"مراجعة الكتابة بالذكاء الاصطناعي"}</button>{review&&<div className="proof-result"><h3><Check size={17}/> نتيجة المراجعة</h3><p className="corrected-text">{review.corrected}</p>{review.notes.map((n,i)=><p key={i} className="proof-note">{n}</p>)}</div>}</section>
 </main>;
}
