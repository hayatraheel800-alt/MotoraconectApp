import type {Consultation,ConsultationMessage,ConsultationStatus} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";
import type {SupabaseClient} from "@supabase/supabase-js";

const db=supabase as unknown as SupabaseClient;

async function currentUserId(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) throw new Error("AUTH_REQUIRED");
  return user.id;
}

export type CreateConsultationInput = {
  serviceType: string;
  subject: string;
  details: string;
  vehicleId?: string | null;
};

export async function createConsultation(input:CreateConsultationInput):Promise<Consultation>{
  const userId=await currentUserId();
  if(!input.serviceType.trim()||!input.subject.trim()||!input.details.trim()) throw new Error("REQUIRED_FIELDS");
  const {data,error}=await db.from("consultations").insert({
    requester_id:userId,
    vehicle_id:input.vehicleId??null,
    service_type:input.serviceType.trim(),
    subject:input.subject.trim(),
    details:input.details.trim(),
    status:"REQUESTED"
  }).select("*").single();
  if(error) throw new Error(error.message);
  return data as Consultation;
}

export async function listConsultations():Promise<Consultation[]>{
  await currentUserId();
  const {data,error}=await db.from("consultations").select("*").order("updated_at",{ascending:false});
  if(error) throw new Error(error.message);
  return (data??[]) as Consultation[];
}

export async function getConsultation(id:string):Promise<Consultation|null>{
  await currentUserId();
  const {data,error}=await db.from("consultations").select("*").eq("id",id).maybeSingle();
  if(error) throw new Error(error.message);
  return data as Consultation|null;
}

export async function updateConsultationStatus(id:string,status:ConsultationStatus){
  await currentUserId();
  const {data,error}=await db.from("consultations").update({status,updated_at:new Date().toISOString()}).eq("id",id).select("*").single();
  if(error) throw new Error(error.message);
  return data as Consultation;
}

export async function listConsultationMessages(consultationId:string):Promise<ConsultationMessage[]>{
  await currentUserId();
  const {data,error}=await db.from("consultation_messages").select("*").eq("consultation_id",consultationId).order("created_at",{ascending:true});
  if(error) throw new Error(error.message);
  return (data??[]) as ConsultationMessage[];
}

export async function sendConsultationMessage(consultationId:string,body:string):Promise<ConsultationMessage>{
  const userId=await currentUserId();
  const trimmed=body.trim();
  if(!trimmed) throw new Error("MESSAGE_EMPTY");
  const {data,error}=await db.from("consultation_messages").insert({
    consultation_id:consultationId,
    sender_id:userId,
    body:trimmed
  }).select("*").single();
  if(error) throw new Error(error.message);
  return data as ConsultationMessage;
}

export function subscribeToConsultationMessages(consultationId:string,onMessage:(message:ConsultationMessage)=>void){
  const channel=supabase.channel("consultation:"+consultationId).on(
    "postgres_changes",
    {event:"INSERT",schema:"public",table:"consultation_messages",filter:"consultation_id=eq."+consultationId},
    payload=>onMessage(payload.new as ConsultationMessage)
  ).subscribe();
  return ()=>{void supabase.removeChannel(channel);};
}