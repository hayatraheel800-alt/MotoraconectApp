import React,{useCallback,useEffect,useState} from "react";
import {ActivityIndicator,KeyboardAvoidingView,Platform,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {useLocalSearchParams,useRouter} from "expo-router";
import type {AiMessage} from "@motoraconect/types";
import {askMotoraconectAi,createAiConversation,listAiMessages,subscribeToAiMessages} from "@/lib/ai-chat";

export default function AskAiScreen(){
  const params=useLocalSearchParams<{id?:string}>();
  const router=useRouter();
  const [conversationId,setConversationId]=useState<string|null>(params.id??null);
  const [messages,setMessages]=useState<AiMessage[]>([]);
  const [question,setQuestion]=useState("");
  const [loading,setLoading]=useState(true);
  const [sending,setSending]=useState(false);
  const [error,setError]=useState<string|null>(null);

  const load=useCallback(async()=>{
    try{
      let id=conversationId;
      if(!id){const conversation=await createAiConversation();id=conversation.id;setConversationId(id);router.setParams({id});}
      setMessages(await listAiMessages(id));setError(null);
    }catch(e){setError(e instanceof Error?e.message:"Unable to load AI chat")}
    finally{setLoading(false)}
  },[conversationId,router]);

  useEffect(()=>{void load()},[load]);
  useEffect(()=>{if(!conversationId)return;return subscribeToAiMessages(conversationId,next=>setMessages(prev=>prev.some(m=>m.id===next.id)?prev:[...prev,next]));},[conversationId]);

  async function submit(){
    if(!conversationId||!question.trim()||sending)return;
    setSending(true);
    try{
      setError(null);
      const next=await askMotoraconectAi(conversationId,question);
      setMessages(prev=>{const ids=new Set(prev.map(m=>m.id));return [...prev,...next.filter(m=>!ids.has(m.id))]});
      setQuestion("");
    }catch(e){setError(e instanceof Error?e.message:"Unable to ask AI")}
    finally{setSending(false)}
  }

  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  return <KeyboardAvoidingView style={styles.wrapper} behavior={Platform.OS==="ios"?"padding":undefined}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ask Motoraconect AI</Text>
      <Text style={styles.badge}>MOCKED FOR DEVELOPMENT</Text>
      <Text style={styles.body}>The assistant is currently a domain-aware mock. A real AI provider will be connected only after a provider, credentials, budget, and safety requirements are approved.</Text>
      {error?<Text style={styles.error}>{error}</Text>:null}
      {messages.map(m=><View key={m.id} style={[styles.bubble,m.sender_type==="USER"?styles.mine:styles.theirs]}><Text>{m.body}</Text><Text style={styles.time}>{m.sender_type} · {new Date(m.created_at).toLocaleTimeString()}</Text></View>)}
      {!messages.length?<Text style={styles.muted}>Try: “How does the import calculator work?” or “How should I read an auction sheet?”</Text>:null}
    </ScrollView>
    <View style={styles.composer}><TextInput style={styles.input} value={question} onChangeText={setQuestion} placeholder="Ask about buying, importing, auction sheets…" editable={!sending}/><Text onPress={submit} style={styles.send}>{sending?"…":"Send"}</Text></View>
  </KeyboardAvoidingView>;
}
const styles=StyleSheet.create({wrapper:{flex:1},center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:10},title:{fontSize:26,fontWeight:"700"},badge:{alignSelf:"flex-start",padding:8,borderWidth:1,borderColor:"#ccc",borderRadius:8,fontWeight:"700"},body:{fontSize:15,lineHeight:22},bubble:{maxWidth:"88%",padding:13,borderRadius:12,gap:4},mine:{alignSelf:"flex-end"},theirs:{alignSelf:"flex-start",borderWidth:1,borderColor:"#ddd"},time:{fontSize:10,color:"#666"},muted:{color:"#666",lineHeight:21},composer:{flexDirection:"row",padding:10,borderTopWidth:1,borderTopColor:"#ddd",alignItems:"center",gap:8},input:{flex:1,borderWidth:1,borderColor:"#ccc",borderRadius:20,paddingHorizontal:14,paddingVertical:10},send:{fontWeight:"700",paddingHorizontal:8},error:{color:"#b00020"}});