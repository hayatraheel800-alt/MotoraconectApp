import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MediaTypeOptions } from "expo-image-picker";
import { listVehicleImages, uploadVehicleImage } from "@motoraconect/api";
import { supabase } from "@/lib/supabase";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic"]);

function extensionFor(asset: ImagePicker.ImagePickerAsset) {
  const fromName = asset.fileName?.split(".").pop();
  if (fromName) return fromName;
  if (asset.mimeType === "image/png") return "png";
  if (asset.mimeType === "image/webp") return "webp";
  if (asset.mimeType === "image/heic") return "heic";
  return "jpg";
}

export function VehiclePhotoUpload({ vehicleId }: { vehicleId: string }) {
  const [uploading, setUploading] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);

  async function refreshCount() {
    const result = await listVehicleImages(supabase, vehicleId);
    if (!result.error) setPhotoCount(result.data.length);
  }

  useEffect(() => {
    refreshCount();
  }, [vehicleId]);

  async function pickAndUpload() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow photo access to add vehicle images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.9,
    });

    if (result.canceled || !result.assets.length) return;

    setUploading(true);
    let uploaded = 0;

    try {
      for (const asset of result.assets) {
        const contentType = asset.mimeType ?? "image/jpeg";
        if (!ALLOWED_TYPES.has(contentType)) {
          throw new Error("Use JPEG, PNG, WebP, or HEIC images only.");
        }
        if (asset.fileSize && asset.fileSize > MAX_BYTES) {
          throw new Error("Each photo must be 10 MB or smaller.");
        }

        const body = await fetch(asset.uri).then((response) => response.arrayBuffer());
        const nextOrder = photoCount + uploaded;
        const upload = await uploadVehicleImage(
          supabase,
          vehicleId,
          body,
          contentType,
          extensionFor(asset),
          nextOrder,
          asset.fileName ?? null,
        );

        if (upload.error) throw new Error(upload.error.userMessage);
        uploaded += 1;
      }

      await refreshCount();
      Alert.alert("Photos uploaded", uploaded + " photo" + (uploaded === 1 ? "" : "s") + " added to this listing.");
    } catch (error) {
      Alert.alert("Upload failed", error instanceof Error ? error.message : "We couldn't upload the selected photos.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Vehicle photos</Text>
      <Text style={styles.help}>Add clear photos of the vehicle. Photos stay private until the listing is shared through an authorized signed URL.</Text>
      <Text style={styles.count}>{photoCount} photo{photoCount === 1 ? "" : "s"} uploaded</Text>
      <Pressable disabled={uploading} style={[styles.button, uploading && styles.disabled]} onPress={pickAndUpload}>
        <Text style={styles.buttonText}>{uploading ? "Uploading..." : "Choose photos"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, paddingVertical: 8 },
  heading: { fontSize: 20, fontWeight: "700" },
  help: { color: "#666", lineHeight: 20 },
  count: { color: "#444" },
  button: { padding: 14, borderRadius: 12, backgroundColor: "#111", alignItems: "center" },
  disabled: { opacity: 0.55 },
  buttonText: { color: "#fff", fontWeight: "700" },
});
