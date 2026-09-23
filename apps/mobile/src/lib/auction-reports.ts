import {MockAuctionSheetAnalyzer} from "@motoraconect/ai";
import type {AuctionReport, AuctionReportItem} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";

const BUCKET="auction-sheets";
const analyzer=new MockAuctionSheetAnalyzer();

type CreateAuctionReportInput={documentName:string; mimeType:string; base64:string; vehicleId?:string|null};

export async function createAuctionReport(input:CreateAuctionReportInput){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) throw new Error("AUTH_REQUIRED");

  const reportId=crypto.randomUUID();
  const safeName=input.documentName.replace(/[^a-zA-Z0-9._-]/g,"-");
  const path=user.id+"/"+reportId+"/"+safeName;
  const bytes=Uint8Array.from(atob(input.base64),c=>c.charCodeAt(0));

  const upload=await supabase.storage.from(BUCKET).upload(path,bytes,{contentType:input.mimeType,upsert:false});
  if(upload.error) throw new Error(upload.error.message);

  const {error:insertError}=await supabase.from("auction_reports").insert({
    id:reportId,requester_id:user.id,vehicle_id:input.vehicleId??null,
    document_path:path,document_name:input.documentName,status:"UPLOADED"
  });
  if(insertError){
    await supabase.storage.from(BUCKET).remove([path]);
    throw new Error(insertError.message);
  }

  await supabase.from("auction_reports").update({status:"ANALYZING"}).eq("id",reportId);

  const result=await analyzer.analyze({documentName:input.documentName,storagePath:path});
  const {error:readyError}=await supabase.from("auction_reports").update({
    status:"READY",summary:result.summary,result,error_message:null
  }).eq("id",reportId);
  if(readyError) throw new Error(readyError.message);

  if(result.items.length){
    const rows=result.items.map(item=>({
      report_id:reportId,field_name:item.field,value_text:item.value===null?null:String(item.value),
      source:item.source,confidence:item.confidence,note:item.note??null
    }));
    const {error:itemError}=await supabase.from("auction_report_items").insert(rows);
    if(itemError) throw new Error(itemError.message);
  }

  return getAuctionReport(reportId);
}

export async function listAuctionReports():Promise<AuctionReport[]>{
  const {data,error}=await supabase.from("auction_reports").select("*").order("created_at",{ascending:false});
  if(error) throw new Error(error.message);
  return (data??[]) as AuctionReport[];
}

export async function getAuctionReport(id:string):Promise<(AuctionReport & {items:AuctionReportItem[]})|null>{
  const {data,error}=await supabase.from("auction_reports").select("*").eq("id",id).maybeSingle();
  if(error) throw new Error(error.message);
  if(!data) return null;
  const {data:items,error:itemError}=await supabase.from("auction_report_items").select("*").eq("report_id",id).order("created_at");
  if(itemError) throw new Error(itemError.message);
  return {...data,items:(items??[]) as AuctionReportItem[]} as AuctionReport & {items:AuctionReportItem[]};
}
