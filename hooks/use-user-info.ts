import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useState } from "react";

export type UserInfo = Database["public"]["Tables"]["users"]["Row"];

export function useUserInfo() {
  const supabase = createClient();
  const [data, setData] = useState<UserInfo | null>(null);
  const getUserInfo = useCallback(async () => {
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    if (getUserError || !user) {
      throw new Error("No user in seesion");
    }
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", user.id)
      .single();
    if (error || !data) {
      throw new Error("Could not find user in database");
    }
    setData(() => ({ ...data }));
  }, [supabase])
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);
  return data;
}