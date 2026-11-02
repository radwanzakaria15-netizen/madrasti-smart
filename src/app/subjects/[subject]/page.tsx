import Link from "next/link";
import { BookOpen, PencilLine, SpellCheck, ClipboardCheck, Hash, X, Calculator, Brain, FileQuestion, ArrowRight, Home, GraduationCap } from "lucide-react";

const data: Record<string, {title:string;desc:string;intro:string;items:{title:string;desc:string;icon:React.ReactNode;href:string;tag:string}[]}> = {
 arabic:{title:"اللغة العربية",desc:"رحلة ممتعة لاكتشاف الحروف والكلمات والقراءة والكتابة.",intro:"اختر المهارة التي تريد العمل عليها مع تلاميذك",items:[
 {title:"الحروف الهجائية",desc:"التعرّف على الحروف وأشكالها وأصواتها.",icon:<BookOpen/>,href:"/activities?skill=arabic_letters",tag:"القراءة والتعرّف"},
 {title:"القراءة والكلمات",desc:"قراءة المقاطع والكلمات وبناء جمل قصيرة.",icon:<SpellCheck/>,href:"/activities?skill=reading",tag:"مهارات القراءة"},
 {title:"الخط والكتابة",desc:"التدرّب على كتابة الحروف والكلمات بوضوح.",icon:<PencilLine/>,href:"/activities?skill=handwriting",tag:"التعبير الكتابي"},
 {title:"القواعد والتراكيب",desc:"قواعد مبسطة مع أمثلة وتطبيقات مناسبة للمستوى.",icon:<Brain/>,href:"/activities?skill=grammar",tag:"الفهم والتطبيق"},
 {title:"التقييمات",desc:"أسئلة قصيرة لقياس مدى استيعاب الدروس.",icon:<ClipboardCheck/>,href:"/activities?skill=arabic_quiz",tag:"قياس التعلّم"}
 ]},
 math:{title:"الرياضيات",desc:"نكتشف عالم الأعداد ونفهم العمليات ونحلّ المسائل خطوة بخطوة.",intro:"اختر المجال الرياضي الذي تريد تدريسه",items:[
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
  <header className="subject-header"><Link href="/" className="subject-back"><ArrowRight size={17}/> لوحة الأستاذ</Link><div className="subject-brand"><span><GraduationCap size={20}/></span> مَدْرَسَتي الذكية</div></header>
  <section className={`subject-hero ${subject}`}><div className="subject-hero-copy"><span className="subject-kicker">فضاء التعلّم</span><h1>{d.title}</h1><p>{d.desc}</p></div><div className="subject-hero-icon">{subject==="arabic"?<BookOpen size={66}/>:<Calculator size={66}/>}</div></section>
  <div className="subject-section-head"><div><span>محتوى المادة</span><h2>الأقسام التعليمية</h2><p>{d.intro}</p></div><span className="subject-count">{d.items.length} أقسام</span></div>
  <section className="subject-grid">{d.items.map((it,i)=><Link href={it.href} className="subject-tile" key={it.title}><div className="subject-tile-top"><span className="subject-tile-icon">{it.icon}</span><span className="subject-tile-number">{String(i+1).padStart(2,"0")}</span></div><span className="subject-tile-tag">{it.tag}</span><h3>{it.title}</h3><p>{it.desc}</p><span className="subject-tile-link">فتح القسم <ArrowRight size={16}/></span></Link>)}</section>
 </main>;
}
