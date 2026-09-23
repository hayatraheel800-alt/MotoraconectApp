import React from "react";
import {Button,ScrollView,StyleSheet,Text} from "react-native";
import {useRouter} from "expo-router";

export default function ServicesScreen(){
  const router=useRouter();
  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Services</Text>
    <Text style={styles.body}>Tools around buying, importing, verifying, and understanding a vehicle.</Text>
    <Button title="Auction Sheet Reader" onPress={()=>router.push("/(tabs)/services/auction-sheet")}/>
    <Button title="Import Cost Calculator" onPress={()=>router.push("/(tabs)/services/import-calculator")}/>
    <Button title="Import & Buying Guides" onPress={()=>router.push("/(tabs)/services/guides")}/>
    <Button title="Consultation" onPress={()=>router.push("/(tabs)/services/consultation")}/>
    <Button title="Payments (Development)" onPress={()=>router.push("/(tabs)/services/payments")}/>
    <Button title="Ask Motoraconect AI" onPress={()=>router.push("/(tabs)/services/ask-ai")}/>
    <Button title="Parts Marketplace" onPress={()=>router.push("/(tabs)/services/parts")}/>
    <Button title="Dealers" onPress={()=>router.push("/(tabs)/services/dealers")}/>
    <Button title="AI Conversation History" onPress={()=>router.push("/(tabs)/services/ask-ai-history")}/>
    <Text style={styles.muted}>Auction analysis is currently mocked. Import calculations are estimates entered by the user and are not official customs assessments.</Text>
    <Text style={styles.muted}>Ask Motoraconect AI will be added after the domain services are established.</Text>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{padding:20,gap:16},title:{fontSize:30,fontWeight:"700"},body:{fontSize:16,lineHeight:24},muted:{color:"#666",lineHeight:21}});