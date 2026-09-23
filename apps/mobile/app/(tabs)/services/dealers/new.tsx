import React,{useState} from "react";
import {Alert,Button,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {useRouter} from "expo-router";
import {createDealer} from "@/lib/dealers";

const Field=({label,value,onChangeText,multiline=false}:{label:string;value:string;onChangeText:(v:string)=>void;multiline?:boolean})=><View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput style={[styles.input,multiline&&styles.multiline]} value={value} onChangeText={onChangeText} multiline={multiline}/></View>;

export default function NewDealerScreen(){
  const router=useRouter();
  const [businessName,setBusinessName]=useState("");
  const [description,setDescription]=useState("");
  const [phone,setPhone]=useState("");
  const [email,setEmail]=useState("");
  const [city,setCity]=useState("");
  const [website,setWebsite]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(){
    setBusy(true);
    try{await createDealer({businessName,description,phone,email,city,website});Alert.alert("Submitted","Dealer profile is pending review.");router.replace("/(tabs)/services/dealers")}
    catch(e){Alert.alert("Registration failed",e instanceof Error?e.message:"Unable to create dealer profile")}
    finally{setBusy(false)}
  }
  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Register as a Dealer</Text>
    <Text style={styles.body}>Submit your business details for review. Approved dealers can later have their inventory managed through the dealer workflow.</Text>
    <Field label="Business name" value={businessName} onChangeText={setBusinessName}/>
    <Field label="Description" value={description} onChangeText={setDescription} multiline/>
    <Field label="Phone" value={phone} onChangeText={setPhone}/>
    <Field label="Email" value={email} onChangeText={setEmail}/>
    <Field label="City" value={city} onChangeText={setCity}/>
    <Field label="Website" value={website} onChangeText={setWebsite}/>
    <Button title={busy?"Submitting…":"Submit for review"} disabled={busy} onPress={submit}/>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{padding:20,gap:13},title:{fontSize:28,fontWeight:"700"},body:{fontSize:15,lineHeight:22},field:{gap:5},label:{fontWeight:"600"},input:{borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:11,fontSize:16},multiline:{minHeight:120}});