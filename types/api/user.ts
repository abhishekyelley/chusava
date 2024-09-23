import { Database } from "@/types/supabase";
import { User } from "@supabase/supabase-js";

type Users = Database["public"]["Tables"]["users"]["Row"];

export interface UserResponse extends Users {
  id: User["id"],
  email: User["email"],
  avatar?: string,
}

interface BaseFriendship {
  id: string;
  created_at: string;
}
interface FriendshipNone {
  status: "none";
  self: boolean;
}
type FriendshipStatus = "sent" | "received" | "friend";
interface Friendship<T extends FriendshipStatus> extends BaseFriendship {
  status: T;
}

export interface FindUserResponse extends Users {
  avatar: string;
}
export interface FindUserWithFreindshipResponse extends FindUserResponse {
  friendship: FriendshipNone | Friendship<FriendshipStatus>;
}