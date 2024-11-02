import { UserResponse } from "@/types/api/user";
import { Database } from "@/types/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export type UserInfo = Database["public"]["Tables"]["users"]["Row"];

export function useUserInfo() {
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const ensureQueryData = useCallback(async () => {
    try {
      const data = await queryClient.ensureQueryData<UserResponse>({
        queryKey: ["user"],
      });
      setUserData({ ...data });
    } catch (err) {
      console.log("!!TANSTACK ERROR!!");
      console.error(err);
    }
  }, [queryClient]);
  useEffect(() => {
    ensureQueryData();
  }, [ensureQueryData]);
  return userData;
}
