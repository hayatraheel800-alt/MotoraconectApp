import React,{useCallback,useState} from "react";
import {ActivityIndicator,RefreshControl,ScrollView,StyleSheet,Text,View} from "react-native";
import {useFocusEffect,useRouter} from "expo-router";
import type {AuctionReport} from "@motoraconect/types";
import {listAuctionReports} from "@/lib/auction-reports";

export default function AuctionReportHistoryScreen(){
  const router=useRouter();
  const [reports,setReports]=useState<AuctionReport[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState<string|null>(null);

  const load=useCallback(async(initial=false)=>{
    if(initial)setLoading(true); else setRefreshing(true);
    try{setError(null);setReports(await listAuctionReports());}
    catch(e){setError(e instanceof Error?e.message:"Unable to load reports");}
    finally{setLoading(false);setRefreshing(false);}
  },[]);

  useFocusEffect(useCallback(()=>{void load(true);},[load]));

  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  return <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>void load(false)}/>} >
    <Text style={styles.title}>Auction Report History</Text>
    {error?<Text style={styles.error}>{error}</Text>:null}
    {!reports.length&&!error?<Text style={styles.empty}>No auction reports yet.</Text>:null}
    {reports.map(report=><View key={report.id} style={styles.card} onTouchEnd={()=>router.push(`/(tabs)/services/auction-sheet/${report.id}`)}>
      <Text style={styles.name}>{report.document_name}</Text>
      <Text>Status: {report.status}</Text>
      <Text style={styles.date}>{new Date(report.created_at).toLocaleString()}</Text>
      {report.error_message?<Text style={styles.error}>{report.error_message}</Text>:null}
    </View>)}
  </ScrollView>;
}
const styles=StyleSheet.create({center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:14},title:{fontSize:26,fontWeight:"700"},card:{padding:16,borderWidth:1,borderColor:"#ddd",borderRadius:12,gap:6},name:{fontWeight:"700",fontSize:17},date:{color:"#666"},empty:{fontSize:16},error:{color:"#b00020"}});