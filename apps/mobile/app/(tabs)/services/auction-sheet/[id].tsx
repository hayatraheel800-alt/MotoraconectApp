import React,{useEffect,useState} from "react";
import {ActivityIndicator,ScrollView,StyleSheet,Text,View} from "react-native";
import {useLocalSearchParams} from "expo-router";
import type {AuctionReport} from "@motoraconect/types";
import {getAuctionReport} from "@/lib/auction-reports";

type Detail=AuctionReport & {items:{id:string;field_name:string;value_text:string|null;source:string;confidence:string;note:string|null}[]};

export default function AuctionReportScreen(){
  const {id}=useLocalSearchParams<{id:string}>();
  const [report,setReport]=useState<Detail|null>(null);
  const [error,setError]=useState<string|null>(null);
  useEffect(()=>{if(!id)return;getAuctionReport(id).then(setReport).catch(e=>setError(e instanceof Error?e.message:"Unable to load report"));},[id]);
  if(error) return <View style={styles.center}><Text>{error}</Text></View>;
  if(!report) return <View style={styles.center}><ActivityIndicator/></View>;
  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>{report.document_name}</Text>
    <Text style={styles.badge}>MOCKED FOR DEVELOPMENT</Text>
    <Text style={styles.summary}>{report.summary}</Text>
    {report.items.map(item=><View key={item.id} style={styles.item}>
      <Text style={styles.field}>{item.field_name}</Text>
      <Text style={styles.value}>{item.value_text??"—"}</Text>
      <Text>Source: {item.source} · Confidence: {item.confidence}</Text>
      {item.note?<Text style={styles.note}>{item.note}</Text>:null}
    </View>)}
  </ScrollView>;
}
const styles=StyleSheet.create({center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:14},title:{fontSize:24,fontWeight:"700"},badge:{alignSelf:"flex-start",backgroundColor:"#111",color:"#fff",padding:8,borderRadius:6,fontWeight:"700"},summary:{fontSize:16,lineHeight:24},item:{padding:14,borderWidth:1,borderColor:"#ddd",borderRadius:10,gap:5},field:{fontWeight:"700"},value:{fontSize:18},note:{fontStyle:"italic"}});