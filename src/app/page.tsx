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
  return <main className="dashboard-shell">
    <aside className="sidebar">
      <Link href="/" className="brand sidebar-brand"><span className="brandmark">م</span><span>مَدْرَسَتي <small>الذكية</small></span></Link>
      <div className="side-caption">مساحة الأستاذ</div>
      <nav className="side-nav">
        <Link className="side-link active" href="/"><span>🏠</span> الرئيسية</Link>
        <Link className="side-link" href="/subjects/arabic"><span>📚</span> اللغة العربية</Link>
        <Link className="side-link" href="/subjects/math"><span>🔢</span> الرياضيات</Link>
        <Link className="side-link" href="/students"><span>🧒</span> تلاميذي</Link>
        <Link className="side-link" href="/activities"><span>🎯</span> الأنشطة والألعاب</Link>
        <Link className="side-link" href="/reports"><span>🏆</span> النتائج والتقارير</Link>
      </nav>
      <div className="sidebar-note"><div className="note-stars">✦ ✧ ✦</div><strong>كل طفل يستطيع أن يبدع!</strong><p>نحو تعلّم ممتع، مليء بالفضول والإنجاز.</p><span className="note-mascot">🦉</span></div>
      <div className="sidebar-foot">مَدْرَسَتي الذكية · نسخة الأستاذ</div>
    </aside>
    <section className="dashboard-main">
      <header className="dashboard-topbar"><div><div className="eyebrow">أهلًا بك في عالم التعلّم الممتع ✨</div><div className="page-heading">لوحة الأستاذ</div></div><div className="teacher-chip"><span className="teacher-avatar">👨‍🏫</span><span><strong>فضاء الأستاذ</strong><small>إدارة الفصل والتعلّم</small></span></div></header>
      <section className="welcome-banner">
        <div className="welcome-copy"><span className="welcome-tag">🌈 نكتشف، نتعلّم، ننجح</span><h1>مرحبًا بك في مَدْرَسَتي الذكية!</h1><p>هنا تتحول الدروس إلى مغامرات ممتعة. اختر المادة، حضّر نشاطًا شيقًا، وتابع رحلة أبطالك الصغار نحو النجاح.</p><div className="actions"><Link className="btn" href="/activities">🎮 اكتشف الأنشطة <span>←</span></Link><Link className="banner-link" href="/students">إدارة التلاميذ</Link></div></div>
        <div className="welcome-illustration" aria-hidden="true"><div className="sun-shape">☀️</div><div className="rainbow-shape">🌈</div><div className="mascot">🦊</div><span className="sparkle sparkle-a">✦</span><span className="sparkle sparkle-b">★</span><span className="cloud cloud-a">☁</span></div>
      </section>
      <div className="section-heading"><div><div className="eyebrow">أرقام وإنجازات الفصل</div><h2>رحلة التعلّم بالأرقام <span>📊</span></h2></div><span className="subtle-label">تتحدّث تلقائيًا من بيانات المنصة</span></div>
      <section className="stats">
        <div className="stat stat-students"><div className="stat-top"><span className="stat-icon">🧒</span><span className="stat-trend">فصلك الجميل</span></div><strong>{students?.length ?? 0}</strong><span>التلاميذ المسجلون</span></div>
        <div className="stat stat-results"><div className="stat-top"><span className="stat-icon">✏️</span><span className="stat-trend">محاولات التعلّم</span></div><strong>{results?.length ?? 0}</strong><span>التقييمات المنجزة</span></div>
        <div className="stat stat-average"><div className="stat-top"><span className="stat-icon">⭐</span><span className="stat-trend">متوسط الفصل</span></div><strong>{avg}%</strong><span>متوسط النتائج المسجلة</span></div>
        <div className="stat stat-subjects"><div className="stat-top"><span className="stat-icon">🎨</span><span className="stat-trend">جاهزة للاكتشاف</span></div><strong>02</strong><span>المواد التعليمية النشطة</span></div>
      </section>
      <div className="section-heading subjects-heading"><div><div className="eyebrow">هيا نبدأ المغامرة!</div><h2>ماذا سنتعلّم اليوم؟ <span>🚀</span></h2></div><span className="subtle-label">اختر عالمًا من عوالم المعرفة</span></div>
      <section className="grid">
        <Link href="/subjects/arabic" className="subject arabic"><div className="subject-decoration">أ</div><div className="subject-top"><span className="subject-icon">📖</span><span className="subject-arrow">↗</span></div><div className="subject-label">عالم الكلمات والحروف</div><h3>اللغة العربية</h3><p>نقرأ الحروف، نكتشف الكلمات، نتدرّب على الكتابة ونتقن القواعد.</p><div className="subject-bottom"><span>لنبدأ التعلّم</span><span>←</span></div></Link>
        <Link href="/subjects/math" className="subject math"><div className="subject-decoration">＋</div><div className="subject-top"><span className="subject-icon">🧮</span><span className="subject-arrow">↗</span></div><div className="subject-label">عالم الأرقام والألغاز</div><h3>الرياضيات</h3><p>نلعب بالأرقام، نتقن العمليات، ونحلّ المسائل مثل الأبطال.</p><div className="subject-bottom"><span>لنبدأ التعلّم</span><span>←</span></div></Link>
      </section>
      <section className="quick-panel"><div className="quick-intro"><span className="quick-symbol">💡</span><div><h3>مهمتك القادمة يا أستاذ!</h3><p>حضّر تجربة تعليمية جميلة واجعل كل تلميذ يشارك ويتألّق.</p></div></div><div className="quick-actions"><Link href="/students">＋ إضافة تلميذ</Link><Link href="/activities">🎯 إنشاء نشاط</Link><Link href="/reports">🏆 متابعة النتائج</Link></div></section>
      <footer className="dashboard-footer">مَدْرَسَتي الذكية <span>✦</span> نتعلّم بمرح، ونكبر بالمعرفة</footer>
    </section>
  </main>;
}
