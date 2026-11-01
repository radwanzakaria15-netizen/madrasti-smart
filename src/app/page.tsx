import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Home as HomeIcon, BookOpen, Calculator, Users, Target, Trophy,
  GraduationCap, Sparkles, ChartNoAxesColumnIncreasing, Pencil,
  Palette, Rocket, Lightbulb, Plus, ArrowLeft, ArrowUpRight,
  Sun, Cloud, Star, School
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: students } = await supabase.from("students").select("id", { count: "exact" });
  const { data: results } = await supabase.from("assessment_results").select("id,score");
  const avg = results?.length ? Math.round(results.reduce((s,r)=>s+(r.score ?? 0),0)/results.length) : 0;
  return <main className="dashboard-shell">
    <aside className="sidebar">
      <Link href="/" className="brand sidebar-brand"><span className="brandmark">م</span><span>مَدْرَسَتي <small>الذكية</small></span></Link>
      <div className="side-caption">مساحة الأستاذ</div>
      <nav className="side-nav">
        <Link className="side-link active" href="/"><HomeIcon aria-hidden="true"/> الرئيسية</Link>
        <Link className="side-link" href="/subjects/arabic"><BookOpen aria-hidden="true"/> اللغة العربية</Link>
        <Link className="side-link" href="/subjects/math"><Calculator aria-hidden="true"/> الرياضيات</Link>
        <Link className="side-link" href="/students"><Users aria-hidden="true"/> تلاميذي</Link>
        <Link className="side-link" href="/activities"><Target aria-hidden="true"/> الأنشطة والألعاب</Link>
        <Link className="side-link" href="/reports"><Trophy aria-hidden="true"/> النتائج والتقارير</Link>
      </nav>
      <div className="sidebar-note"><div className="note-stars"><Sparkles size={19}/></div><strong>كل طفل يستطيع أن يبدع!</strong><p>نحو تعلّم ممتع، مليء بالفضول والإنجاز.</p><span className="note-mascot"><GraduationCap size={39}/></span></div>
      <div className="sidebar-foot">مَدْرَسَتي الذكية · نسخة الأستاذ</div>
    </aside>
    <section className="dashboard-main">
      <header className="dashboard-topbar"><div><div className="eyebrow">أهلًا بك في عالم التعلّم الممتع</div><div className="page-heading">لوحة الأستاذ</div></div><div className="teacher-chip"><span className="teacher-avatar"><GraduationCap size={22}/></span><span><strong>فضاء الأستاذ</strong><small>إدارة الفصل والتعلّم</small></span></div></header>
      <section className="welcome-banner">
        <div className="welcome-copy"><span className="welcome-tag"><Sparkles size={15}/> نكتشف، نتعلّم، ننجح</span><h1>مرحبًا بك في مَدْرَسَتي الذكية!</h1><p>هنا تتحول الدروس إلى مغامرات ممتعة. اختر المادة، حضّر نشاطًا شيقًا، وتابع رحلة أبطالك الصغار نحو النجاح.</p><div className="actions"><Link className="btn" href="/activities">اكتشف الأنشطة <ArrowLeft size={16}/></Link><Link className="banner-link" href="/students">إدارة التلاميذ</Link></div></div>
        <div className="welcome-illustration" aria-hidden="true"><div className="sun-shape"><Sun size={38}/></div><div className="book-shape"><BookOpen size={54}/></div><div className="mascot"><School size={62}/></div><span className="sparkle sparkle-a"><Star size={21}/></span><span className="sparkle sparkle-b"><Sparkles size={22}/></span><span className="cloud cloud-a"><Cloud size={34}/></span></div>
      </section>
      <div className="section-heading"><div><div className="eyebrow">أرقام وإنجازات الفصل</div><h2>رحلة التعلّم بالأرقام <ChartNoAxesColumnIncreasing size={18}/></h2></div><span className="subtle-label">تتحدّث تلقائيًا من بيانات المنصة</span></div>
      <section className="stats">
        <div className="stat stat-students"><div className="stat-top"><span className="stat-icon"><Users size={20}/></span><span className="stat-trend">فصلك الجميل</span></div><strong>{students?.length ?? 0}</strong><span>التلاميذ المسجلون</span></div>
        <div className="stat stat-results"><div className="stat-top"><span className="stat-icon"><Pencil size={20}/></span><span className="stat-trend">محاولات التعلّم</span></div><strong>{results?.length ?? 0}</strong><span>التقييمات المنجزة</span></div>
        <div className="stat stat-average"><div className="stat-top"><span className="stat-icon"><Star size={20}/></span><span className="stat-trend">متوسط الفصل</span></div><strong>{avg}%</strong><span>متوسط النتائج المسجلة</span></div>
        <div className="stat stat-subjects"><div className="stat-top"><span className="stat-icon"><Palette size={20}/></span><span className="stat-trend">جاهزة للاكتشاف</span></div><strong>02</strong><span>المواد التعليمية النشطة</span></div>
      </section>
      <div className="section-heading subjects-heading"><div><div className="eyebrow">هيا نبدأ المغامرة!</div><h2>ماذا سنتعلّم اليوم؟ <Rocket size={18}/></h2></div><span className="subtle-label">اختر عالمًا من عوالم المعرفة</span></div>
      <section className="grid">
        <Link href="/subjects/arabic" className="subject arabic"><div className="subject-decoration">أ</div><div className="subject-top"><span className="subject-icon"><BookOpen size={27}/></span><span className="subject-arrow"><ArrowUpRight size={19}/></span></div><div className="subject-label">عالم الكلمات والحروف</div><h3>اللغة العربية</h3><p>نقرأ الحروف، نكتشف الكلمات، نتدرّب على الكتابة ونتقن القواعد.</p><div className="subject-bottom"><span>لنبدأ التعلّم</span><ArrowLeft size={16}/></div></Link>
        <Link href="/subjects/math" className="subject math"><div className="subject-decoration">＋</div><div className="subject-top"><span className="subject-icon"><Calculator size={27}/></span><span className="subject-arrow"><ArrowUpRight size={19}/></span></div><div className="subject-label">عالم الأرقام والألغاز</div><h3>الرياضيات</h3><p>نلعب بالأرقام، نتقن العمليات، ونحلّ المسائل مثل الأبطال.</p><div className="subject-bottom"><span>لنبدأ التعلّم</span><ArrowLeft size={16}/></div></Link>
      </section>
      <section className="quick-panel"><div className="quick-intro"><span className="quick-symbol"><Lightbulb size={21}/></span><div><h3>مهمتك القادمة يا أستاذ!</h3><p>حضّر تجربة تعليمية جميلة واجعل كل تلميذ يشارك ويتألّق.</p></div></div><div className="quick-actions"><Link href="/students"><Plus size={14}/> إضافة تلميذ</Link><Link href="/activities"><Target size={14}/> إنشاء نشاط</Link><Link href="/reports"><Trophy size={14}/> متابعة النتائج</Link></div></section>
      <footer className="dashboard-footer">مَدْرَسَتي الذكية <Sparkles size={13}/> نتعلّم بمرح، ونكبر بالمعرفة</footer>
    </section>
  </main>;
}
