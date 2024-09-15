import { paths } from "@/lib/constants";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function useSignout() {
  const supabase = createClient();
  const router = useRouter();
  return async () => {
    await supabase.auth.signOut();
    router.push(paths.login);
  };
}