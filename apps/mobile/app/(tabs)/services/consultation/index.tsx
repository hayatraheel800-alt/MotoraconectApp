import React,{useState} from "react";
import {Alert,Button,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {useRouter} from "expo-router";
import {createConsultation} from "@/lib/consultations";

export default function ConsultationRequestScreen(){
  const router=useRouter();
  const [serviceType,setServiceType]=useState("Vehicle buying consultation");
  const [subject,setSubject]=useState("");
  const [details,setDetails]=useState("");
  const [busy,setBusy]=useState(false);

  async function submit(){
    setBusy(true);
    try{
      const consultation=await createConsultation({serviceType,subject,details});
      router.replace("/(tabs)/services/consultation/"+consultation.id);
    }catch(e){
      Alert.alert("Request failed",e instanceof Error?e.message:"Unable to create consultation");
    }finally{setBusy(false)}
  }

  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Consultation</Text>
    <Text style={styles.body}>Request human help with buying, importing, auction-sheet questions, or another vehicle-related service. A consultant can accept and schedule the request later.</Text>
    <Text style={styles.label}>Service type</Text>
    <TextInput style={styles.input} value={serviceType} onChangeText={setServiceType} placeholder="e.g. Import consultation"/>
    <Text style={styles.label}>Subject</Text>
    <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="What do you need help with?"/>
    <Text style={styles.label}>Details</Text>
    <TextInput style={[styles.input,styles.multiline]} value={details} onChangeText={setDetails} placeholder="Describe the vehicle or question..." multiline textAlignVertical="top"/>
    <Button title={busy?"Submitting…":"Request consultation"} disabled={busy} onPress={submit}/>
    <Button title="View my consultation requests" disabled={busy} onPress={()=>router.push("/(tabs)/services/consultation/history")}/>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{padding:20,gap:13},title:{fontSize:28,fontWeight:"700"},body:{fontSize:15,lineHeight:23},label:{fontWeight:"600"},input:{borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:11,fontSize:16},multiline:{minHeight:140}});