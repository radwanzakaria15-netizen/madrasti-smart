"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {ArrowRight,BookOpen,Calculator,CheckCircle2,Lightbulb,Volume2,RotateCcw,Trophy,Star,ArrowLeft,GraduationCap} from "lucide-react";

type Question={q:string;choices:string[];answer:string;hint:string;explain:string;visual?:string};
const lessons:Record<string,{title:string;subject:string;intro:string;questions:Question[]}> = {
 arabic_letters:{title:"الحروف الهجائية",subject:"العربية",intro:"تعرّف على الحروف وأصواتها من خلال أمثلة قصيرة.",questions:[
 {q:"أي حرف تبدأ به كلمة «بَيت»؟",choices:["ب","ت","ث"],answer:"ب",hint:"انطق كلمة بيت ببطء وانتبه إلى صوتها الأول.",explain:"كلمة «بيت» تبدأ بصوت حرف الباء."},
 {q:"اختر الكلمة التي تبدأ بحرف س.",choices:["سمكة","قمر","باب"],answer:"سمكة",hint:"ابحث عن الكلمة التي تسمع في بدايتها صوت السين.",explain:"كلمة «سمكة» تبدأ بحرف السين."},
 {q:"أي حرف يأتي بعد الألف؟",choices:["ج","ب","د"],answer:"ب",hint:"رتّب الحروف الأولى من الهجاء.",explain:"ترتيب البداية هو: أ، ب، ت، ث."}]},
 reading:{title:"القراءة والكلمات",subject:"العربية",intro:"اقرأ الكلمات واختر المعنى أو الكلمة المناسبة.",questions:[
 {q:"أكمل الجملة: أشرب الماء في ...",choices:["الكأس","الحذاء","الكتاب"],answer:"الكأس",hint:"فكّر في الشيء الذي نضع فيه الماء للشرب.",explain:"نشرب الماء في الكأس."},
 {q:"ما جمع كلمة «كتاب»؟",choices:["كاتب","كتب","مكتبة"],answer:"كتب",hint:"عندما يكون لدينا أكثر من كتاب نستخدم صيغة الجمع.",explain:"جمع كتاب هو كتب."},
 {q:"اختر الكلمة التي تدل على حيوان.",choices:["شجرة","أسد","كرسي"],answer:"أسد",hint:"ابحث عن اسم كائن حي يتحرك.",explain:"الأسد حيوان."}]},
 handwriting:{title:"الخط والكتابة",subject:"العربية",intro:"لاحظ شكل الحرف ثم اختر الكلمة المكتوبة بالحرف المطلوب.",questions:[
 {q:"أي كلمة تحتوي على حرف الباء في أولها؟",choices:["باب","دار","نور"],answer:"باب",hint:"حرف الباء له نقطة أسفل جسمه.",explain:"كلمة باب تبدأ بحرف الباء."},
 {q:"أين تقع نقطة حرف التاء؟",choices:["فوق الحرف","تحت الحرف","لا توجد نقطة"],answer:"فوق الحرف",hint:"قارن شكل التاء بالباء والثاء.",explain:"حرف التاء له نقطتان فوقه."},
 {q:"اختر الكلمة التي تنتهي بحرف الميم.",choices:["قلم","بيت","نور"],answer:"قلم",hint:"انظر إلى آخر حرف في كل كلمة.",explain:"آخر حرف في كلمة قلم هو الميم."}]},
 grammar:{title:"القواعد والتراكيب",subject:"العربية",intro:"اكتشف أنواع الكلمات وتدرّب على استعمالها.",questions:[
 {q:"أي كلمة تدل على فعل؟",choices:["كتب","كتاب","قلم"],answer:"كتب",hint:"الفعل يدل على حدث أو عمل.",explain:"«كتب» فعل يدل على حدث الكتابة."},
 {q:"في جملة «الشمس مشرقة»، ما نوع كلمة الشمس؟",choices:["اسم","فعل","حرف"],answer:"اسم",hint:"الشمس شيء نسمّيه، وليست حدثًا.",explain:"الشمس اسم، ومشرقة خبر."},
 {q:"اختر الفعل من الكلمات الآتية.",choices:["يلعب","ملعب","لاعب"],answer:"يلعب",hint:"ابحث عن كلمة تدل على حدوث اللعب.",explain:"«يلعب» فعل مضارع."}]},
 arabic_quiz:{title:"تقييم اللغة العربية",subject:"العربية",intro:"أجب عن الأسئلة لتراجع ما تعلمته.",questions:[
 {q:"ما الحرف الأول من كلمة «مدرسة»؟",choices:["م","د","ر"],answer:"م",hint:"اقرأ الكلمة من اليمين إلى اليسار.",explain:"تبدأ كلمة مدرسة بحرف الميم."},
 {q:"أي كلمة هي فعل؟",choices:["يجري","نهر","ماء"],answer:"يجري",hint:"الفعل يدل على حدث.",explain:"يجري فعل مضارع."},
 {q:"ما جمع كلمة «قلم»؟",choices:["أقلام","قلمان","قالم"],answer:"أقلام",hint:"فكر في صيغة الجمع الشائعة.",explain:"جمع قلم هو أقلام."}]},
 harakat:{title:"الحركات والتشكيل",subject:"العربية",intro:"تعرّف على الحركات القصيرة وعلامات التشكيل من خلال أمثلة.",questions:[
 {q:"ما الحركة التي نسمعها في الحرف «بَ»؟",choices:["الفتحة","الضمة","الكسرة"],answer:"الفتحة",hint:"تأتي الفتحة فوق الحرف.",explain:"الفتحة علامة توضع فوق الحرف وتدل على صوت قصير مفتوح."},
 {q:"أي مقطع يحمل صوت الضمة؟",choices:["بِ","بُ","بَ"],answer:"بُ",hint:"الضمة تشبه واوًا صغيرة فوق الحرف.",explain:"المقطع «بُ» يحمل صوت الضمة."},
 {q:"ما العلامة التي تدل على مضاعفة صوت الحرف؟",choices:["السكون","الشدة","التنوين"],answer:"الشدة",hint:"تُكتب فوق الحرف وتدل على تشديده.",explain:"الشدة تدل على أن الحرف مشدد."}]},
 dictation:{title:"الإملاء والتصحيح",subject:"العربية",intro:"تدرّب على اختيار الكتابة الصحيحة ومراجعة الأخطاء الإملائية.",questions:[
 {q:"اختر الكتابة الصحيحة للكلمة.",choices:["مدرسة","مدرصة","مدرثه"],answer:"مدرسة",hint:"تذكّر أن الكلمة تنتهي بتاء مربوطة.",explain:"الكتابة الصحيحة هي «مدرسة»."},
 {q:"أي جملة كُتبت بصورة صحيحة؟",choices:["ذهب أحمد إلى المدرسة.","ذهب احمد الى المدرسه.","ذهب أحمد الى المدرسه."],answer:"ذهب أحمد إلى المدرسة.",hint:"انتبه إلى الهمزة والتاء المربوطة.",explain:"نكتب «أحمد» بهمزة قطع، و«إلى» بهمزة، و«المدرسة» بتاء مربوطة."},
 {q:"ما أفضل خطوة بعد كتابة فقرة؟",choices:["مراجعتها وتصحيحها","تركها دون قراءة","حذف علامات الترقيم"],answer:"مراجعتها وتصحيحها",hint:"اقرأ النص مرة أخرى وابحث عن الأخطاء.",explain:"مراجعة النص تساعد على اكتشاف الأخطاء الإملائية واللغوية."}]},
 parts_of_speech:{title:"أقسام الكلام",subject:"العربية",intro:"ميّز بين الاسم والفعل والحرف في أمثلة متنوعة.",questions:[
 {q:"ما نوع كلمة «حديقة»؟",choices:["اسم","فعل","حرف"],answer:"اسم",hint:"إنها تسمّي مكانًا.",explain:"«حديقة» اسم لأنها تدل على شيء."},
 {q:"ما نوع كلمة «يكتب»؟",choices:["اسم","فعل","حرف"],answer:"فعل",hint:"تدل على عمل يحدث.",explain:"«يكتب» فعل مضارع."},
 {q:"ما نوع كلمة «في»؟",choices:["اسم","فعل","حرف"],answer:"حرف",hint:"تربط الكلمات وتفيد معنى مع غيرها.",explain:"«في» حرف جر."}]},
 gender:{title:"المذكر والمؤنث",subject:"العربية",intro:"تدرّب على التمييز بين الاسم المذكر والاسم المؤنث.",questions:[
 {q:"أي كلمة مؤنثة؟",choices:["قلم","شجرة","كتاب"],answer:"شجرة",hint:"لاحظ علامة التاء المربوطة.",explain:"«شجرة» اسم مؤنث."},
 {q:"ما مؤنث كلمة «معلم»؟",choices:["معلمة","معلمون","تعليم"],answer:"معلمة",hint:"نضيف غالبًا تاء مربوطة في هذا المثال.",explain:"مؤنث «معلم» هو «معلمة»."},
 {q:"أي كلمة مذكرة؟",choices:["نافذة","زهرة","باب"],answer:"باب",hint:"اختر اسمًا لا يدل على مؤنث.",explain:"«باب» اسم مذكر."}]},
 dual:{title:"المفرد والمثنى",subject:"العربية",intro:"حوّل الاسم من المفرد إلى المثنى وتعرّف على صيغته.",questions:[
 {q:"ما مثنى كلمة «كتاب»؟",choices:["كتابان","كتب","كاتب"],answer:"كتابان",hint:"المثنى يدل على اثنين.",explain:"مثنى كتاب في حالة الرفع «كتابان»."},
 {q:"أي كلمة تدل على اثنين؟",choices:["طالب","طالبان","طلاب"],answer:"طالبان",hint:"ابحث عن علامة الألف والنون.",explain:"«طالبان» مثنى يدل على طالبين."},
 {q:"ما مفرد كلمة «قلمان»؟",choices:["قلم","أقلام","قلمان"],answer:"قلم",hint:"أعد الكلمة إلى شيء واحد.",explain:"مفرد «قلمان» هو «قلم»."}]},
 numbers:{title:"الأعداد والأرقام",subject:"الرياضيات",intro:"تدرّب على العدّ وترتيب الأعداد ومقارنتها.",questions:[
 {q:"ما العدد الذي يأتي بعد 7؟",choices:["6","8","9"],answer:"8",hint:"عدّ تصاعديًا ابتداءً من سبعة.",explain:"بعد 7 يأتي العدد 8."},
 {q:"أي عدد أكبر؟",choices:["12","9","5"],answer:"12",hint:"قارن الأعداد بحسب قيمتها.",explain:"12 أكبر من 9 و5."},
 {q:"كم وحدة في العدد 14؟",choices:["4","1","14"],answer:"4",hint:"انظر إلى منزلة الآحاد.",explain:"في العدد 14 أربع وحدات وعشرة واحدة."}]},
 addition_subtraction:{title:"الجمع والطرح",subject:"الرياضيات",intro:"استخدم العدّ لفهم الجمع والطرح خطوة بخطوة.",questions:[
 {q:"كم يساوي 5 + 3؟",choices:["7","8","9"],answer:"8",hint:"ابدأ من 5 وأضف ثلاث خطوات.",explain:"5 + 3 = 8."},
 {q:"كم يساوي 9 − 4؟",choices:["4","5","6"],answer:"5",hint:"ابدأ من 9 وارجع أربع خطوات.",explain:"9 − 4 = 5."},
 {q:"لدى سلمى 6 تفاحات وأعطت صديقتها 2. كم بقي؟",choices:["3","4","8"],answer:"4",hint:"عندما نعطي بعض الأشياء ينقص العدد.",explain:"6 − 2 = 4 تفاحات."}]},
 multiplication:{title:"الضرب والقسمة",subject:"الرياضيات",intro:"افهم الضرب على أنه مجموعات متساوية، ثم جرّب.",questions:[
 {q:"كم يساوي 3 × 2؟",choices:["5","6","8"],answer:"6",hint:"اجمع 2 ثلاث مرات.",explain:"2 + 2 + 2 = 6، إذن 3 × 2 = 6."},
 {q:"كم يساوي 4 × 3؟",choices:["7","12","16"],answer:"12",hint:"أربع مجموعات في كل واحدة ثلاثة.",explain:"3 + 3 + 3 + 3 = 12."},
 {q:"وزّع 10 حبات بالتساوي على مجموعتين. كم في كل مجموعة؟",choices:["4","5","6"],answer:"5",hint:"القسمة تعني التوزيع بالتساوي.",explain:"10 ÷ 2 = 5."}]},
 word_problems:{title:"حلّ المسائل",subject:"الرياضيات",intro:"اقرأ المسألة، حدّد المطلوب، ثم اختر العملية المناسبة.",questions:[
 {q:"مع ليلى 4 أقلام واشترت قلمين. كم قلمًا أصبح معها؟",choices:["5","6","7"],answer:"6",hint:"اشترت أقلامًا إضافية، هل نستخدم الجمع أم الطرح؟",explain:"4 + 2 = 6 أقلام."},
 {q:"في الحافلة 8 ركاب، نزل 3. كم بقي؟",choices:["5","6","11"],answer:"5",hint:"عدد الركاب نقص بعد النزول.",explain:"8 − 3 = 5 ركاب."},
 {q:"لدى المعلم 3 علب، في كل علبة 4 أقلام. كم قلمًا لديه؟",choices:["7","12","9"],answer:"12",hint:"هناك مجموعات متساوية؛ استخدم الضرب.",explain:"3 × 4 = 12 قلمًا."}]},
 math_quiz:{title:"تقييم الرياضيات",subject:"الرياضيات",intro:"اختبر فهمك في الحساب والأعداد والمسائل.",questions:[
 {q:"كم يساوي 10 − 4؟",choices:["5","6","7"],answer:"6",hint:"ارجع أربع خطوات من العدد عشرة.",explain:"10 − 4 = 6."},
 {q:"ما العدد الأكبر؟",choices:["18","8","13"],answer:"18",hint:"قارن منزلة العشرات أولًا.",explain:"18 أكبر من 13 و8."},
 {q:"كم يساوي 5 × 2؟",choices:["7","10","12"],answer:"10",hint:"اجمع العدد 2 خمس مرات.",explain:"5 × 2 = 10."}]}
};
const fallback=lessons.addition_subtraction;
export default function Activities(){
 const params=useSearchParams();const skill=params.get("skill")||"addition_subtraction";const lesson=lessons[skill]||fallback;
 const [index,setIndex]=useState(0);const [choice,setChoice]=useState("");const [checked,setChecked]=useState(false);const [hint,setHint]=useState(false);const [score,setScore]=useState(0);const [finished,setFinished]=useState(false);
 const question=lesson.questions[index];const progress=finished?100:((index+(checked?1:0))/lesson.questions.length)*100;const correct=choice===question.answer;
 function speak(){if(typeof window!=="undefined"&&"speechSynthesis"in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(question.q);u.lang="ar-SA";window.speechSynthesis.speak(u);}}
 async function next(){if(!checked)return;if(index===lesson.questions.length-1){setFinished(true);return;}setIndex(v=>v+1);setChoice("");setChecked(false);setHint(false);}
 function restart(){setIndex(0);setChoice("");setChecked(false);setHint(false);setScore(0);setFinished(false);}
 async function check(){if(!choice||checked)return;setChecked(true);if(correct)setScore(v=>v+1);try{await fetch("/api/assessment",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject:lesson.subject==="الرياضيات"?"math":"arabic",skill,question:question.q,answer:choice,correct})});}catch{}}
 return <main className="learn-page">
 <header className="learn-header"><Link href="/" className="learn-back"><ArrowRight size={17}/> لوحة الأستاذ</Link><div className="learn-brand"><span><GraduationCap size={20}/></span> مَدْرَسَتي الذكية</div></header>
 <div className="learn-breadcrumb"><span>{lesson.subject}</span><ArrowLeft size={14}/><span>{lesson.title}</span></div>
 <section className="learn-hero"><div><span className="learn-kicker">مساحة التعلّم التفاعلي</span><h1>{lesson.title}</h1><p>{lesson.intro}</p></div><div className="learn-hero-icon">{lesson.subject==="العربية"?<BookOpen size={48}/>:<Calculator size={48}/>}</div></section>
 <div className="learn-progress-row"><span>تقدّم النشاط</span><strong>{finished?lesson.questions.length: index+1} / {lesson.questions.length}</strong></div><div className="learn-progress"><span style={{width:progress+"%"}}/></div>
 {!finished?<section className="learn-card"><div className="learn-card-top"><span className="learn-step">السؤال {index+1}</span><button className="learn-icon-button" onClick={speak} aria-label="استمع إلى السؤال"><Volume2 size={18}/> استمع للسؤال</button></div>
 <h2>{question.q}</h2><div className="learn-choices">{question.choices.map((c,i)=><button key={c} disabled={checked} className={"learn-choice "+(choice===c?"selected ":"")+(checked&&c===question.answer?"right ":"")+(checked&&choice===c&&!correct?"wrong":"")} onClick={()=>setChoice(c)}><span className="choice-letter">{["أ","ب","ج"][i]}</span>{c}{checked&&c===question.answer&&<CheckCircle2 size={19}/>}</button>)}</div>
 <div className="learn-controls"><button className="learn-hint" onClick={()=>setHint(v=>!v)}><Lightbulb size={17}/> {hint?"إخفاء التلميح":"أعطني تلميحًا"}</button>{!checked?<button className="learn-primary" disabled={!choice} onClick={check}>تحقّق من إجابتي <ArrowLeft size={17}/></button>:<button className="learn-primary" onClick={next}>{index===lesson.questions.length-1?"عرض النتيجة":"السؤال التالي"} <ArrowLeft size={17}/></button>}</div>
 {hint&&<div className="learn-hint-box"><Lightbulb size={18}/><p>{question.hint}</p></div>}
 {checked&&<div className={"learn-feedback "+(correct?"success":"try-again")}><div className="feedback-title">{correct?<CheckCircle2 size={19}/>:<Lightbulb size={19}/>} {correct?"أحسنت! إجابة صحيحة":"محاولة جيدة، لنتعلّم معًا"}</div><p>{question.explain}</p></div>}
 </section>:<section className="learn-card learn-result"><div className="result-icon"><Trophy size={42}/></div><span className="learn-kicker">اكتمل النشاط</span><h2>أحسنت، لقد أنهيت التمرين!</h2><div className="result-score"><strong>{score}</strong><span>من {lesson.questions.length}</span></div><p>{score===lesson.questions.length?"رائع! أتقنت جميع الأسئلة.":score>=2?"عمل جيد! راجع السؤال الذي أخطأت فيه وحاول مجددًا.":"بداية موفقة! أعد النشاط لتتدرّب أكثر."}</p><button className="learn-primary" onClick={restart}><RotateCcw size={17}/> أعد التمرين</button></section>}
 <footer className="learn-footer"><Star size={15}/> تعلّم خطوة بخطوة، فالخطأ فرصة للفهم والتقدّم.</footer>
 </main>;
}
