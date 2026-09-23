import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import { Button } from "@/components/Button";
import { signInWithGoogle } from "@/lib/auth";

WebBrowser.maybeCompleteAuthSession();

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") {
      WebBrowser.warmUpAsync();
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);

  async function handlePress() {
    setLoading(true);
    const result = await signInWithGoogle();

    if (result.error) {
      setLoading(false);
      Alert.alert("Google sign-in failed", result.error.message);
      return;
    }

    if (Platform.OS === "web") {
      return;
    }

    if (result.url) {
      const authResult = await WebBrowser.openAuthSessionAsync(
        result.url,
        "motoraconect://google-auth",
        { showInRecents: true },
      );

      if (authResult.type === "success") {
        const sessionResult = await result.complete(authResult.url);
        setLoading(false);

        if (sessionResult.error) {
          Alert.alert("Google sign-in failed", sessionResult.error.message);
          return;
        }

        router.replace("/(tabs)");
        return;
      }
    }

    setLoading(false);
  }

  return (
    <Button
      label="Continue with Google"
      loading={loading}
      onPress={handlePress}
    />
  );
}
