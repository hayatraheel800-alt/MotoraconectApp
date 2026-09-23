"use client";

import {FormEvent,useState} from "react";
import {createBrowserClient} from "@supabase/ssr";
import {useRouter} from "next/navigation";

function getClient(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key) throw new Error("Supabase environment variables are not configured.");
  return createBrowserClient(url,key);
}

export default function LoginPage(){
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  async function submit(e:FormEvent){
    e.preventDefault();setBusy(true);setError(null);
    const {error}=await getClient().auth.signInWithPassword({email,password});
    if(error){setError(error.message);setBusy(false);return}
    router.replace("/");
    router.refresh();
  }
  return <main style={{maxWidth:420,margin:"12vh auto",background:"white",padding:32,borderRadius:16,boxShadow:"0 8px 30px rgba(16,24,40,.08)"}}>
    <h1>Motoraconect Admin</h1>
    <p>Sign in with a Supabase account that has ADMIN or SUPER_ADMIN role.</p>
    <form onSubmit={submit} style={{display:"grid",gap:14}}>
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required style={{display:"block",width:"100%",padding:10,marginTop:6}}/></label>
      <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required style={{display:"block",width:"100%",padding:10,marginTop:6}}/></label>
      {error?<div style={{color:"#b42318"}}>{error}</div>:null}
      <button disabled={busy} style={{padding:12}}>{busy?"Signing in…":"Sign in"}</button>
    </form>
  </main>;
}
