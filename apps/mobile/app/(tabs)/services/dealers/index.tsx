import React,{useCallback,useState} from "react";
import {ActivityIndicator,Button,RefreshControl,ScrollView,StyleSheet,Text,View} from "react-native";
import {useFocusEffect,useRouter} from "expo-router";
import type {Dealer} from "@motoraconect/types";
import {listActiveDealers} from "@/lib/dealers";

export default function DealersScreen(){
  const router=useRouter();
  const [dealers,setDealers]=useState<Dealer[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const load=useCallback(async(initial=false)=>{
    if(initial)setLoading(true);else setRefreshing(true);
    try{setDealers(await listActiveDealers())}catch{}finally{setLoading(false);setRefreshing(false)}
  },[]);
  useFocusEffect(useCallback(()=>{void load(true)},[load]));
  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  return <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>void load(false)}/>} >
    <Text style={styles.title}>Dealers</Text>
    <Text style={styles.body}>Browse approved dealer profiles. Dealer status is reviewed separately from vehicle listing status.</Text>
    <Button title="Register as a dealer" onPress={()=>router.push("/(tabs)/services/dealers/new")}/>
    <Button title="Manage my dealer" onPress={()=>router.push("/(tabs)/services/dealers/my")}/>
    {!dealers.length?<Text style={styles.empty}>No active dealers yet.</Text>:dealers.map(dealer=><View key={dealer.id} style={styles.card}>
      <Text style={styles.name}>{dealer.business_name}</Text>
      <Text>{dealer.city?dealer.city+" • ":""}{dealer.country_code}</Text>
      {dealer.description?<Text>{dealer.description}</Text>:null}
      {dealer.phone?<Text>Phone: {dealer.phone}</Text>:null}
      {dealer.email?<Text>Email: {dealer.email}</Text>:null}
      {dealer.website?<Text>Website: {dealer.website}</Text>:null}
    </View>)}
  </ScrollView>;
}
const styles=StyleSheet.create({center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:12},title:{fontSize:28,fontWeight:"700"},body:{fontSize:15,lineHeight:22},card:{padding:16,borderWidth:1,borderColor:"#ddd",borderRadius:12,gap:6},name:{fontSize:18,fontWeight:"700"},empty:{color:"#666"}});