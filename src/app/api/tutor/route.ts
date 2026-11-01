import OpenAI from "openai";
import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";

export async function POST(req:Request){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:"خدمة الذكاء الاصطناعي غير مهيأة بعد."},{status:503});
 try{
  const {subject,skill,question,studentAnswer,expectedAnswer,history=[]}=await req.json();
  const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const response=await openai.responses.create({
   model:process.env.OPENAI_MODEL||"gpt-4.1-mini",
   instructions:"أنت مساعد تربوي للأطفال في المرحلة الابتدائية. تحدث بالعربية الفصحى السهلة، كن لطيفا ومشجعا ولا توبخ الطفل. لا تعط الحل مباشرة؛ ابدأ بتلميح مناسب، واشرح خطوة واحدة في كل مرة. لا تجمع بيانات شخصية عن الطفل. أعد إجابة قصيرة مناسبة لعمره.",
   input:JSON.stringify({المادة:subject,المهارة:skill,السؤال:question,إجابة_التلميذ:studentAnswer,الإجابة_المتوقعة:expectedAnswer,المحاولات_السابقة:history})
  });
  return NextResponse.json({message:response.output_text});
 }catch{return NextResponse.json({error:"تعذر الحصول على رد من المساعد الذكي."},{status:500});}
}
