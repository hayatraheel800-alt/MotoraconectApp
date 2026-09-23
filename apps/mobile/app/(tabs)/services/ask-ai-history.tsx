import React,{useCallback,useState} from "react";
import {ActivityIndicator,RefreshControl,ScrollView,StyleSheet,Text,View} from "react-native";
import {useFocusEffect,useRouter} from "expo-router";
import type {AiConversation} from "@motoraconect/types";
import {listAiConversations} from "@/lib/ai-chat";

export default function AiHistoryScreen(){
  const router=useRouter();
  const [items,setItems]=useState<AiConversation[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const load=useCallback(async(initial=false)=>{
    if(initial)setLoading(true);else setRefreshing(true);
    try{setItems(await listAiConversations())}catch{}finally{setLoading(false);setRefreshing(false)}
  },[]);
  useFocusEffect(useCallback(()=>{void load(true)},[load]));
  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  return <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>void load(false)}/>}><Text style={styles.title}>AI Conversations</Text>{!items.length?<Text>No saved conversations yet.</Text>:items.map(item=><View key={item.id} style={styles.card}><Text style={styles.subject}>{item.title??"Ask Motoraconect"}</Text><Text>{new Date(item.updated_at).toLocaleString()}</Text><Text onPress={()=>router.push("/(tabs)/services/ask-ai?id="+item.id)} style={styles.open}>Open</Text></View>)}</ScrollView>;
}
const styles=StyleSheet.create({center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:14},title:{fontSize:28,fontWeight:"700"},card:{padding:16,borderWidth:1,borderColor:"#ddd",borderRadius:12,gap:6},subject:{fontSize:17,fontWeight:"700"},open:{fontWeight:"700"}});