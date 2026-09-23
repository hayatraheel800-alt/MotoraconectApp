import React,{useCallback,useState} from "react";
import {Alert,Button,RefreshControl,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import {useFocusEffect} from "expo-router";
import type {Payment} from "@motoraconect/types";
import {createMockPayment,listPayments} from "@/lib/payments";

export default function PaymentsScreen(){
  const [amount,setAmount]=useState("");
  const [purpose,setPurpose]=useState("Motoraconect consultation");
  const [payments,setPayments]=useState<Payment[]>([]);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [refreshing,setRefreshing]=useState(false);

  const load=useCallback(async(initial=false)=>{
    if(initial)setLoading(true);else setRefreshing(true);
    try{setPayments(await listPayments())}catch{}finally{setLoading(false);setRefreshing(false)}
  },[]);
  useFocusEffect(useCallback(()=>{void load(true)},[load]));

  async function pay(){
    const value=Number(amount);
    setBusy(true);
    try{
      const payment=await createMockPayment({amount:value,currency:"PKR",purpose});
      Alert.alert("Development payment recorded",payment.metadata.message?String(payment.metadata.message):"Mock payment complete.");
      setAmount("");
      void load(false);
    }catch(e){Alert.alert("Payment failed",e instanceof Error?e.message:"Unable to create payment")}
    finally{setBusy(false)}
  }

  return <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>void load(false)}/>} >
    <Text style={styles.title}>Payments</Text>
    <Text style={styles.badge}>MOCKED FOR DEVELOPMENT — NO REAL CHARGE</Text>
    <Text style={styles.body}>This screen demonstrates the payment lifecycle only. No card details are collected and no external payment gateway is connected.</Text>
    <Text style={styles.label}>Purpose</Text>
    <TextInput style={styles.input} value={purpose} onChangeText={setPurpose}/>
    <Text style={styles.label}>Amount (PKR)</Text>
    <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00"/>
    <Button title={busy?"Processing…":"Create mock payment"} disabled={busy} onPress={pay}/>
    <Text style={styles.section}>Payment history</Text>
    {loading?<Text>Loading…</Text>:payments.map(payment=><View key={payment.id} style={styles.card}><Text style={styles.total}>{Number(payment.amount).toLocaleString()} {payment.currency}</Text><Text>{payment.purpose}</Text><Text>Status: {payment.status}</Text><Text>{new Date(payment.created_at).toLocaleString()}</Text></View>)}
  </ScrollView>;
}
const styles=StyleSheet.create({container:{padding:20,gap:12},title:{fontSize:28,fontWeight:"700"},badge:{alignSelf:"flex-start",padding:8,borderWidth:1,borderColor:"#ccc",borderRadius:8,fontWeight:"700"},body:{fontSize:15,lineHeight:23},label:{fontWeight:"600"},input:{borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:11,fontSize:16},section:{fontSize:20,fontWeight:"700",marginTop:8},card:{padding:15,borderWidth:1,borderColor:"#ddd",borderRadius:10,gap:5},total:{fontSize:19,fontWeight:"800"}});