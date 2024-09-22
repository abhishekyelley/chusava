import { generateErrorReponse } from "@/lib/api/error";
import { SupabaseError } from "@/lib/api/error";
import { FriendsResponse } from "@/types/dashboard";
import { getUser, getUserById } from "@/lib/api/user";
import { ErrorResponse } from "@/types/api/error";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<FriendsResponse[] | ErrorResponse>> {
  try {
    const supabase = createClient();
    const user = await getUser();

    const { data: friendsData, error: friendsError } = await supabase
      .from("friends")
      .select()
      .or(`receiver.eq.${user.id},sender.eq.${user.id}`)
    // .eq("accepted", true);

    if (friendsError) {
      throw new SupabaseError(friendsError);
    }

    const data = await Promise.all(friendsData.map(async ({ sender, receiver, accepted, created_at, id: friendship_id }) => {
      const friend_id = sender === user.id ? receiver : sender;
      const data = await getUserById(friend_id);
      return {
        ...data,
        friendship_id,
        is_sender: sender === user.id,
        accepted,
        created_at,
      };
    }));
    return NextResponse.json(data);
  } catch (err) {
    return generateErrorReponse(err);
  }
}