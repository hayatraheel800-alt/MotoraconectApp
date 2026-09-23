import React,{useState} from "react";
import {Alert,Button,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {useRouter} from "expo-router";
import type {ImportCalculationInput,ImportCalculationResult} from "@motoraconect/types";
import {calculateImportCost} from "@/lib/import-calculator";
import {saveImportCalculation} from "@/lib/import-services";

const initial:ImportCalculationInput={
  purchasePrice:0,purchaseCurrency:"JPY",fxRateToPkr:2,freightPkr:0,insurancePkr:0,
  dutyRatePercent:0,taxRatePercent:0,portChargesPkr:0,clearingChargesPkr:0,registrationPkr:0,otherChargesPkr:0
};

function num(value:string){const parsed=Number(value.replace(/,/g,""));return Number.isFinite(parsed)?parsed:0}
function money(value:number){return value.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}

export default function ImportCalculatorScreen(){
  const [input,setInput]=useState(initial);
  const [result,setResult]=useState<ImportCalculationResult|null>(null);
  const [busy,setBusy]=useState(false);
  const router=useRouter();
  const set=(key:keyof ImportCalculationInput,value:string)=>{
    setInput(prev=>({...prev,[key]:key==="purchaseCurrency"?value:num(value)}));
    setResult(null);
  };
  async function calculateAndSave(){
    const next=calculateImportCost(input);
    setResult(next);
    setBusy(true);
    try{await saveImportCalculation(input,next);Alert.alert("Saved","Your estimate was saved to calculation history.");}
    catch(e){Alert.alert("Not saved",e instanceof Error?e.message:"Unable to save estimate");}
    finally{setBusy(false);}
  }
  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Import Cost Calculator</Text>
    <Text style={styles.badge}>ESTIMATE — NOT OFFICIAL CUSTOMS ASSESSMENT</Text>
    <Text style={styles.body}>Enter the vehicle price in its purchase currency. Freight, insurance, taxes, port, clearing, registration, and other charges are entered in PKR. The calculator converts the purchase price using your rate and shows the formula transparently.</Text>
    <Field label="Purchase price" value={String(input.purchasePrice||"")} onChangeText={v=>set("purchasePrice",v)}/>
    <Field label="Purchase currency" value={input.purchaseCurrency} onChangeText={v=>set("purchaseCurrency",v.toUpperCase())}/>
    <Field label="FX rate to PKR (1 currency unit)" value={String(input.fxRateToPkr||"")} onChangeText={v=>set("fxRateToPkr",v)}/>
    <Field label="Freight (PKR)" value={String(input.freightPkr||"")} onChangeText={v=>set("freightPkr",v)}/>
    <Field label="Insurance (PKR)" value={String(input.insurancePkr||"")} onChangeText={v=>set("insurancePkr",v)}/>
    <Field label="Customs duty rate (%)" value={String(input.dutyRatePercent||"")} onChangeText={v=>set("dutyRatePercent",v)}/>
    <Field label="Tax rate (%)" value={String(input.taxRatePercent||"")} onChangeText={v=>set("taxRatePercent",v)}/>
    <Field label="Port charges (PKR)" value={String(input.portChargesPkr||"")} onChangeText={v=>set("portChargesPkr",v)}/>
    <Field label="Clearing charges (PKR)" value={String(input.clearingChargesPkr||"")} onChangeText={v=>set("clearingChargesPkr",v)}/>
    <Field label="Registration (PKR)" value={String(input.registrationPkr||"")} onChangeText={v=>set("registrationPkr",v)}/>
    <Field label="Other charges (PKR)" value={String(input.otherChargesPkr||"")} onChangeText={v=>set("otherChargesPkr",v)}/>
    <Button title={busy?"Saving…":"Calculate and save"} disabled={busy} onPress={calculateAndSave}/>
    <Button title="View calculation history" disabled={busy} onPress={()=>router.push("/(tabs)/services/import-calculator/history")}/>
    {result?<View style={styles.result}>
      <Text style={styles.resultTitle}>Estimated landed cost</Text>
      <Row label="Purchase price in PKR" value={money(result.purchasePricePkr)}/>
      <Row label="CIF" value={money(result.cifPkr)}/>
      <Row label="Duty" value={money(result.dutyPkr)}/>
      <Row label="Tax base" value={money(result.taxBasePkr)}/>
      <Row label="Taxes" value={money(result.taxesPkr)}/>
      <Row label="Additional charges" value={money(result.additionalChargesPkr)}/>
      <Row label="TOTAL PKR" value={money(result.totalPkr)} strong/>
    </View>:null}
  </ScrollView>;
}
function Field({label,value,onChangeText}:{label:string;value:string;onChangeText:(value:string)=>void}){return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput style={styles.input} value={value} onChangeText={onChangeText} keyboardType={label.includes("%")||label.includes("price")||label.includes("rate")||label.includes("(PKR)")?"decimal-pad":"default"} /></View>}
function Row({label,value,strong}:{label:string;value:string;strong?:boolean}){return <View style={styles.row}><Text style={strong?styles.strong:undefined}>{label}</Text><Text style={strong?styles.strong:undefined}>{value} PKR</Text></View>}
const styles=StyleSheet.create({container:{padding:20,gap:13},title:{fontSize:28,fontWeight:"700"},badge:{alignSelf:"flex-start",backgroundColor:"#eee",padding:8,borderRadius:7,fontWeight:"700"},body:{fontSize:15,lineHeight:23},field:{gap:5},label:{fontWeight:"600"},input:{borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:11,fontSize:16},result:{marginTop:8,padding:16,borderWidth:1,borderColor:"#ccc",borderRadius:12,gap:10},resultTitle:{fontSize:20,fontWeight:"700"},row:{flexDirection:"row",justifyContent:"space-between",gap:10},strong:{fontWeight:"800"}});