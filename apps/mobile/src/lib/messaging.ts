import type {Conversation,Message,Notification} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";
import type {SupabaseClient} from "@supabase/supabase-js";

const db=supabase as unknown as SupabaseClient;

async function currentUserId(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) throw new Error("AUTH_REQUIRED");
  return user.id;
}

export async function listConversations():Promise<Conversation[]>{
  const userId=await currentUserId();
  const {data:members,error:memberError}=await db.from("conversation_participants").select("conversation_id").eq("user_id",userId);
  if(memberError) throw new Error(memberError.message);
  const ids=[...new Set((members??[]).map((row:{conversation_id:string})=>row.conversation_id))];
  if(!ids.length)return [];
  const {data,error}=await db.from("conversations").select("*").in("id",ids).order("updated_at",{ascending:false});
  if(error) throw new Error(error.message);
  return (data??[]) as Conversation[];
}

export async function createConversation(recipientId:string,title?:string,vehicleId?:string|null){
  const userId=await currentUserId();
  if(recipientId===userId)throw new Error("CANNOT_MESSAGE_SELF");
  const {data:conversation,error}=await db.from("conversations").insert({
    created_by:userId,vehicle_id:vehicleId??null,title:title??null
  }).select("*").single();
  if(error) throw new Error(error.message);
  const {error:participantError}=await db.from("conversation_participants").insert([
    {conversation_id:conversation.id,user_id:userId},
    {conversation_id:conversation.id,user_id:recipientId}
  ]);
  if(participantError){
    await db.from("conversations").delete().eq("id",conversation.id);
    throw new Error(participantError.message);
  }
  return conversation as Conversation;
}

export async function listMessages(conversationId:string):Promise<Message[]>{
  const {data,error}=await db.from("messages").select("*").eq("conversation_id",conversationId).order("created_at",{ascending:true});
  if(error) throw new Error(error.message);
  return (data??[]) as Message[];
}

export async function sendMessage(conversationId:string,body:string):Promise<Message>{
  const userId=await currentUserId();
  const trimmed=body.trim();
  if(!trimmed)throw new Error("MESSAGE_EMPTY");
  const {data,error}=await db.from("messages").insert({
    conversation_id:conversationId,sender_id:userId,body:trimmed
  }).select("*").single();
  if(error) throw new Error(error.message);
  return data as Message;
}

export function subscribeToMessages(conversationId:string,onMessage:(message:Message)=>void){
  const channel=supabase.channel("conversation:"+conversationId).on(
    "postgres_changes",
    {event:"INSERT",schema:"public",table:"messages",filter:"conversation_id=eq."+conversationId},
    payload=>onMessage(payload.new as Message)
  ).subscribe();
  return ()=>{void supabase.removeChannel(channel);};
}

export async function listNotifications():Promise<Notification[]>{
  await currentUserId();
  const {data,error}=await db.from("notifications").select("*").order("created_at",{ascending:false}).limit(50);
  if(error)throw new Error(error.message);
  return (data??[]) as Notification[];
}

export async function markNotificationRead(id:string){
  await currentUserId();
  const {error}=await db.from("notifications").update({read_at:new Date().toISOString()}).eq("id",id);
  if(error)throw new Error(error.message);
}
