import React,{useCallback,useEffect,useState} from "react";
import {ActivityIndicator,KeyboardAvoidingView,Platform,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import type {Consultation,ConsultationMessage} from "@motoraconect/types";
import {getConsultation,listConsultationMessages,sendConsultationMessage,subscribeToConsultationMessages} from "@/lib/consultations";
import {supabase} from "@/lib/supabase";

export default function ConsultationDetailScreen(){
  const {id}=useLocalSearchParams<{id:string}>();
  const [consultation,setConsultation]=useState<Consultation|null>(null);
  const [messages,setMessages]=useState<ConsultationMessage[]>([]);
  const [body,setBody]=useState("");
  const [userId,setUserId]=useState<string|null>(null);
  const [loading,setLoading]=useState(true);
  const [sending,setSending]=useState(false);
  const [error,setError]=useState<string|null>(null);

  const load=useCallback(async()=>{
    if(!id)return;
    try{
      const [nextConsultation,nextMessages]=await Promise.all([getConsultation(id),listConsultationMessages(id)]);
      setConsultation(nextConsultation);setMessages(nextMessages);setError(null);
    }catch(e){setError(e instanceof Error?e.message:"Unable to load consultation")}
    finally{setLoading(false)}
  },[id]);

  useEffect(()=>{supabase.auth.getUser().then(({data})=>setUserId(data.user?.id??null));void load();if(!id)return;return subscribeToConsultationMessages(id,next=>setMessages(prev=>prev.some(m=>m.id===next.id)?prev:[...prev,next]));},[id,load]);

  async function send(){
    if(!id||!body.trim()||sending)return;
    setSending(true);
    try{const next=await sendConsultationMessage(id,body);setMessages(prev=>prev.some(m=>m.id===next.id)?prev:[...prev,next]);setBody("")}
    catch(e){setError(e instanceof Error?e.message:"Unable to send message")}
    finally{setSending(false)}
  }

  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  if(!consultation)return <View style={styles.center}><Text>{error??"Consultation not found"}</Text></View>;
  return <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS==="ios"?"padding":undefined}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{consultation.subject}</Text>
      <Text style={styles.badge}>{consultation.status}</Text>
      <Text style={styles.meta}>{consultation.service_type}</Text>
      <Text style={styles.details}>{consultation.details}</Text>
      {consultation.scheduled_for?<Text>Scheduled: {new Date(consultation.scheduled_for).toLocaleString()}</Text>:<Text style={styles.muted}>No appointment time has been scheduled yet.</Text>}
      <Text style={styles.section}>Consultation messages</Text>
      {error?<Text style={styles.error}>{error}</Text>:null}
      {messages.length?messages.map(m=><View key={m.id} style={[styles.bubble,m.sender_id===userId?styles.mine:styles.theirs]}><Text>{m.body}</Text><Text style={styles.time}>{new Date(m.created_at).toLocaleTimeString()}</Text></View>):<Text style={styles.muted}>No messages yet.</Text>}
    </ScrollView>
    <View style={styles.composer}><TextInput style={styles.input} value={body} onChangeText={setBody} placeholder="Message your consultant…" editable={!sending}/><Text onPress={send} style={styles.send}>{sending?"…":"Send"}</Text></View>
  </KeyboardAvoidingView>;
}
const styles=StyleSheet.create({wrapper:{flex:1},center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:10},title:{fontSize:25,fontWeight:"700"},badge:{alignSelf:"flex-start",padding:8,borderWidth:1,borderColor:"#ccc",borderRadius:8,fontWeight:"700"},meta:{fontWeight:"600"},details:{fontSize:16,lineHeight:24},muted:{color:"#666"},section:{fontSize:20,fontWeight:"700",marginTop:8},bubble:{maxWidth:"85%",padding:12,borderRadius:12,gap:4},mine:{alignSelf:"flex-end"},theirs:{alignSelf:"flex-start",borderWidth:1,borderColor:"#ddd"},time:{fontSize:11,color:"#666"},composer:{flexDirection:"row",padding:10,borderTopWidth:1,borderTopColor:"#ddd",alignItems:"center",gap:8},input:{flex:1,borderWidth:1,borderColor:"#ccc",borderRadius:20,paddingHorizontal:14,paddingVertical:10},send:{fontWeight:"700",paddingHorizontal:8},error:{color:"#b00020"}});