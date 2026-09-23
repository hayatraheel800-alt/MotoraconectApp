import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, TextInput, View} from "react-native";
import {router} from "expo-router";
import {listVehicles} from "@motoraconect/api";
import type {Vehicle} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";

export default function VehiclesScreen(){
  const [vehicles,setVehicles]=useState<Vehicle[]>([]); const [q,setQ]=useState(""); const [make,setMake]=useState("");
  const [city,setCity]=useState(""); const [minPrice,setMinPrice]=useState(""); const [maxPrice,setMaxPrice]=useState("");
  const [minYear,setMinYear]=useState(""); const [maxYear,setMaxYear]=useState(""); const [filtersOpen,setFiltersOpen]=useState(false);
  const [loading,setLoading]=useState(true); const [refreshing,setRefreshing]=useState(false); const [error,setError]=useState<string|null>(null);

  const load=useCallback(async()=>{setError(null);const result=await listVehicles(supabase,{q:q.trim()||undefined,make:make.trim()||undefined,city:city.trim()||undefined,
    minPrice:minPrice?Number(minPrice):undefined,maxPrice:maxPrice?Number(maxPrice):undefined,minYear:minYear?Number(minYear):undefined,maxYear:maxYear?Number(maxYear):undefined,limit:30});
    if(result.error){setError(result.error.userMessage);setVehicles([]);}else setVehicles(result.data);setLoading(false);setRefreshing(false);},[q,make,city,minPrice,maxPrice,minYear,maxYear]);
  useEffect(()=>{load();},[load]);
  function clearFilters(){setMake("");setCity("");setMinPrice("");setMaxPrice("");setMinYear("");setMaxYear("");}
  const filterCount=[make,city,minPrice,maxPrice,minYear,maxYear].filter(Boolean).length;

  return <View style={styles.container}><Text style={styles.heading}>Find a vehicle</Text>
    <TextInput value={q} onChangeText={setQ} onSubmitEditing={load} placeholder="Search make, model, title..." style={styles.search}/>
    <Pressable style={styles.filterButton} onPress={()=>setFiltersOpen(true)}><Text style={styles.filterText}>Filters{filterCount ? ` (${filterCount})` : ""}</Text></Pressable>
    {loading?<ActivityIndicator/>:error?<Text style={styles.error}>{error}</Text>:<FlatList data={vehicles} keyExtractor={item=>item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load();}}/>}
      ListEmptyComponent={<Text style={styles.empty}>No active vehicles found.</Text>}
      renderItem={({item})=><Pressable style={styles.card} onPress={()=>router.push(`/(tabs)/vehicles/${item.id}`)}><Text style={styles.title}>{item.title}</Text><Text style={styles.meta}>{item.year} • {item.mileage_km ?? "—"} km • {item.city ?? item.country_code}</Text><Text style={styles.price}>{item.currency_code} {Number(item.price_amount).toLocaleString()}</Text></Pressable>}/>}
    <Modal visible={filtersOpen} animationType="slide" transparent onRequestClose={()=>setFiltersOpen(false)}><View style={styles.overlay}><View style={styles.sheet}>
      <Text style={styles.sheetTitle}>Vehicle filters</Text>
      <TextInput placeholder="Make" value={make} onChangeText={setMake} style={styles.input}/><TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input}/>
      <View style={styles.row}><TextInput placeholder="Min price" value={minPrice} onChangeText={setMinPrice} keyboardType="decimal-pad" style={[styles.input,styles.half]}/><TextInput placeholder="Max price" value={maxPrice} onChangeText={setMaxPrice} keyboardType="decimal-pad" style={[styles.input,styles.half]}/></View>
      <View style={styles.row}><TextInput placeholder="Min year" value={minYear} onChangeText={setMinYear} keyboardType="number-pad" style={[styles.input,styles.half]}/><TextInput placeholder="Max year" value={maxYear} onChangeText={setMaxYear} keyboardType="number-pad" style={[styles.input,styles.half]}/></View>
      <View style={styles.actions}><Pressable style={styles.secondary} onPress={clearFilters}><Text style={styles.secondaryText}>Clear</Text></Pressable><Pressable style={styles.button} onPress={()=>{setFiltersOpen(false);load();}}><Text style={styles.buttonText}>Apply filters</Text></Pressable></View>
    </View></View></Modal>
  </View>;
}
const styles=StyleSheet.create({container:{flex:1,padding:20,gap:12},heading:{fontSize:28,fontWeight:"700"},search:{borderWidth:1,borderColor:"#ccc",borderRadius:12,padding:12},filterButton:{borderWidth:1,borderColor:"#ccc",borderRadius:12,padding:12,alignItems:"center"},filterText:{fontWeight:"700"},card:{padding:16,borderRadius:14,borderWidth:1,borderColor:"#ddd",gap:6},title:{fontSize:18,fontWeight:"700"},meta:{color:"#666"},price:{fontSize:17,fontWeight:"700"},error:{color:"#b00020"},empty:{paddingVertical:30,textAlign:"center",color:"#666"},
overlay:{flex:1,justifyContent:"flex-end",backgroundColor:"rgba(0,0,0,.35)"},sheet:{backgroundColor:"#fff",padding:20,borderTopLeftRadius:20,borderTopRightRadius:20,gap:12},sheetTitle:{fontSize:22,fontWeight:"700"},input:{borderWidth:1,borderColor:"#ccc",borderRadius:12,padding:12},row:{flexDirection:"row",gap:10},half:{flex:1},actions:{flexDirection:"row",gap:10},secondary:{flex:1,padding:14,borderRadius:12,borderWidth:1,borderColor:"#ccc",alignItems:"center"},secondaryText:{fontWeight:"700"},button:{flex:1,padding:14,borderRadius:12,backgroundColor:"#111",alignItems:"center"},buttonText:{color:"#fff",fontWeight:"700"}});
