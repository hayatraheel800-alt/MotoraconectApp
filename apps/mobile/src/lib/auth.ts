import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email: email.trim(), password });
}

export async function signUp(fullName: string, email: string, password: string) {
  return supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { full_name: fullName.trim() } },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function signInWithGoogle() {
  const redirectTo = "motoraconect://google-auth";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: Platform.OS !== "web",
    },
  });

  return {
    url: data.url,
    error,
    complete: async (callbackUrl: string) => {
      const parsed = new URL(callbackUrl);
      const hash = parsed.hash.startsWith("#")
        ? parsed.hash.slice(1)
        : parsed.hash;
      const params = new URLSearchParams(hash);

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        return {
          data: null,
          error: new Error("Google OAuth did not return a Supabase session."),
        };
      }

      return supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    },
  };
}
