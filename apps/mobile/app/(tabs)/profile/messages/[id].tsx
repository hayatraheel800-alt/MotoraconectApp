import React,{useCallback,useEffect,useState} from "react";
import {ActivityIndicator,KeyboardAvoidingView,Platform,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import type {Message} from "@motoraconect/types";
import {listMessages,sendMessage,subscribeToMessages} from "@/lib/messaging";
import {supabase} from "@/lib/supabase";

export default function ConversationScreen(){
  const {id}=useLocalSearchParams<{id:string}>();
  const [messages,setMessages]=useState<Message[]>([]);
  const [body,setBody]=useState("");
  const [userId,setUserId]=useState<string|null>(null);
  const [loading,setLoading]=useState(true);
  const [sending,setSending]=useState(false);
  const [error,setError]=useState<string|null>(null);

  useEffect(()=>{supabase.auth.getUser().then(({data})=>setUserId(data.user?.id??null));},[]);
  const load=useCallback(async()=>{if(!id)return;try{setError(null);setMessages(await listMessages(id));}catch(e){setError(e instanceof Error?e.message:"Unable to load messages")}finally{setLoading(false)}},[id]);
  useEffect(()=>{void load();if(!id)return;return subscribeToMessages(id,(next)=>setMessages(prev=>prev.some(m=>m.id===next.id)?prev:[...prev,next]));},[id,load]);
  async function submit(){if(!id||!body.trim()||sending)return;setSending(true);try{setError(null);const next=await sendMessage(id,body);setMessages(prev=>prev.some(m=>m.id===next.id)?prev:[...prev,next]);setBody("")}catch(e){setError(e instanceof Error?e.message:"Unable to send message")}finally{setSending(false)}}
  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  return <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS==="ios"?"padding":undefined}><ScrollView contentContainerStyle={styles.container}>{error?<Text style={styles.error}>{error}</Text>:null}{messages.map(m=><View key={m.id} style={[styles.bubble,m.sender_id===userId?styles.mine:styles.theirs]}><Text>{m.body}</Text><Text style={styles.time}>{new Date(m.created_at).toLocaleTimeString()}</Text></View>)}</ScrollView><View style={styles.composer}><TextInput style={styles.input} value={body} onChangeText={setBody} placeholder="Write a message…" editable={!sending} onSubmitEditing={submit}/><Text onPress={submit} style={styles.send}>{sending?"…":"Send"}</Text></View></KeyboardAvoidingView>;
}
const styles=StyleSheet.create({wrapper:{flex:1},center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:16,gap:10},bubble:{maxWidth:"85%",padding:12,borderRadius:12,gap:4},mine:{alignSelf:"flex-end"},theirs:{alignSelf:"flex-start",borderWidth:1,borderColor:"#ddd"},time:{fontSize:11,color:"#666"},composer:{flexDirection:"row",padding:10,borderTopWidth:1,borderTopColor:"#ddd",alignItems:"center",gap:8},input:{flex:1,borderWidth:1,borderColor:"#ccc",borderRadius:20,paddingHorizontal:14,paddingVertical:10},send:{fontWeight:"700",paddingHorizontal:8},error:{color:"#b00020"}});