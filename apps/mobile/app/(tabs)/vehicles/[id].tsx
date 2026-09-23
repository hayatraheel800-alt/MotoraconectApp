import React, {useEffect, useState} from "react";
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {getVehicle} from "@motoraconect/api";
import type {Vehicle} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";
import {VehicleImageGallery} from "@/components/VehicleImageGallery";
import {createConversation} from "@/lib/messaging";

export default function VehicleDetailScreen(){
  const {id}=useLocalSearchParams<{id:string}>();
  const [vehicle,setVehicle]=useState<Vehicle|null>(null);
  const [userId,setUserId]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);
  const [startingChat,setStartingChat]=useState(false);
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>setUserId(data.user?.id??null));
    if(!id)return;
    getVehicle(supabase,id).then(result=>result.error?setError(result.error.userMessage):setVehicle(result.data));
  },[id]);
  async function messageSeller(){
    if(!vehicle)return;
    setStartingChat(true);
    try{
      const conversation=await createConversation(vehicle.seller_id,vehicle.title,vehicle.id);
      router.push(`/(tabs)/profile/messages/${conversation.id}`);
    }catch(e){setError(e instanceof Error?e.message:"Unable to start conversation")}
    finally{setStartingChat(false)}
  }
  if(error)return <View style={styles.center}><Text>{error}</Text></View>;
  if(!vehicle)return <View style={styles.center}><ActivityIndicator/></View>;
  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>{vehicle.title}</Text>
    <VehicleImageGallery vehicleId={vehicle.id}/>
    <Text style={styles.price}>{vehicle.currency_code} {Number(vehicle.price_amount).toLocaleString()}</Text>
    <Text style={styles.meta}>{vehicle.year} • {vehicle.make} {vehicle.model} {vehicle.variant ?? ""}</Text>
    <Text style={styles.meta}>{vehicle.mileage_km ?? "—"} km • {vehicle.fuel_type ?? "Fuel —"} • {vehicle.transmission ?? "Transmission —"}</Text>
    <Text style={styles.location}>{vehicle.city ?? vehicle.country_code}</Text>
    <Text style={styles.description}>{vehicle.description ?? "No description provided."}</Text>
    {userId!==vehicle.seller_id?<Pressable style={styles.button} disabled={startingChat} onPress={messageSeller}><Text style={styles.buttonText}>{startingChat?"Opening…":"Message seller"}</Text></Pressable>:null}
    {userId===vehicle.seller_id?<Pressable style={styles.button} onPress={()=>router.push(`/(tabs)/sell/${vehicle.id}`)}><Text style={styles.buttonText}>Edit listing</Text></Pressable>:null}
  </ScrollView>;
}
const styles=StyleSheet.create({container:{padding:20,gap:14},center:{flex:1,alignItems:"center",justifyContent:"center"},title:{fontSize:28,fontWeight:"700"},price:{fontSize:22,fontWeight:"700"},meta:{fontSize:16,color:"#555"},location:{fontSize:16},description:{fontSize:16,lineHeight:24},button:{padding:14,borderRadius:12,backgroundColor:"#111",alignItems:"center"},buttonText:{color:"#fff",fontWeight:"700"}});