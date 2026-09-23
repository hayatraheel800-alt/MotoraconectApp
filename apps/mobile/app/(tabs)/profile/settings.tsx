import React,{useEffect,useState} from "react";
import {Alert,Button,ScrollView,StyleSheet,Text,View} from "react-native";
import * as SecureStore from "expo-secure-store";
import {LOCALE_LABELS,SUPPORTED_LOCALES,type SupportedLocale} from "@motoraconect/config";

const KEY="motoraconect.locale";

export default function SettingsScreen(){
  const [locale,setLocale]=useState<SupportedLocale>("en");
  useEffect(()=>{SecureStore.getItemAsync(KEY).then(value=>{if(value==="en"||value==="ur")setLocale(value)}).catch(()=>{})},[]);
  async function choose(next:SupportedLocale){
    try{await SecureStore.setItemAsync(KEY,next);setLocale(next);Alert.alert("Language saved","New screens can read this preference. Full-screen translation rollout is part of the internationalization follow-up.")}catch(e){Alert.alert("Unable to save",e instanceof Error?e.message:"Please try again")}
  }
  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Settings</Text>
    <Text style={styles.section}>Language</Text>
    {SUPPORTED_LOCALES.map(item=><View key={item} style={styles.row}><View style={styles.flex}><Text style={styles.label}>{LOCALE_LABELS[item]}</Text><Text>{locale===item?"Selected":""}</Text></View><Button title={locale===item?"Selected":"Use"} disabled={locale===item} onPress={()=>void choose(item)}/></View>)}
    <Text style={styles.note}>The preference is stored securely on this device. Existing screens will be migrated to shared translations incrementally.</Text>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{padding:20,gap:16},title:{fontSize:28,fontWeight:"700"},section:{fontSize:21,fontWeight:"700"},row:{flexDirection:"row",alignItems:"center",gap:12,paddingVertical:10},flex:{flex:1},label:{fontSize:17,fontWeight:"600"},note:{color:"#666",lineHeight:22}});
