import {MockPaymentProcessor} from "@motoraconect/payments";
import type {Payment,PaymentStatus} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";
import type {SupabaseClient} from "@supabase/supabase-js";

const db=supabase as unknown as SupabaseClient;
const processor=new MockPaymentProcessor();

export async function createMockPayment(input:{amount:number;currency:string;purpose:string}):Promise<Payment>{
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)throw new Error("AUTH_REQUIRED");
  if(!Number.isFinite(input.amount)||input.amount<0)throw new Error("INVALID_AMOUNT");
  const idempotencyKey=crypto.randomUUID();
  const {data:created,error:createError}=await db.from("payments").insert({
    payer_id:user.id,amount:input.amount,currency:input.currency.trim().toUpperCase(),
    purpose:input.purpose.trim(),status:"PROCESSING",provider:"MOCK",idempotency_key:idempotencyKey
  }).select("*").single();
  if(createError)throw new Error(createError.message);
  const result=await processor.process({
    paymentId:created.id,amount:input.amount,currency:input.currency.trim().toUpperCase(),
    purpose:input.purpose.trim(),idempotencyKey
  });
  const {data:updated,error:updateError}=await db.from("payments").update({
    status:result.status as PaymentStatus,provider:result.provider,
    provider_reference:result.providerReference,metadata:{message:result.message},
    updated_at:new Date().toISOString()
  }).eq("id",created.id).select("*").single();
  if(updateError)throw new Error(updateError.message);
  await db.from("payment_transactions").insert({
    payment_id:created.id,
    transaction_type:result.status==="SUCCEEDED"?"CAPTURE":"FAILURE",
    amount:input.amount,currency:input.currency.trim().toUpperCase(),
    provider_reference:result.providerReference,
    metadata:{message:result.message}
  });
  return updated as Payment;
}

export async function listPayments():Promise<Payment[]>{
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)throw new Error("AUTH_REQUIRED");
  const {data,error}=await db.from("payments").select("*").order("created_at",{ascending:false});
  if(error)throw new Error(error.message);
  return (data??[]) as Payment[];
}