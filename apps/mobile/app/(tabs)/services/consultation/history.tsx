import React,{useCallback,useState} from "react";
import {ActivityIndicator,RefreshControl,ScrollView,StyleSheet,Text,View} from "react-native";
import {useFocusEffect,useRouter} from "expo-router";
import type {Consultation} from "@motoraconect/types";
import {listConsultations} from "@/lib/consultations";

export default function ConsultationHistoryScreen(){
  const router=useRouter();
  const [items,setItems]=useState<Consultation[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const load=useCallback(async(initial=false)=>{
    if(initial)setLoading(true);else setRefreshing(true);
    try{setError(null);setItems(await listConsultations())}catch(e){setError(e instanceof Error?e.message:"Unable to load consultations")}finally{setLoading(false);setRefreshing(false)}
  },[]);
  useFocusEffect(useCallback(()=>{void load(true)},[load]));
  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  return <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>void load(false)}/>}><Text style={styles.title}>My Consultations</Text>{error?<Text style={styles.error}>{error}</Text>:null}{!items.length&&!error?<Text style={styles.empty}>No consultation requests yet.</Text>:null}{items.map(item=><View key={item.id} style={styles.card}><Text style={styles.subject}>{item.subject}</Text><Text>{item.service_type}</Text><Text style={styles.status}>{item.status}</Text><Text>{new Date(item.updated_at).toLocaleString()}</Text><Text numberOfLines={2}>{item.details}</Text><Text onPress={()=>router.push("/(tabs)/services/consultation/"+item.id)} style={styles.open}>Open consultation</Text></View>)}</ScrollView>;
}
const styles=StyleSheet.create({center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:14},title:{fontSize:28,fontWeight:"700"},card:{padding:16,borderWidth:1,borderColor:"#ddd",borderRadius:12,gap:6},subject:{fontSize:18,fontWeight:"700"},status:{fontWeight:"700"},open:{fontWeight:"700",marginTop:4},empty:{color:"#666"},error:{color:"#b00020"}});