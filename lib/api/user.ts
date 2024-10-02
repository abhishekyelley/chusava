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

export async function getUserByUsername(username: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("username", username)
    .single();
  if (error) {
    throw new SupabaseError(error);
  }
  return data;
}

export async function getConversationByUsername(username: string) {
  const supabase = createClient();
  const { id: requester_id } = await getUser();
  const { id: requesting_id } = await getUserByUsername(username);
  const { data: friendshipData, error: friendshipError } = await supabase
    .from("friends")
    .select("id")
    .or(`and(sender.eq.${requester_id},receiver.eq.${requesting_id}),and(sender.eq.${requesting_id},receiver.eq.${requester_id})`)
    .single();
  if (friendshipError) {
    throw new SupabaseError(friendshipError);
  }
  const { data, error } = await supabase
    .from("conversations")
    .select()
    .or(`and(type.eq.friend,friendship_id.eq.${friendshipData.id})`)
    .single();
  if (error) {
    throw new SupabaseError(error);
  }
  return data;
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