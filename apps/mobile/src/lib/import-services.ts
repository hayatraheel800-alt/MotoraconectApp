import type {Guide,GuideCategory,ImportCalculationInput,ImportCalculationRecord,ImportCalculationResult} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";
import type {SupabaseClient} from "@supabase/supabase-js";

const db=supabase as unknown as SupabaseClient;

export async function saveImportCalculation(input:ImportCalculationInput,result:ImportCalculationResult):Promise<ImportCalculationRecord>{
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) throw new Error("AUTH_REQUIRED");
  const {data,error}=await db.from("import_calculations").insert({
    requester_id:user.id,input,result,total_pkr:result.totalPkr
  }).select("*").single();
  if(error) throw new Error(error.message);
  return data as unknown as ImportCalculationRecord;
}

export async function listImportCalculations():Promise<ImportCalculationRecord[]>{
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) throw new Error("AUTH_REQUIRED");
  const {data,error}=await db.from("import_calculations").select("*").order("created_at",{ascending:false});
  if(error) throw new Error(error.message);
  return (data??[]) as unknown as ImportCalculationRecord[];
}

export async function listGuides():Promise<{categories:GuideCategory[];guides:Guide[]}>{
  const [{data:categories,error:categoryError},{data:guides,error:guideError}]=await Promise.all([
    db.from("guide_categories").select("*").order("name"),
    db.from("guides").select("*").eq("published",true).order("created_at",{ascending:false})
  ]);
  if(categoryError) throw new Error(categoryError.message);
  if(guideError) throw new Error(guideError.message);
  return {categories:(categories??[]) as unknown as GuideCategory[],guides:(guides??[]) as unknown as Guide[]};
}
