import { Database } from "@/types/supabase";
import { User } from "@supabase/supabase-js";

type Users = Database["public"]["Tables"]["users"]["Row"];

export interface UserResponse extends Users {
  id: User["id"],
  email: User["email"],
  avatar?: string,
}