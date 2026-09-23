import type {Part,PartImage} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";
import type {SupabaseClient} from "@supabase/supabase-js";

const db=supabase as unknown as SupabaseClient;
const BUCKET="part-images";

async function currentUserId(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)throw new Error("AUTH_REQUIRED");
  return user.id;
}

export async function listParts(query?:string):Promise<Part[]>{
  await currentUserId();
  let request=db.from("parts").select("*").eq("status","ACTIVE").order("created_at",{ascending:false}).limit(100);
  if(query?.trim())request=request.or(`title.ilike.%${query.trim()}%,part_number.ilike.%${query.trim()}%,make.ilike.%${query.trim()}%,model.ilike.%${query.trim()}%`);
  const {data,error}=await request;
  if(error)throw new Error(error.message);
  return (data??[]) as Part[];
}

export async function listMyParts():Promise<Part[]>{
  const userId=await currentUserId();
  const {data,error}=await db.from("parts").select("*").eq("seller_id",userId).order("created_at",{ascending:false});
  if(error)throw new Error(error.message);
  return (data??[]) as Part[];
}

export async function createPart(input:{
  title:string;partNumber?:string;make?:string;model?:string;description?:string;
  condition:"NEW"|"USED"|"REFURBISHED"|"OEM"|"AFTERMARKET";
  price:number;currency?:string;stock:number;city?:string;
  base64?:string;mimeType?:string;fileName?:string;
}):Promise<Part>{
  const sellerId=await currentUserId();
  if(!input.title.trim()||input.price<0||input.stock<0)throw new Error("INVALID_PART");
  const {data:part,error}=await db.from("parts").insert({
    seller_id:sellerId,title:input.title.trim(),part_number:input.partNumber?.trim()||null,
    make:input.make?.trim()||null,model:input.model?.trim()||null,description:input.description?.trim()||null,
    condition:input.condition,price_amount:input.price,currency_code:(input.currency??"PKR").toUpperCase(),
    stock_quantity:Math.floor(input.stock),city:input.city?.trim()||null,status:"DRAFT"
  }).select("*").single();
  if(error)throw new Error(error.message);

  if(input.base64&&input.mimeType){
    const safe=(input.fileName??"part.jpg").replace(/[^a-zA-Z0-9._-]/g,"-");
    const path=sellerId+"/"+part.id+"/"+safe;
    const bytes=Uint8Array.from(atob(input.base64),c=>c.charCodeAt(0));
    const upload=await supabase.storage.from(BUCKET).upload(path,bytes,{contentType:input.mimeType,upsert:false});
    if(upload.error)throw new Error(upload.error.message);
    const {error:imageError}=await db.from("part_images").insert({
      part_id:part.id,storage_path:path,sort_order:0,alt_text:part.title
    });
    if(imageError){await supabase.storage.from(BUCKET).remove([path]);throw new Error(imageError.message);}
  }

  return part as Part;
}

export async function submitPartForReview(id:string):Promise<Part>{
  const userId=await currentUserId();
  const {data,error}=await db.from("parts").update({status:"PENDING_REVIEW",updated_at:new Date().toISOString()}).eq("id",id).eq("seller_id",userId).eq("status","DRAFT").select("*").single();
  if(error)throw new Error(error.message);
  return data as Part;
}

export async function listPartImages(partId:string):Promise<PartImage[]>{
  await currentUserId();
  const {data,error}=await db.from("part_images").select("*").eq("part_id",partId).order("sort_order");
  if(error)throw new Error(error.message);
  return (data??[]) as PartImage[];
}

export async function createPartImageSignedUrl(path:string,expiresIn=3600){
  const {data,error}=await supabase.storage.from(BUCKET).createSignedUrl(path,expiresIn);
  if(error)throw new Error(error.message);
  return data.signedUrl;
}