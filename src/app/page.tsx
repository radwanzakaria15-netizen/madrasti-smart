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
      <Link href="/" className="brand sidebar-brand"><span className="brandmark">م</span><span>مَدْرَسَتي<span className="brand-light"> الذكية</span></span></Link>
      <div className="side-caption">القائمة الرئيسية</div>
      <nav className="side-nav">
        <Link className="side-link active" href="/"><span>▦</span> لوحة التحكم</Link>
        <Link className="side-link" href="/subjects/arabic"><span>أ</span> اللغة العربية</Link>
        <Link className="side-link" href="/subjects/math"><span>∑</span> الرياضيات</Link>
        <Link className="side-link" href="/students"><span>♙</span> التلاميذ</Link>
        <Link className="side-link" href="/activities"><span>✎</span> الأنشطة والتمارين</Link>
        <Link className="side-link" href="/reports"><span>▤</span> التقارير والنتائج</Link>
      </nav>
      <div className="sidebar-note"><span className="note-icon">✦</span><strong>التعلّم يصنع الفرق</strong><p>خطوة صغيرة كل يوم تصنع إنجازًا كبيرًا.</p></div>
      <div className="sidebar-foot">مساحة الأستاذ الخاصة</div>
    </aside>

    <section className="dashboard-main">
      <header className="dashboard-topbar">
        <div><div className="eyebrow">مساحة العمل التعليمية</div><div className="page-heading">لوحة التحكم</div></div>
        <div className="teacher-chip"><span className="teacher-avatar">أ</span><span><strong>الأستاذ</strong><small>مرحبًا بعودتك</small></span></div>
      </header>

      <section className="welcome-banner">
        <div className="welcome-copy"><span className="welcome-tag">✦ منصتك التعليمية المتكاملة</span><h1>مرحبًا بك في فصلك الذكي</h1><p>كل أدواتك التعليمية في مكان واحد. أنشئ أنشطة ممتعة، تابع تقدم تلاميذك، واجعل التعلم تجربة مليئة بالاكتشاف.</p><div className="actions"><Link className="btn" href="/activities">ابدأ نشاطًا تعليميًا <span>←</span></Link><Link className="banner-link" href="/reports">استكشف التقارير</Link></div></div>
        <div className="welcome-illustration" aria-hidden="true"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="book-stack"><span>✦</span><b>م</b></div><div className="float float-pencil">✎</div><div className="float float-star">✦</div><div className="float float-cap">⌂</div></div>
      </section>

      <div className="section-heading"><div><div className="eyebrow">نظرة عامة</div><h2>ملخص الفصل</h2></div><span className="subtle-label">إحصائيات المنصة</span></div>
      <section className="stats">
        <div className="stat stat-students"><div className="stat-top"><span className="stat-icon">♙</span><span className="stat-trend">إجمالي</span></div><strong>{students?.length ?? 0}</strong><span>التلاميذ المسجلون</span></div>
        <div className="stat stat-results"><div className="stat-top"><span className="stat-icon">✓</span><span className="stat-trend">إجمالي</span></div><strong>{results?.length ?? 0}</strong><span>محاولات التقييم</span></div>
        <div className="stat stat-average"><div className="stat-top"><span className="stat-icon">％</span><span className="stat-trend">المعدل</span></div><strong>{avg}%</strong><span>متوسط النتائج المسجلة</span></div>
        <div className="stat stat-subjects"><div className="stat-top"><span className="stat-icon">▣</span><span className="stat-trend">المرحلة الأولى</span></div><strong>02</strong><span>المواد التعليمية النشطة</span></div>
      </section>

      <div className="section-heading subjects-heading"><div><div className="eyebrow">ابدأ رحلة التعلم</div><h2>المواد التعليمية</h2></div><span className="subtle-label">اختر مادة للمتابعة</span></div>
      <section className="grid">
        <Link href="/subjects/arabic" className="subject arabic"><div className="subject-top"><span className="subject-icon">أ ب</span><span className="subject-arrow">↗</span></div><div className="subject-label">اللغة والمهارات</div><h3>اللغة العربية</h3><p>الحروف والقراءة، الخط والكتابة، القواعد والاختبارات.</p><div className="subject-bottom"><span>استكشف الدروس</span><span>←</span></div></Link>
        <Link href="/subjects/math" className="subject math"><div className="subject-top"><span className="subject-icon">١٢٣</span><span className="subject-arrow">↗</span></div><div className="subject-label">الأعداد والتفكير</div><h3>الرياضيات</h3><p>الأرقام، جدول الضرب، العمليات الحسابية وحل المسائل.</p><div className="subject-bottom"><span>استكشف الدروس</span><span>←</span></div></Link>
      </section>

      <section className="quick-panel"><div><span className="quick-symbol">✦</span><div><h3>ماذا تريد أن تنجز اليوم؟</h3><p>انتقل مباشرة إلى الأدوات التي تحتاجها لإدارة فصلك.</p></div></div><div className="quick-actions"><Link href="/students">＋ إضافة تلميذ</Link><Link href="/activities">✎ إنشاء نشاط</Link><Link href="/reports">▤ عرض التقارير</Link></div></section>
      <footer className="dashboard-footer">مَدْرَسَتي الذكية <span>•</span> التعلّم بإلهام، والتقدّم بثقة</footer>
    </section>
  </main>;
}
