import {NextResponse} from "next/server";
import OpenAI from "openai";
import {createClient} from "@/lib/supabase/server";

export async function POST(req:Request){
 try{
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"يجب تسجيل دخول الأستاذ أولًا."},{status:401});
  if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:"خدمة الذكاء الاصطناعي غير مفعّلة بعد. أضف OPENAI_API_KEY إلى متغيرات البيئة في Codespaces."},{status:503});
  const body=await req.json();
  const subject=String(body.subject||"العربية").slice(0,40);
  const skill=String(body.skill||"مهارات عامة").slice(0,100);
  const level=String(body.level||"ابتدائي").slice(0,40);
  const type=String(body.type||"اختيار من متعدد").slice(0,60);
  const recent=Array.isArray(body.recent)?body.recent.slice(0,30).map((x:unknown)=>String(x).slice(0,240)):[];
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const response=await client.chat.completions.create({
   model:process.env.OPENAI_MODEL||"gpt-4.1-mini",
   temperature:1,
   response_format:{type:"json_object"},
   messages:[
    {role:"system",content:"أنت مساعد تربوي ينشئ تمارين أصلية مناسبة لتلاميذ المرحلة الابتدائية. أخرج JSON فقط بالمفاتيح: title, question, choices (مصفوفة من 3 أو 4 خيارات), answer, hint, explanation. اجعل الإجابة الصحيحة واحدة فقط، وتأكد أن answer يطابق أحد choices حرفيًا. اكتب بالعربية الفصحى وبأسلوب واضح، ولا تكرر أي سؤال من قائمة الأسئلة السابقة. لا تضف محتوى خارج JSON."},
    {role:"user",content:`أنشئ تمرينًا جديدًا تمامًا. المادة: ${subject}. المهارة: ${skill}. المستوى: ${level}. النوع: ${type}. تجنب تكرار هذه الأسئلة أو صياغاتها: ${recent.join(" | ")||"لا توجد أسئلة سابقة"} . غيّر الأمثلة والأسماء والأرقام والسياق في كل مرة.`}
   ]
  });
  const raw=response.choices[0]?.message?.content||"{}";
  const parsed=JSON.parse(raw);
  if(typeof parsed.question!=="string"||!Array.isArray(parsed.choices)||!parsed.choices.includes(parsed.answer))return NextResponse.json({error:"لم نتمكن من إعداد تمرين صالح. حاول مرة أخرى."},{status:502});
  return NextResponse.json({exercise:{...parsed,id:crypto.randomUUID(),source:"ai"}});
 }catch(e){
  console.error("Exercise generation failed",e);
  return NextResponse.json({error:"تعذر إنشاء التمرين حاليًا. تحقق من إعدادات الخدمة وحاول مجددًا."},{status:500});
 }
}
