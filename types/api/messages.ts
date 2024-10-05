import { Database } from "@/types/supabase";

export type Message = Database["public"]["Tables"]["messages"]["Row"];
