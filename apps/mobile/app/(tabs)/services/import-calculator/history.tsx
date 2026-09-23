import React,{useCallback,useState} from "react";
import {ActivityIndicator,RefreshControl,ScrollView,StyleSheet,Text,View} from "react-native";
import {useFocusEffect} from "expo-router";
import type {ImportCalculationRecord} from "@motoraconect/types";
import {listImportCalculations} from "@/lib/import-services";

export default function ImportHistoryScreen(){
  const [items,setItems]=useState<ImportCalculationRecord[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const load=useCallback(async(initial=false)=>{
    if(initial)setLoading(true);else setRefreshing(true);
    try{setError(null);setItems(await listImportCalculations())}catch(e){setError(e instanceof Error?e.message:"Unable to load history")}finally{setLoading(false);setRefreshing(false)}
  },[]);
  useFocusEffect(useCallback(()=>{void load(true)},[load]));
  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  return <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>void load(false)}/>}><Text style={styles.title}>Calculation History</Text>{error?<Text style={styles.error}>{error}</Text>:null}{!items.length&&!error?<Text>No saved estimates yet.</Text>:null}{items.map(item=><View key={item.id} style={styles.card}><Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text><Text style={styles.total}>{item.total_pkr.toLocaleString()} PKR</Text><Text>{item.input.purchasePrice.toLocaleString()} {item.input.purchaseCurrency} × {item.input.fxRateToPkr} FX</Text><Text>Duty {item.input.dutyRatePercent}% • Tax {item.input.taxRatePercent}%</Text></View>)}</ScrollView>;
}
const styles=StyleSheet.create({center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:14},title:{fontSize:26,fontWeight:"700"},card:{padding:16,borderWidth:1,borderColor:"#ddd",borderRadius:12,gap:6},date:{color:"#666"},total:{fontSize:20,fontWeight:"800"},error:{color:"#b00020"}});