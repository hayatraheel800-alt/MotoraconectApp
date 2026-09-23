import React, {useEffect, useState} from "react";
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {router, useLocalSearchParams} from "expo-router";
import {getVehicle} from "@motoraconect/api";
import type {Vehicle} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";

export default function VehicleDetailScreen(){
  const {id}=useLocalSearchParams<{id:string}>(); const [vehicle,setVehicle]=useState<Vehicle|null>(null); const [error,setError]=useState<string|null>(null);
  useEffect(()=>{if(!id)return;getVehicle(supabase,id).then(result=>result.error?setError(result.error.userMessage):setVehicle(result.data));},[id]);
  if(error)return <View style={styles.center}><Text>{error}</Text></View>;
  if(!vehicle)return <View style={styles.center}><ActivityIndicator/></View>;
  return <ScrollView contentContainerStyle={styles.container}><Text style={styles.title}>{vehicle.title}</Text><Text style={styles.price}>{vehicle.currency_code} {Number(vehicle.price_amount).toLocaleString()}</Text><Text style={styles.meta}>{vehicle.year} • {vehicle.make} {vehicle.model} {vehicle.variant ?? ""}</Text><Text style={styles.meta}>{vehicle.mileage_km ?? "—"} km • {vehicle.fuel_type ?? "Fuel —"} • {vehicle.transmission ?? "Transmission —"}</Text><Text style={styles.location}>{vehicle.city ?? vehicle.country_code}</Text><Text style={styles.description}>{vehicle.description ?? "No description provided."}</Text><Pressable style={styles.button} onPress={()=>router.push(`/(tabs)/sell/${vehicle.id}`)}><Text style={styles.buttonText}>Edit listing</Text></Pressable></ScrollView>;
}
const styles=StyleSheet.create({container:{padding:20,gap:14},center:{flex:1,alignItems:"center",justifyContent:"center"},title:{fontSize:28,fontWeight:"700"},price:{fontSize:22,fontWeight:"700"},meta:{fontSize:16,color:"#555"},location:{fontSize:16},description:{fontSize:16,lineHeight:24},button:{padding:14,borderRadius:12,backgroundColor:"#111",alignItems:"center"},buttonText:{color:"#fff",fontWeight:"700"}});