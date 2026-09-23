import React,{useCallback,useState} from "react";
import {ActivityIndicator,Button,RefreshControl,ScrollView,StyleSheet,Text,View} from "react-native";
import {useFocusEffect} from "expo-router";
import type {Dealer} from "@motoraconect/types";
import {addVehicleToDealerInventory,listMyDealerInventory,listMyDealers,listMyVehicles} from "@/lib/dealers";

export default function MyDealerScreen(){
  const [dealers,setDealers]=useState<Dealer[]>([]);
  const [vehicles,setVehicles]=useState<{id:string;title:string;status:string}[]>([]);
  const [inventory,setInventory]=useState<{id:string;vehicle_id:string}[]>([]);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const load=useCallback(async()=>{
    setLoading(true);
    try{
      const nextDealers=await listMyDealers();
      setDealers(nextDealers);setVehicles(await listMyVehicles());
      if(nextDealers[0])setInventory(await listMyDealerInventory(nextDealers[0].id));
    }finally{setLoading(false)}
  },[]);
  useFocusEffect(useCallback(()=>{void load()},[load]));
  async function addVehicle(vehicleId:string){
    const dealer=dealers[0];if(!dealer||dealer.status!=="ACTIVE"||inventory.some(x=>x.vehicle_id===vehicleId))return;
    setBusy(true);
    try{await addVehicleToDealerInventory(dealer.id,vehicleId);await load()}finally{setBusy(false)}
  }
  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  const dealer=dealers[0];
  return <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={loading} onRefresh={()=>void load()}/>}>
    <Text style={styles.title}>My Dealer</Text>
    {!dealer?<Text>No dealer profile yet. Register from the Dealers page.</Text>:<>
      <Text style={styles.name}>{dealer.business_name}</Text>
      <Text>Status: {dealer.status}</Text>
      {dealer.status!=="ACTIVE"?<Text style={styles.muted}>Inventory management unlocks after dealer approval.</Text>:<>
        <Text style={styles.section}>Add your vehicles to dealer inventory</Text>
        {vehicles.map(v=><View key={v.id} style={styles.row}><View style={styles.flex}><Text style={styles.vehicle}>{v.title}</Text><Text>{v.status}</Text></View><Button title="Add" disabled={busy||inventory.some(x=>x.vehicle_id===v.id)} onPress={()=>void addVehicle(v.id)}/></View>)}
        <Text style={styles.section}>Current inventory</Text>
        {!inventory.length?<Text>No vehicles added yet.</Text>:inventory.map(i=><Text key={i.id}>Vehicle ID: {i.vehicle_id}</Text>)}
      </>}
    </>}
  </ScrollView>;
}
const styles=StyleSheet.create({center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:12},title:{fontSize:28,fontWeight:"700"},name:{fontSize:20,fontWeight:"800"},section:{fontSize:20,fontWeight:"700",marginTop:8},muted:{color:"#666"},row:{flexDirection:"row",gap:10,alignItems:"center",paddingVertical:8},flex:{flex:1},vehicle:{fontWeight:"700"}});