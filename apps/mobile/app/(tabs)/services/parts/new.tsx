import React,{useState} from "react";
import {Alert,Button,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {useRouter} from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {createPart,submitPartForReview} from "@/lib/parts";

const Field=({label,value,onChangeText,multiline=false}:{label:string;value:string;onChangeText:(v:string)=>void;multiline?:boolean})=><View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput style={[styles.input,multiline&&styles.multiline]} value={value} onChangeText={onChangeText} multiline={multiline}/></View>;

export default function NewPartScreen(){
  const router=useRouter();
  const [title,setTitle]=useState("");
  const [partNumber,setPartNumber]=useState("");
  const [make,setMake]=useState("");
  const [model,setModel]=useState("");
  const [description,setDescription]=useState("");
  const [condition,setCondition]=useState("USED" as "NEW"|"USED"|"REFURBISHED"|"OEM"|"AFTERMARKET");
  const [price,setPrice]=useState("");
  const [stock,setStock]=useState("1");
  const [city,setCity]=useState("");
  const [base64,setBase64]=useState<string|undefined>();
  const [mimeType,setMimeType]=useState<string|undefined>();
  const [fileName,setFileName]=useState<string|undefined>();
  const [busy,setBusy]=useState(false);

  async function pickPhoto(){
    const permission=await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!permission.granted){Alert.alert("Permission needed","Allow photo access to add a part image.");return;}
    const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:["images"],base64:true,quality:1});
    if(result.canceled||!result.assets[0]?.base64)return;
    const asset=result.assets[0];
    setBase64(asset.base64);setMimeType(asset.mimeType??"image/jpeg");setFileName(asset.fileName??"part.jpg");
  }

  async function save(submit:boolean){
    setBusy(true);
    try{
      const part=await createPart({title,partNumber,make,model,description,condition,price:Number(price),stock:Number(stock),city,base64,mimeType,fileName});
      if(submit){await submitPartForReview(part.id);Alert.alert("Submitted","Your part is now pending review.");}
      else Alert.alert("Saved","Draft part saved.");
      router.replace("/(tabs)/services/parts");
    }catch(e){Alert.alert("Save failed",e instanceof Error?e.message:"Unable to save part")}
    finally{setBusy(false)}
  }

  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Sell a Part</Text>
    <Text style={styles.body}>Create a draft, optionally add one photo, then submit it for review. Sellers cannot publish directly to ACTIVE.</Text>
    <Field label="Title" value={title} onChangeText={setTitle}/>
    <Field label="Part number" value={partNumber} onChangeText={setPartNumber}/>
    <Field label="Make" value={make} onChangeText={setMake}/>
    <Field label="Model" value={model} onChangeText={setModel}/>
    <Field label="Condition (NEW / USED / REFURBISHED / OEM / AFTERMARKET)" value={condition} onChangeText={v=>setCondition(v.toUpperCase() as typeof condition)}/>
    <Field label="Price (PKR)" value={price} onChangeText={setPrice}/>
    <Field label="Stock quantity" value={stock} onChangeText={setStock}/>
    <Field label="City" value={city} onChangeText={setCity}/>
    <Field label="Description" value={description} onChangeText={setDescription} multiline/>
    {fileName?<Text>Selected image: {fileName}</Text>:null}
    <Button title="Choose part photo" disabled={busy} onPress={pickPhoto}/>
    <Button title={busy?"Saving…":"Save draft"} disabled={busy} onPress={()=>void save(false)}/>
    <Button title="Submit for review" disabled={busy} onPress={()=>void save(true)}/>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{padding:20,gap:13},title:{fontSize:28,fontWeight:"700"},body:{fontSize:15,lineHeight:22},field:{gap:5},label:{fontWeight:"600"},input:{borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:11,fontSize:16},multiline:{minHeight:120}});