import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { createVehicleImageSignedUrl, listVehicleImages } from "@motoraconect/api";
import type { VehicleImage } from "@motoraconect/types";
import { supabase } from "@/lib/supabase";

const SIGNED_URL_TTL = 60 * 60;

export function VehicleImageGallery({ vehicleId }: { vehicleId: string }) {
  const [images, setImages] = useState<Array<VehicleImage & { signedUrl: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      const result = await listVehicleImages(supabase, vehicleId);
      if (result.error) {
        if (active) {
          setError(result.error.userMessage);
          setLoading(false);
        }
        return;
      }

      const signed = await Promise.all(
        result.data.map(async (image) => {
          const url = await createVehicleImageSignedUrl(supabase, image.storage_path, SIGNED_URL_TTL);
          return url.error ? null : { ...image, signedUrl: url.data };
        }),
      );

      if (!active) return;
      const validImages = signed.filter(
        (image): image is VehicleImage & { signedUrl: string } => image !== null,
      );
      setImages(validImages);
      if (result.data.length > 0 && validImages.length === 0) {
        setError("Vehicle photos could not be loaded.");
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [vehicleId]);

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!images.length) return <Text style={styles.empty}>No vehicle photos yet.</Text>;

  return (
    <View style={styles.gallery}>
      {images.map((image) => (
        <Image
          key={image.id}
          source={{ uri: image.signedUrl }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={image.alt_text ?? "Vehicle photo"}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { minHeight: 180, alignItems: "center", justifyContent: "center" },
  gallery: { gap: 10 },
  image: { width: "100%", height: 220, borderRadius: 14, backgroundColor: "#eee" },
  empty: { color: "#666", paddingVertical: 10 },
  error: { color: "#b00020", paddingVertical: 10 },
});
