import { Database } from "@/types/supabase";

export type Message =
  Database["public"]["Views"]["messages_with_watched"]["Row"];
