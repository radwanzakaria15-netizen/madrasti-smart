import Link from "next/link";
const data:any={
 arabic:{title:"اللغة العربية",desc:"نتعلم الحروف والكلمات والكتابة والقواعد خطوة خطوة.",items:[["الحروف","تعرف إلى الحروف وأصواتها","أ ب ت","/activities?skill=arabic_letters"],["الخط والكتابة","تدرب على رسم الحروف","✍","/activities?skill=handwriting"],["القواعد","قواعد مبسطة وأمثلة","نحو","/activities?skill=grammar"],["الاختبارات","اختبر ما تعلمته","✓","/activities?skill=arabic_quiz"]]},
 math:{title:"الرياضيات",desc:"اكتشف الأرقام وتعلم الحساب من خلال أنشطة مرئية.",items:[["الأرقام","تعلم الأعداد والعد","١٢٣","/activities?skill=numbers"],["جدول الضرب","تدرب على الجداول تدريجيًا","×","/activities?skill=multiplication"],["العمليات الحسابية","الجمع والطرح والضرب والقسمة","+ −","/activities?skill=operations"],["المسائل","حل مسائل من الحياة اليومية","؟","/activities?skill=word_problems"],["الامتحانات","اختبارات حسب المستوى","✓","/activities?skill=math_quiz"]]}
};
export default async function Subject({params}:{params:Promise<{subject:string}>}) {
 const {subject}=await params; const d=data[subject]; if(!d)return <main className="shell"><Link href="/">العودة</Link><h1>المادة غير موجودة</h1></main>;
 return <main className="shell"><header className="topbar"><Link href="/" className="pill">← لوحة الأستاذ</Link><div className="brand">مَدْرَسَتي الذكية</div></header><section className="hero"><div><h1>{d.title}</h1><p>{d.desc}</p></div><div className="hero-art">{subject==="arabic"?"أ ب ت":"١٢٣"}</div></section><h2 className="section-title">الأقسام التعليمية</h2><div className="cards">{d.items.map((it:string[],i:number)=><Link href={it[3]} className="lesson" key={i}><div className="art">{it[2]}</div><h3>{it[0]}</h3><p>{it[1]}</p></Link>)}</div></main>;
}
