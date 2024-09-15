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