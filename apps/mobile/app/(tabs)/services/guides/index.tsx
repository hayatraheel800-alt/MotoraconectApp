import React,{useCallback,useState} from "react";
import {ActivityIndicator,RefreshControl,ScrollView,StyleSheet,Text,View} from "react-native";
import {useFocusEffect} from "expo-router";
import type {Guide,GuideCategory} from "@motoraconect/types";
import {listGuides} from "@/lib/import-services";

export default function GuidesScreen(){
  const [categories,setCategories]=useState<GuideCategory[]>([]);
  const [guides,setGuides]=useState<Guide[]>([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const load=useCallback(async(initial=false)=>{
    if(initial)setLoading(true);else setRefreshing(true);
    try{const data=await listGuides();setCategories(data.categories);setGuides(data.guides)}catch{}finally{setLoading(false);setRefreshing(false)}
  },[]);
  useFocusEffect(useCallback(()=>{void load(true)},[load]));
  if(loading)return <View style={styles.center}><ActivityIndicator/></View>;
  return <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>void load(false)}/>}><Text style={styles.title}>Import & Buying Guides</Text><Text style={styles.body}>Practical explanations for import estimates and auction-sheet uncertainty. Guide content is informational and does not replace official customs assessment or professional advice.</Text>{categories.map(category=><View key={category.id} style={styles.category}><Text style={styles.categoryTitle}>{category.name}</Text>{guides.filter(g=>g.category_id===category.id).map(guide=><View key={guide.id} style={styles.card}><Text style={styles.cardTitle}>{guide.title}</Text><Text style={styles.summary}>{guide.summary}</Text><Text style={styles.body}>{guide.body}</Text></View>)}</View>)}</ScrollView>;
}
const styles=StyleSheet.create({center:{flex:1,alignItems:"center",justifyContent:"center"},container:{padding:20,gap:14},title:{fontSize:28,fontWeight:"700"},body:{fontSize:15,lineHeight:23},category:{gap:10},categoryTitle:{fontSize:21,fontWeight:"700"},card:{padding:16,borderWidth:1,borderColor:"#ddd",borderRadius:12,gap:7},cardTitle:{fontSize:18,fontWeight:"700"},summary:{fontWeight:"600"}});