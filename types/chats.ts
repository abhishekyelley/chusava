import { Database } from "@/types/supabase";

export type ListsResponse = Array<
  Database["public"]["Tables"]["conversation_lists"]["Row"] & {
    list: Database["public"]["Tables"]["lists"]["Row"];
  }
>;
