import Link from "next/link";
import { BookOpen, PencilLine, SpellCheck, ClipboardCheck, Hash, X, Calculator, FileQuestion, ArrowRight, Home, GraduationCap, ALargeSmall, AudioLines, Languages, CaseSensitive, Sparkles, FileText, AlignLeft, ListChecks } from "lucide-react";

type Item={title:string;desc:string;icon:React.ReactNode;href:string;tag:string};
type SubjectData={title:string;desc:string;intro:string;items:Item[];};
const data:Record<string,SubjectData>={
 arabic:{title:"اللغة العربية",desc:"مساحة متكاملة لتعليم القراءة والكتابة والإملاء والقواعد، خطوة بخطوة.",intro:"اختر المجال التعليمي، ثم انتقل إلى المهارة التي تريد تدريب التلاميذ عليها.",items:[
 {title:"الحروف وأشكالها",desc:"تعلّم شكل الحرف في بداية الكلمة ووسطها ونهايتها، والتعرّف على صوته.",icon:<ALargeSmall/>,href:"/activities?skill=arabic_letters",tag:"الحرف وأشكاله"},
 {title:"الحركات والتشكيل",desc:"الفتحة والضمة والكسرة والسكون والشدة والتنوين مع أمثلة وتدريبات.",icon:<AudioLines/>,href:"/activities?skill=harakat",tag:"الضبط والنطق"},
 {title:"الإملاء والتصحيح",desc:"التدرّب على كتابة الكلمات والجمل والفقرات والنصوص، ومراجعة الأخطاء.",icon:<SpellCheck/>,href:"/activities?skill=dictation",tag:"الكتابة السليمة"},
 {title:"أقسام الكلام",desc:"تمييز الاسم والفعل والحرف داخل الكلمات والجمل.",icon:<Languages/>,href:"/activities?skill=parts_of_speech",tag:"أساسيات اللغة"},
 {title:"المذكر والمؤنث",desc:"التعرّف على علامات التذكير والتأنيث والتمييز بينهما.",icon:<CaseSensitive/>,href:"/activities?skill=gender",tag:"بناء الكلمات"},
 {title:"المفرد والمثنى",desc:"فهم المفرد والمثنى وكيفية تحويل الاسم من مفرد إلى مثنى.",icon:<ListChecks/>,href:"/activities?skill=dual",tag:"التثنية"},
 {title:"القراءة والكلمات",desc:"قراءة الكلمات وفهم معانيها واستعمالها في جمل مفيدة.",icon:<BookOpen/>,href:"/activities?skill=reading",tag:"الفهم القرائي"},
 {title:"تعليم كتابة الحرف",desc:"تدرّب على رسم الحرف خطوة بخطوة، مع الانتباه إلى اتجاه الكتابة والنقاط.",icon:<PencilLine/>,href:"/activities?skill=handwriting",tag:"مهارات الكتابة"},
 {title:"التقييمات",desc:"اختبارات قصيرة تجمع المهارات التي تعلمها التلميذ.",icon:<ClipboardCheck/>,href:"/activities?skill=arabic_quiz",tag:"قياس التعلّم"}
 ]},
 math:{title:"الرياضيات",desc:"نكتشف عالم الأعداد ونفهم العمليات ونحلّ المسائل خطوة بخطوة.",intro:"اختر المجال الرياضي الذي تريد تدريسه.",items:[
 {title:"الأعداد والأرقام",desc:"التعرّف على الأعداد والعدّ والمقارنة والترتيب.",icon:<Hash/>,href:"/activities?skill=numbers",tag:"أساسيات الأعداد"},
 {title:"الجمع والطرح",desc:"فهم الجمع والطرح والتدرّب على المسائل البسيطة.",icon:<Calculator/>,href:"/activities?skill=addition_subtraction",tag:"العمليات الأساسية"},
 {title:"الضرب والقسمة",desc:"اكتشاف معنى الضرب والقسمة والتدرّب عليهما.",icon:<X/>,href:"/activities?skill=multiplication",tag:"الحساب"},
 {title:"حلّ المسائل",desc:"توظيف العمليات الحسابية في مواقف من الحياة اليومية.",icon:<FileQuestion/>,href:"/activities?skill=word_problems",tag:"التفكير الرياضي"},
 {title:"التقييمات",desc:"تمارين متنوعة لمتابعة مستوى التلميذ.",icon:<ClipboardCheck/>,href:"/activities?skill=math_quiz",tag:"قياس التعلّم"}
 ]}
};
export default async function Subject({params}:{params:Promise<{subject:string}>}) {
 const {subject}=await params; const d=data[subject];
 if(!d)return <main className="subject-page"><Link href="/" className="subject-back"><Home size={17}/> العودة إلى لوحة الأستاذ</Link><h1>المادة غير موجودة</h1></main>;
 return <main className="subject-page">
  <header className="subject-header"><Link href="/" className="subject-back"><ArrowRight size={17}/> لوحة الأستاذ</Link><div className="subject-header-actions"><Link href="/teacher/arabic-studio" className="subject-back"><PenLine size={16}/> استوديو الأستاذ</Link><Link href="/teacher/exercises" className="subject-back"><Sparkles size={16}/> إدارة التمارين</Link><div className="subject-brand"><span><GraduationCap size={20}/></span> مَدْرَسَتي الذكية</div></div></header>
  <section className={`subject-hero ${subject}`}><div className="subject-hero-copy"><span className="subject-kicker">فضاء التعلّم</span><h1>{d.title}</h1><p>{d.desc}</p></div><div className="subject-hero-icon">{subject==="arabic"?<BookOpen size={66}/>:<Calculator size={66}/>}</div></section>
  <div className="subject-section-head"><div><span>محتوى المادة</span><h2>الأقسام التعليمية</h2><p>{d.intro}</p></div><span className="subject-count">{d.items.length} أقسام</span></div>
  <section className="subject-grid">{d.items.map((it,i)=><Link href={it.href} className="subject-tile" key={it.title}><div className="subject-tile-top"><span className="subject-tile-icon">{it.icon}</span><span className="subject-tile-number">{String(i+1).padStart(2,"0")}</span></div><span className="subject-tile-tag">{it.tag}</span><h3>{it.title}</h3><p>{it.desc}</p><span className="subject-tile-link">فتح القسم <ArrowRight size={16}/></span></Link>)}</section>
  {subject==="arabic"&&<section className="arabic-tools"><div className="arabic-tools-heading"><Sparkles size={20}/><div><h2>ورشة الإملاء</h2><p>مساحة مخصصة للتدرب على كتابة نصوص بمستويات مختلفة.</p></div></div><div className="dictation-types"><div><FileText/><strong>كلمة</strong><span>تدريب على كتابة كلمة صحيحة</span></div><div><PencilLine/><strong>جملة</strong><span>كتابة جملة مع مراعاة القواعد</span></div><div><AlignLeft/><strong>فقرة ونص</strong><span>تنظيم الأفكار ومراجعة الكتابة</span></div><div><SpellCheck/><strong>تصحيح الأخطاء</strong><span>مراجعة النص وتحديد مواضع الخطأ</span></div></div><p className="dictation-note">ملاحظة: أنشطة الإملاء التفاعلية الحالية تدريبية. توليد المحتوى والتصحيح بالذكاء الاصطناعي يحتاجان إلى ربط خدمة ذكاء اصطناعي آمنة من جهة الخادم.</p></section>}
 </main>;
}
