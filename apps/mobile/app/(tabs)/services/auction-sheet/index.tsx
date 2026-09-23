import React,{useState} from "react";
import {Alert,Button,ScrollView,StyleSheet,Text,View} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {useRouter} from "expo-router";
import {createAuctionReport} from "@/lib/auction-reports";

export default function AuctionSheetScreen(){
  const [busy,setBusy]=useState(false);
  const router=useRouter();

  async function pickSheet(){
    const permission=await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!permission.granted){Alert.alert("Permission needed","Allow photo access to upload an auction sheet.");return;}
    const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:["images"],quality:1,base64:true});
    if(result.canceled||!result.assets[0]?.base64) return;
    const asset=result.assets[0];
    setBusy(true);
    try{
      const report=await createAuctionReport({
        documentName:asset.fileName??"auction-sheet.jpg",
        mimeType:asset.mimeType??"image/jpeg",
        base64:asset.base64
      });
      if(report) router.push(`/(tabs)/services/auction-sheet/${report.id}`);
    }catch(error){
      Alert.alert("Upload failed",error instanceof Error?error.message:"Unable to create report");
    }finally{setBusy(false);}
  }

  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Auction Sheet Reader</Text>
    <Text style={styles.badge}>MOCKED FOR DEVELOPMENT</Text>
    <Text style={styles.body}>Upload an auction sheet image. The current analyzer is intentionally mocked until a real OCR/vision provider is selected and configured.</Text>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>What the report shows</Text>
      <Text>• DETECTED — text/data found on the sheet</Text>
      <Text>• INTERPRETED — normalized meaning</Text>
      <Text>• USER_PROVIDED — supplied by you</Text>
      <Text>• ESTIMATED — clearly marked estimates</Text>
      <Text>• UNVERIFIED — needs confirmation</Text>
    </View>
    <Button title={busy?"Uploading…":"Choose auction sheet"} disabled={busy} onPress={pickSheet}/>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{padding:20,gap:16},title:{fontSize:28,fontWeight:"700"},badge:{alignSelf:"flex-start",backgroundColor:"#111",color:"#fff",padding:8,borderRadius:6,fontWeight:"700"},body:{fontSize:16,lineHeight:24},card:{padding:16,borderWidth:1,borderColor:"#ddd",borderRadius:12,gap:8},cardTitle:{fontSize:18,fontWeight:"700"}});