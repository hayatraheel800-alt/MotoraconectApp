import React,{useCallback,useState} from "react";
import {ActivityIndicator,Button,RefreshControl,ScrollView,StyleSheet,Text,View} from "react-native";
import {useFocusEffect,useRouter} from "expo-router";
import type {Conversation,Notification} from "@motoraconect/types";
import {listConversations,listNotifications,markNotificationRead} from "@/lib/messaging";

export default function MessagesScreen(){
  const router=useRouter();
  const [conversations,setConversations]=useState<Conversation[]>([]);
  const [notifications,setNotifications]=useState<Notification[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState<string|null>(null);

  const load=useCallback(async(initial=false)=>{
    if(initial)setLoading(true);else setRefreshing(true);
    try{setError(null);const [c,n]=await Promise.all([listConversations(),listNotifications()]);setConversations(c);setNotifications(n)}
    catch(e){setError(e instanceof Error?e.message:"Unable to load messages")}
    finally{setLoading(false);setRefreshing(false)}
  },[]);
  useFocusEffect(useCallback(()=>{void load(true)},[load]));
  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  return <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>void load(false)}/>} >
    <Text style={styles.title}>Messages</Text>
    <Text style={styles.section}>Notifications</Text>
    {error?<Text style={styles.error}>{error}</Text>:null}
    {!notifications.length&&!error?<Text style={styles.empty}>No notifications yet.</Text>:null}
    {notifications.map(n=><View key={n.id} style={[styles.note,!n.read_at&&styles.unread]}><Text style={styles.noteTitle}>{n.title}</Text><Text>{n.body}</Text>{!n.read_at?<Button title="Mark read" onPress={async()=>{await markNotificationRead(n.id);void load(false)}}/>:null}</View>)}
    <Text style={styles.section}>Conversations</Text>
    {!conversations.length&&!error?<Text style={styles.empty}>No conversations yet.</Text>:null}
    {conversations.map(c=><View key={c.id} style={styles.card}><Text style={styles.cardTitle}>{c.title??"Conversation"}</Text><Text>{new Date(c.updated_at).toLocaleString()}</Text><Button title="Open" onPress={()=>router.push("/(tabs)/profile/messages/"+c.id)}/></View>)}
  </ScrollView>;
}
const styles=StyleSheet.create({center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:12},title:{fontSize:28,fontWeight:"700"},section:{fontSize:21,fontWeight:"700",marginTop:8},card:{padding:15,borderWidth:1,borderColor:"#ddd",borderRadius:10,gap:5},cardTitle:{fontWeight:"700",fontSize:17},note:{padding:14,borderWidth:1,borderColor:"#ddd",borderRadius:10,gap:5},unread:{borderWidth:2},noteTitle:{fontWeight:"700"},empty:{color:"#666"},error:{color:"#b00020"}});