import React from "react";
import {Button,ScrollView,StyleSheet,Text} from "react-native";
import {useRouter} from "expo-router";

export default function ServicesScreen(){
  const router=useRouter();
  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Services</Text>
    <Text style={styles.body}>Vehicle services that sit around buying, importing, verifying, and understanding a car.</Text>
    <Button title="Auction Sheet Reader" onPress={()=>router.push("/(tabs)/services/auction-sheet")}/>
    <Text style={styles.muted}>Phase 4 • mocked AI until a real OCR/vision provider is configured</Text>
    <Text style={styles.muted}>Import calculator and guides arrive in Phase 5. Ask Motoraconect AI arrives later.</Text>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{padding:20,gap:16},title:{fontSize:30,fontWeight:"700"},body:{fontSize:16,lineHeight:24},muted:{color:"#666",lineHeight:21}});