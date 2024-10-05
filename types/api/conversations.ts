import { Database } from "@/types/supabase";

type Unpacked<T> = T extends (infer U)[] ? U : T;

export type ConversationsResponse = Array<
  Unpacked<
    Database["public"]["Functions"]["get_conversations"]["Returns"]
  > & {
    avatar: string;
  }
>;