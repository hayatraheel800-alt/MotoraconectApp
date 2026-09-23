import React, {useCallback, useEffect, useState} from "react";
import {ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View} from "react-native";
import {router} from "expo-router";
import {deleteVehicle, listMyVehicles} from "@motoraconect/api";
import type {Vehicle} from "@motoraconect/types";
import {supabase} from "@/lib/supabase";

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending review",
  ACTIVE: "Active",
  RESERVED: "Reserved",
  SOLD: "Sold",
  EXPIRED: "Expired",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};

export default function MyListingsScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const result = await listMyVehicles(supabase);
    if (result.error) {
      setError(result.error.userMessage);
      setVehicles([]);
    } else {
      setVehicles(result.data);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeDraft = (id: string) => {
    Alert.alert("Delete draft", "Delete this draft permanently?", [
      {text: "Cancel", style: "cancel"},
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const result = await deleteVehicle(supabase, id);
          if (result.error) {
            Alert.alert("Could not delete", result.error.userMessage);
          } else {
            load();
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Listings</Text>
      <Text style={styles.help}>Manage the vehicles you have created.</Text>
      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No listings yet</Text>
              <Text style={styles.help}>Create a vehicle draft from the Sell tab to get started.</Text>
              <Pressable style={styles.button} onPress={() => router.replace("/(tabs)/sell")}>
                <Text style={styles.buttonText}>Create listing</Text>
              </Pressable>
            </View>
          }
          renderItem={({item}) => (
            <View style={styles.card}>
              <Pressable onPress={() => router.push("/(tabs)/sell/" + item.id)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.status}>{statusLabels[item.status] ?? item.status}</Text>
                </View>
                <Text style={styles.meta}>{item.year} • {item.make} {item.model}</Text>
                <Text style={styles.price}>{item.currency_code} {Number(item.price_amount).toLocaleString()}</Text>
                <Text style={styles.meta}>
                  {item.city ?? "No city"} • Updated {new Date(item.updated_at).toLocaleDateString()}
                </Text>
              </Pressable>
              {item.status === "DRAFT" && (
                <Pressable onPress={() => removeDraft(item.id)}>
                  <Text style={styles.deleteText}>Delete draft</Text>
                </Pressable>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, gap: 12},
  heading: {fontSize: 28, fontWeight: "700"},
  help: {color: "#666", lineHeight: 20},
  card: {padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "#ddd", gap: 7},
  cardHeader: {flexDirection: "row", justifyContent: "space-between", gap: 10},
  title: {fontSize: 18, fontWeight: "700", flex: 1},
  status: {fontSize: 12, fontWeight: "700"},
  meta: {color: "#666"},
  price: {fontSize: 17, fontWeight: "700"},
  error: {color: "#b00020"},
  empty: {paddingVertical: 30, gap: 12, alignItems: "center"},
  emptyTitle: {fontSize: 20, fontWeight: "700"},
  button: {padding: 14, borderRadius: 12, backgroundColor: "#111"},
  buttonText: {color: "#fff", fontWeight: "700"},
  deleteText: {color: "#b00020", fontWeight: "700"},
});
