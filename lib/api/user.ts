import { createClient } from "@/utils/supabase/server";
import { SupabaseError } from "@/lib/api/error";

export async function getUserById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single();
  if (error) {
    throw new SupabaseError(error);
  }
  return data;
}

export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();
  if (getUserError) {
    throw new SupabaseError(getUserError);
  }
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export async function getAvatarById(id: string) {
  const supabase = createClient();
  const { data } = supabase
    .storage
    .from("avatars")
    .getPublicUrl(`${id}/avatar.jpg`);
  const response = await fetch(data.publicUrl);
  if (response.headers.get("Content-Type")?.includes("application/json")) {
    return "";
  }
  return data.publicUrl;
}