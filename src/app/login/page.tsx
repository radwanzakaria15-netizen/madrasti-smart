"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username,setUsername]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false); const router=useRouter();
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");
    const expected=(process.env.NEXT_PUBLIC_TEACHER_USERNAME || "teacher").trim();
    if(username.trim()!==expected){setError("اسم المستخدم غير صحيح.");setBusy(false);return;}
    const supabase=createClient();
    const {error}=await supabase.auth.signInWithPassword({email:`${username.trim()}@teacher.local`,password});
    if(error){setError("تعذر تسجيل الدخول. تحقق من بيانات الأستاذ أو إعداد الحساب في Supabase.");setBusy(false);return;}
    router.push("/");router.refresh();
  }
  return <main className="shell"><form className="form" onSubmit={submit}><div className="brand"><div className="brandmark">م</div> مَدْرَسَتي الذكية</div><h1 style={{marginTop:25}}>دخول الأستاذ</h1><p>مساحة إدارة المنصة التعليمية</p><label>اسم المستخدم</label><input className="field" value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" required/><label>كلمة المرور</label><input className="field" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/><button className="btn" style={{width:"100%",marginTop:20}} disabled={busy}>{busy?"جارٍ التحقق...":"تسجيل الدخول"}</button>{error&&<div className="feedback" role="alert">{error}</div>}<p style={{fontSize:12,marginTop:18}}>الدخول مخصص للأستاذ. لا تضع بيانات الدخول في ملفات الواجهة الأمامية.</p></form></main>;
}
