import type {Dealer,DealerInventory} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";
import type {SupabaseClient} from "@supabase/supabase-js";

const db=supabase as unknown as SupabaseClient;

async function currentUserId(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)throw new Error("AUTH_REQUIRED");
  return user.id;
}

export async function listActiveDealers():Promise<Dealer[]>{
  await currentUserId();
  const {data,error}=await db.from("dealers").select("*").eq("status","ACTIVE").order("created_at",{ascending:false});
  if(error)throw new Error(error.message);
  return (data??[]) as Dealer[];
}

export async function listMyDealers():Promise<Dealer[]>{
  const userId=await currentUserId();
  const {data,error}=await db.from("dealers").select("*").eq("owner_id",userId).order("created_at",{ascending:false});
  if(error)throw new Error(error.message);
  return (data??[]) as Dealer[];
}

export async function createDealer(input:{businessName:string;description?:string;phone?:string;email?:string;city?:string;countryCode?:string;website?:string}):Promise<Dealer>{
  const ownerId=await currentUserId();
  if(!input.businessName.trim())throw new Error("BUSINESS_NAME_REQUIRED");
  const {data,error}=await db.from("dealers").insert({
    owner_id:ownerId,business_name:input.businessName.trim(),description:input.description?.trim()||null,
    phone:input.phone?.trim()||null,email:input.email?.trim()||null,city:input.city?.trim()||null,
    country_code:(input.countryCode??"PK").trim().toUpperCase(),website:input.website?.trim()||null,status:"PENDING_REVIEW"
  }).select("*").single();
  if(error)throw new Error(error.message);
  return data as Dealer;
}

export async function listMyDealerInventory(dealerId:string):Promise<DealerInventory[]>{
  const {data,error}=await db.from("dealer_inventory").select("*").eq("dealer_id",dealerId).order("created_at",{ascending:false});
  if(error)throw new Error(error.message);
  return (data??[]) as DealerInventory[];
}

export async function listMyVehicles(){
  const userId=await currentUserId();
  const {data,error}=await db.from("vehicles").select("id,title,status").eq("seller_id",userId).order("created_at",{ascending:false});
  if(error)throw new Error(error.message);
  return (data??[]) as {id:string;title:string;status:string}[];
}

export async function addVehicleToDealerInventory(dealerId:string,vehicleId:string):Promise<DealerInventory>{
  const {data,error}=await db.from("dealer_inventory").insert({dealer_id:dealerId,vehicle_id:vehicleId}).select("*").single();
  if(error)throw new Error(error.message);
  return data as DealerInventory;
}