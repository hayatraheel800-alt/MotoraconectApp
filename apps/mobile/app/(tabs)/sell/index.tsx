import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { createVehicle } from "@motoraconect/api";
import { supabase } from "@/lib/supabase";

const steps = ["Basics", "Condition", "Pricing", "Description"];

export default function SellScreen() {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState(""); const [make, setMake] = useState(""); const [model, setModel] = useState("");
  const [variant, setVariant] = useState(""); const [year, setYear] = useState(""); const [mileage, setMileage] = useState("");
  const [city, setCity] = useState(""); const [price, setPrice] = useState(""); const [description, setDescription] = useState(""); const [saving, setSaving] = useState(false);

  function validateCurrentStep() {
    if (step === 0 && (!title.trim() || !make.trim() || !model.trim() || !year)) { Alert.alert("Missing information", "Add listing title, make, model, and year."); return false; }
    if (step === 1 && mileage && Number(mileage) < 0) { Alert.alert("Invalid mileage", "Mileage cannot be negative."); return false; }
    if (step === 2 && (!price || Number(price) <= 0)) { Alert.alert("Invalid price", "Enter a price greater than zero."); return false; }
    return true;
  }
  function next() { if (validateCurrentStep()) setStep((current) => Math.min(current + 1, steps.length - 1)); }
  function back() { setStep((current) => Math.max(current - 1, 0)); }

  async function saveDraft() {
    if (!validateCurrentStep()) return;
    setSaving(true);
    const result = await createVehicle(supabase, { title: title.trim(), make: make.trim(), model: model.trim(), variant: variant.trim() || null,
      year: Number(year), mileage_km: mileage ? Number(mileage) : null, price_amount: Number(price), city: city.trim() || null, description: description.trim() || null });
    setSaving(false);
    if (result.error) { Alert.alert("Could not save", result.error.userMessage); return; }
    Alert.alert("Draft saved", "Your vehicle is saved as a draft. You can add photos and continue editing.", [
      { text: "View listing", onPress: () => router.push("/(tabs)/vehicles/" + result.data.id) },
    ]);
  }

  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.heading}>Sell a vehicle</Text>
    <Text style={styles.help}>Complete the listing in small steps. You can save a draft after entering the required details.</Text>
    <View style={styles.progress}>{steps.map((label, index) => <View key={label} style={styles.progressItem}><View style={[styles.dot, index <= step && styles.activeDot]} /><Text style={[styles.stepLabel, index === step && styles.activeLabel]}>{label}</Text></View>)}</View>

    {step === 0 && <View style={styles.section}><Text style={styles.sectionTitle}>Vehicle basics</Text>
      <TextInput placeholder="Listing title" value={title} onChangeText={setTitle} style={styles.input}/><TextInput placeholder="Make" value={make} onChangeText={setMake} style={styles.input}/>
      <TextInput placeholder="Model" value={model} onChangeText={setModel} style={styles.input}/><TextInput placeholder="Variant (optional)" value={variant} onChangeText={setVariant} style={styles.input}/>
      <TextInput placeholder="Year" value={year} onChangeText={setYear} keyboardType="number-pad" style={styles.input}/><TextInput placeholder="City (optional)" value={city} onChangeText={setCity} style={styles.input}/>
    </View>}
    {step === 1 && <View style={styles.section}><Text style={styles.sectionTitle}>Condition & usage</Text><TextInput placeholder="Mileage (km)" value={mileage} onChangeText={setMileage} keyboardType="number-pad" style={styles.input}/><Text style={styles.help}>More condition fields will be added as the marketplace schema expands.</Text></View>}
    {step === 2 && <View style={styles.section}><Text style={styles.sectionTitle}>Pricing</Text><TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={styles.input}/><Text style={styles.help}>Currency currently follows the marketplace database default.</Text></View>}
    {step === 3 && <View style={styles.section}><Text style={styles.sectionTitle}>Description</Text><TextInput placeholder="Describe the vehicle, history, condition, and notable features" value={description} onChangeText={setDescription} multiline style={[styles.input, styles.textarea]}/></View>}

    <View style={styles.actions}>{step > 0 && <Pressable style={styles.secondary} onPress={back}><Text style={styles.secondaryText}>Back</Text></Pressable>}
      {step < steps.length - 1 ? <Pressable style={styles.button} onPress={next}><Text style={styles.buttonText}>Next</Text></Pressable> :
      <Pressable disabled={saving} style={[styles.button, saving && styles.disabled]} onPress={saveDraft}><Text style={styles.buttonText}>{saving ? "Saving..." : "Save draft"}</Text></Pressable>}
    </View>
  </ScrollView>;
}
const styles = StyleSheet.create({
  container:{padding:20,gap:16}, heading:{fontSize:28,fontWeight:"700"}, help:{color:"#666",lineHeight:20}, progress:{flexDirection:"row",justifyContent:"space-between"},
  progressItem:{alignItems:"center",gap:5}, dot:{width:12,height:12,borderRadius:6,backgroundColor:"#ccc"}, activeDot:{backgroundColor:"#111"}, stepLabel:{color:"#777",fontSize:12}, activeLabel:{color:"#111",fontWeight:"700"},
  section:{gap:12}, sectionTitle:{fontSize:20,fontWeight:"700"}, input:{borderWidth:1,borderColor:"#ccc",borderRadius:12,padding:12}, textarea:{minHeight:150,textAlignVertical:"top"},
  actions:{flexDirection:"row",gap:10}, secondary:{flex:1,padding:14,borderRadius:12,borderWidth:1,borderColor:"#ccc",alignItems:"center"}, secondaryText:{fontWeight:"700"},
  button:{flex:1,padding:14,borderRadius:12,backgroundColor:"#111",alignItems:"center"}, disabled:{opacity:.55}, buttonText:{color:"#fff",fontWeight:"700"}
});