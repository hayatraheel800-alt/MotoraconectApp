import React,{useCallback,useState} from "react";
import {ActivityIndicator,Button,RefreshControl,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {useFocusEffect,useRouter} from "expo-router";
import type {Part} from "@motoraconect/types";
import {listParts} from "@/lib/parts";

export default function PartsScreen(){
  const router=useRouter();
  const [query,setQuery]=useState("");
  const [parts,setParts]=useState<Part[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState<string|null>(null);

  const load=useCallback(async(initial=false)=>{
    if(initial)setLoading(true);else setRefreshing(true);
    try{setError(null);setParts(await listParts(query))}catch(e){setError(e instanceof Error?e.message:"Unable to load parts")}finally{setLoading(false);setRefreshing(false)}
  },[query]);
  useFocusEffect(useCallback(()=>{void load(true)},[load]));

  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  return <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>void load(false)}/>}>
    <Text style={styles.title}>Parts Marketplace</Text>
    <Text style={styles.body}>Browse active parts and accessories. Only ACTIVE listings are shown to buyers.</Text>
    <View style={styles.searchRow}><TextInput style={styles.input} value={query} onChangeText={setQuery} placeholder="Search title, part number, make…"/><Button title="Search" onPress={()=>void load(false)}/></View>
    <Button title="Sell a part" onPress={()=>router.push("/(tabs)/services/parts/new")}/>
    {error?<Text style={styles.error}>{error}</Text>:null}
    {!parts.length&&!error?<Text style={styles.empty}>No active parts found.</Text>:null}
    {parts.map(part=><View key={part.id} style={styles.card}>
      <Text style={styles.cardTitle}>{part.title}</Text>
      <Text>{part.condition} • {part.currency_code} {Number(part.price_amount).toLocaleString()}</Text>
      <Text>Stock: {part.stock_quantity}{part.city?" • "+part.city:""}</Text>
      {part.part_number?<Text>Part #: {part.part_number}</Text>:null}
      {part.make||part.model?<Text>{[part.make,part.model].filter(Boolean).join(" ")}</Text>:null}
      {part.description?<Text numberOfLines={3}>{part.description}</Text>:null}
    </View>)}
  </ScrollView>;
}
const styles=StyleSheet.create({center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:12},title:{fontSize:28,fontWeight:"700"},body:{fontSize:15,lineHeight:22},searchRow:{flexDirection:"row",gap:8,alignItems:"center"},input:{flex:1,borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:11},card:{padding:16,borderWidth:1,borderColor:"#ddd",borderRadius:12,gap:5},cardTitle:{fontSize:18,fontWeight:"700"},empty:{color:"#666"},error:{color:"#b00020"}});