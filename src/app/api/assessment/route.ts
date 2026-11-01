import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
export async function POST(req:Request){
 try{
  const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await req.json();
  const {error}=await supabase.from("assessment_results").insert({
   subject:body.subject,skill:body.skill,question:body.question,
   answer:String(body.answer??""),correct:Boolean(body.correct),score:body.correct?100:0
  });
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({saved:true});
 }catch{return NextResponse.json({error:"Invalid request"},{status:400});}
}
