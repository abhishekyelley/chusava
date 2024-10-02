import { paths } from "@/lib/constants";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useSignout() {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();
  return async () => {
    queryClient.clear();
    await supabase.auth.signOut({
      scope: "local",
    });
    router.push(paths.login);
  };
}