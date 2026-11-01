import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: students } = await supabase.from("students").select("id", { count: "exact" });
  const { data: results } = await supabase.from("assessment_results").select("id,score");
  const avg = results?.length ? Math.round(results.reduce((s,r)=>s+(r.score ?? 0),0)/results.length) : 0;
  return <main className="shell">
    <header className="topbar"><div className="brand"><div className="brandmark">م</div> مَدْرَسَتي الذكية</div><div className="pill">لوحة الأستاذ · مساحة خاصة</div></header>
    <section className="hero"><div><h1>مرحبًا بك في فصلك الذكي</h1><p>علّم، تابع، واكتشف قدرات كل تلميذ. أدواتك التعليمية في مكان واحد.</p><div className="actions" style={{marginTop:20}}><Link className="btn" href="/students">إدارة التلاميذ</Link><Link className="btn secondary" href="/reports">تقارير التقدم</Link></div></div><div className="hero-art">📚</div></section>
    <div className="stats">
      <div className="stat"><strong>{students?.length ?? 0}</strong><span>التلاميذ المسجلون</span></div>
      <div className="stat"><strong>{results?.length ?? 0}</strong><span>محاولات التقييم</span></div>
      <div className="stat"><strong>{avg}%</strong><span>متوسط النتائج المسجلة</span></div>
      <div className="stat"><strong>02</strong><span>المواد النشطة في المرحلة الأولى</span></div>
    </div>
    <h2 className="section-title">المواد التعليمية</h2>
    <div className="grid">
      <Link href="/subjects/arabic" className="subject arabic"><div className="art">أ ب ت</div><h3>اللغة العربية</h3><p>الحروف · الخط والكتابة · القواعد · الاختبارات</p></Link>
      <Link href="/subjects/math" className="subject math"><div className="art">١٢٣</div><h3>الرياضيات</h3><p>الأرقام · جدول الضرب · العمليات · المسائل · الاختبارات</p></Link>
    </div>
    <section className="panel"><h2 style={{marginTop:0}}>ماذا يمكنك أن تفعل؟</h2><div className="actions"><Link className="btn ghost" href="/students">إضافة تلميذ</Link><Link className="btn ghost" href="/activities">تجربة نشاط تعليمي</Link><Link className="btn ghost" href="/reports">عرض تقارير الأداء</Link></div></section>
  </main>;
}
