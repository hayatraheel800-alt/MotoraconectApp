import {redirect} from "next/navigation";
import Link from "next/link";
import {createClient} from "@/lib/supabase/server";

type Metric={label:string;value:number};
type VehicleRow={id:string;title:string;status:string;created_at:string;seller_id:string};
type ConsultationRow={id:string;subject:string;service_type:string;status:string;created_at:string};

async function isAdmin(supabase:any,userId:string){
  const {data,error}=await supabase.from("user_roles").select("roles!inner(name)").eq("user_id",userId);
  if(error)return false;
  return (data??[]).some((row:any)=>row.roles?.name==="ADMIN"||row.roles?.name==="SUPER_ADMIN");
}

export default async function AdminHome(){
  const supabase=await createClient();
  const {data,error}=await supabase.auth.getClaims();
  const userId=typeof data?.claims?.sub==="string"?data.claims.sub:null;
  if(error||!userId)redirect("/login");
  if(!(await isAdmin(supabase,userId)))redirect("/login?error=admin_required");

  const [{count:users},{count:active},{count:pending},{count:consultations}]=await Promise.all([
    supabase.from("profiles").select("*",{count:"exact",head:true}),
    supabase.from("vehicles").select("*",{count:"exact",head:true}).eq("status","ACTIVE"),
    supabase.from("vehicles").select("*",{count:"exact",head:true}).eq("status","PENDING_REVIEW"),
    supabase.from("consultations").select("*",{count:"exact",head:true}).eq("status","REQUESTED")
  ]);

  const {data:pendingRows}=await supabase.from("vehicles").select("id,title,status,created_at,seller_id").eq("status","PENDING_REVIEW").order("created_at",{ascending:true}).limit(25);
  const {data:consultationRows}=await supabase.from("consultations").select("id,subject,service_type,status,created_at").in("status",["REQUESTED","ACCEPTED","SCHEDULED","IN_PROGRESS"]).order("created_at",{ascending:false}).limit(25);

  async function moderateVehicle(formData:FormData){
    "use server";
    const id=String(formData.get("id")??"");
    const status=String(formData.get("status")??"");
    if(!id||!["ACTIVE","REJECTED","SUSPENDED"].includes(status))return;
    const client=await createClient();
    const {data:claimsData}=await client.auth.getClaims();
    const actorId=typeof claimsData?.claims?.sub==="string"?claimsData.claims.sub:null;
    if(!actorId||(await isAdmin(client,actorId))===false)return;
    const {error:updateError}=await client.from("vehicles").update({status}).eq("id",id);
    if(updateError)return;
    await client.from("admin_actions").insert({actor_id:actorId,action_type:"VEHICLE_STATUS_CHANGED",entity_type:"vehicles",entity_id:id,metadata:{status}});
    await client.from("audit_logs").insert({actor_id:actorId,action:"VEHICLE_STATUS_CHANGED",entity_type:"vehicles",entity_id:id,metadata:{status}});
  }

  return <main style={{maxWidth:1200,margin:"0 auto",padding:32}}>
    <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h1 style={{marginBottom:4}}>Motoraconect Admin</h1><p style={{margin:0}}>Moderation and operational overview.</p></div>
      <form action="/auth/signout" method="post"><button>Sign out</button></form>
    </header>
    <section style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
      {([
        ["Users",users??0],["Active listings",active??0],["Pending review",pending??0],["Open consultations",consultations??0]
      ] as [string,number][]).map(([label,value])=><div key={label} style={{background:"white",padding:18,borderRadius:12,border:"1px solid #e4e7ec"}}><div style={{fontSize:13,color:"#667085"}}>{label}</div><div style={{fontSize:28,fontWeight:700,marginTop:6}}>{value}</div></div>)}
    </section>
    <section style={{background:"white",padding:20,borderRadius:12,border:"1px solid #e4e7ec",marginBottom:20}}>
      <h2>Vehicle moderation queue</h2>
      {!pendingRows?.length?<p>No listings awaiting review.</p>:<div style={{display:"grid",gap:10}}>{(pendingRows as VehicleRow[]).map(vehicle=><div key={vehicle.id} style={{display:"grid",gridTemplateColumns:"1fr auto",gap:10,padding:12,border:"1px solid #eaecf0",borderRadius:10}}><div><strong>{vehicle.title}</strong><div style={{fontSize:13,color:"#667085"}}>{new Date(vehicle.created_at).toLocaleString()}</div></div><form action={moderateVehicle} style={{display:"flex",gap:6}}><input type="hidden" name="id" value={vehicle.id}/><button name="status" value="ACTIVE">Approve</button><button name="status" value="REJECTED">Reject</button><button name="status" value="SUSPENDED">Suspend</button></form></div>)}</div>}
    </section>
    <section style={{background:"white",padding:20,borderRadius:12,border:"1px solid #e4e7ec"}}>
      <h2>Consultations needing attention</h2>
      {!consultationRows?.length?<p>No active consultations.</p>:<div style={{display:"grid",gap:8}}>{(consultationRows as ConsultationRow[]).map(item=><div key={item.id} style={{padding:12,border:"1px solid #eaecf0",borderRadius:10}}><strong>{item.subject}</strong><div>{item.service_type} · {item.status}</div><div style={{fontSize:13,color:"#667085"}}>{new Date(item.created_at).toLocaleString()}</div></div>)}</div>}
    </section>
  </main>;
}
