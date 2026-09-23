import {MockMotoraconectAssistant} from "@motoraconect/ai";
import type {AiConversation,AiMessage} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";
import type {SupabaseClient} from "@supabase/supabase-js";

const db=supabase as unknown as SupabaseClient;
const assistant=new MockMotoraconectAssistant();

async function currentUserId(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)throw new Error("AUTH_REQUIRED");
  return user.id;
}

export async function createAiConversation(title?:string):Promise<AiConversation>{
  const userId=await currentUserId();
  const {data,error}=await db.from("ai_conversations").insert({
    requester_id:userId,title:title?.trim()||"Ask Motoraconect"
  }).select("*").single();
  if(error)throw new Error(error.message);
  return data as AiConversation;
}

export async function listAiConversations():Promise<AiConversation[]>{
  await currentUserId();
  const {data,error}=await db.from("ai_conversations").select("*").order("updated_at",{ascending:false});
  if(error)throw new Error(error.message);
  return (data??[]) as AiConversation[];
}

export async function listAiMessages(conversationId:string):Promise<AiMessage[]>{
  await currentUserId();
  const {data,error}=await db.from("ai_messages").select("*").eq("conversation_id",conversationId).order("created_at",{ascending:true});
  if(error)throw new Error(error.message);
  return (data??[]) as AiMessage[];
}

export async function askMotoraconectAi(conversationId:string,question:string):Promise<AiMessage[]>{
  const userId=await currentUserId();
  const trimmed=question.trim();
  if(!trimmed)throw new Error("QUESTION_EMPTY");

  const {data:userMessage,error:userError}=await db.from("ai_messages").insert({
    conversation_id:conversationId,sender_type:"USER",body:trimmed,mocked:true
  }).select("*").single();
  if(userError)throw new Error(userError.message);

  const result=await assistant.ask({question:trimmed});
  const {data:assistantMessage,error:assistantError}=await db.from("ai_messages").insert({
    conversation_id:conversationId,sender_type:"ASSISTANT",body:result.answer,mocked:true
  }).select("*").single();
  if(assistantError)throw new Error(assistantError.message);

  await db.from("ai_conversations").update({updated_at:new Date().toISOString(),title:trimmed.slice(0,60)}).eq("id",conversationId).eq("requester_id",userId);
  return [userMessage as AiMessage,assistantMessage as AiMessage];
}

export function subscribeToAiMessages(conversationId:string,onMessage:(message:AiMessage)=>void){
  const channel=supabase.channel("ai:"+conversationId).on(
    "postgres_changes",
    {event:"INSERT",schema:"public",table:"ai_messages",filter:"conversation_id=eq."+conversationId},
    payload=>onMessage(payload.new as AiMessage)
  ).subscribe();
  return ()=>{void supabase.removeChannel(channel);};
}