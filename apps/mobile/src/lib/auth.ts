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