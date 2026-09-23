import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View} from "react-native";
import {router} from "expo-router";
import {listVehicles} from "@motoraconect/api";
import type {Vehicle} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";

export default function VehiclesScreen(){
  const [vehicles,setVehicles]=useState<Vehicle[]>([]);
  const [q,setQ]=useState("");
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const load=useCallback(async()=>{setError(null);const result=await listVehicles(supabase,{q:q.trim()||undefined,limit:30});if(result.error){setError(result.error.userMessage);setVehicles([]);}else setVehicles(result.data);setLoading(false);setRefreshing(false);},[q]);
  useEffect(()=>{load();},[load]);
  return <View style={styles.container}><Text style={styles.heading}>Find a vehicle</Text><TextInput value={q} onChangeText={setQ} onSubmitEditing={load} placeholder="Search make, model, title..." style={styles.search}/>{loading?<ActivityIndicator/>:error?<Text style={styles.error}>{error}</Text>:<FlatList data={vehicles} keyExtractor={item=>item.id} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load();}}/>} ListEmptyComponent={<Text style={styles.empty}>No active vehicles found.</Text>} renderItem={({item})=><Pressable style={styles.card} onPress={()=>router.push(`/(tabs)/vehicles/${item.id}`)}><Text style={styles.title}>{item.title}</Text><Text style={styles.meta}>{item.year} • {item.mileage_km ?? "—"} km • {item.city ?? item.country_code}</Text><Text style={styles.price}>{item.currency_code} {Number(item.price_amount).toLocaleString()}</Text></Pressable>}/>}</View>;
}
const styles=StyleSheet.create({container:{flex:1,padding:20,gap:12},heading:{fontSize:28,fontWeight:"700"},search:{borderWidth:1,borderColor:"#ccc",borderRadius:12,padding:12},card:{padding:16,borderRadius:14,borderWidth:1,borderColor:"#ddd",gap:6},title:{fontSize:18,fontWeight:"700"},meta:{color:"#666"},price:{fontSize:17,fontWeight:"700"},error:{color:"#b00020"},empty:{paddingVertical:30,textAlign:"center",color:"#666"}});