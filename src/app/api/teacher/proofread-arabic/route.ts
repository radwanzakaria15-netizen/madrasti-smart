import {NextResponse} from "next/server";
import OpenAI from "openai";
import {createClient} from "@/lib/supabase/server";
export async function POST(req:Request){
 try{
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"يجب تسجيل دخول الأستاذ أولًا."},{status:401});
  if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:"خدمة التصحيح غير مفعّلة. أضف مفتاح الذكاء الاصطناعي في إعدادات الخادم."},{status:503});
  const body=await req.json();
  const source=String(body.source||"").slice(0,3000),student=String(body.student||"").slice(0,3000);
  if(!source||!student)return NextResponse.json({error:"أدخل النص النموذجي وكتابة التلميذ."},{status:400});
  const ai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const result=await ai.chat.completions.create({model:process.env.OPENAI_MODEL||"gpt-4.1-mini",temperature:0,response_format:{type:"json_object"},messages:[
   {role:"system",content:"أنت مساعد تربوي متخصص في الإملاء العربي للمرحلة الابتدائية. قارن كتابة التلميذ بالنص النموذجي. لا تعتبر اختلاف علامات الترقيم أو التشكيل خطأ إملائيا جوهريا. أعد JSON فقط بالشكل {corrected:string, notes:string[]}. corrected هو النص المصحح مع إحاطة الكلمات التي تغيرت بعلامات **...**. notes قائمة قصيرة تشرح الخطأ وموضعه بلغة مشجعة دون توبيخ. لا تضف أخطاء غير موجودة."},
   {role:"user",content:"النص النموذجي:\n"+source+"\n\nكتابة التلميذ:\n"+student}
  ]});
  const parsed=JSON.parse(result.choices[0]?.message?.content||"{}");
  return NextResponse.json({review:{corrected:String(parsed.corrected||student),notes:Array.isArray(parsed.notes)?parsed.notes.map(String).slice(0,20):[]}});
 }catch(e){console.error("Arabic proofreading failed",e);return NextResponse.json({error:"تعذر إتمام المراجعة الآن. حاول مرة أخرى."},{status:500});}
}
