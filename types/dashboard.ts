import { ErrorResponse } from "@/types/api/error";
import { Database } from "@/types/supabase";


type UserType = Database["public"]["Tables"]["users"]["Row"];


export interface FriendsResponse extends UserType {
  friendship_id: string;
  /**
   * Is current user the sender
   */
  avatar: string;
  is_sender: boolean;
  accepted: boolean | null;
  created_at: string | null;
}

export type FriendRequestsType = "incoming" | "outgoing" | "all";

export interface RequestsPropsType {
  data: FriendsResponse[] | null;
  error: ErrorResponse | null;
  isLoading: boolean;
  isError: boolean;
  type: FriendRequestsType;
}