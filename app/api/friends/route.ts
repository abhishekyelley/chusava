import { generateErrorReponse } from "@/lib/api/error";
import { SupabaseError } from "@/lib/api/error";
import { FriendsResponse } from "@/types/dashboard";
import { getAvatarById, getUser, getUserById } from "@/lib/api/user";
import { ErrorResponse } from "@/types/api/error";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<FriendsResponse[] | ErrorResponse>> {
  try {
    const supabase = createClient();
    const user = await getUser();

    const { data: friendsData, error: friendsError } = await supabase
      .from("friends")
      .select()
      .or(`receiver.eq.${user.id},sender.eq.${user.id}`);
    // .eq("accepted", true);

    if (friendsError) {
      throw new SupabaseError(friendsError);
    }
    const data = await Promise.all(friendsData.map(async ({ sender, receiver, accepted, created_at, id: friendship_id }) => {
      const friend_id = sender === user.id ? receiver : sender;
      const data = await getUserById(friend_id);
      const avatar = await getAvatarById(friend_id);
      return {
        ...data,
        friendship_id,
        is_sender: sender === user.id,
        avatar,
        accepted,
        created_at,
      };
    }));
    return NextResponse.json(data);
  } catch (err) {
    return generateErrorReponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const user = await getUser();
    const { id: receiverId } = await request.json();
    const { data: userExistsData, error: userExistsError } = await supabase
      .from("users")
      .select("id")
      .eq("id", receiverId);
    if (userExistsError) {
      throw new SupabaseError(userExistsError);
    }
    if (!userExistsData || userExistsData.length === 0) {
      throw new Error("Requested user does not exist.");
    }
    const { data: checkData, error: checkError } = await supabase
      .from("friends")
      .select("id")
      .or(`and(sender.eq.${user.id},receiver.eq.${receiverId}),and(sender.eq.${receiverId},receiver.eq.${user.id})`);
    if (checkError) {
      throw new SupabaseError(checkError);
    }
    if (checkData.length > 0) {
      throw new Error("Request/friendship with user already exists.");
    }
    const { data, error } = await supabase
      .from("friends")
      .insert({
        accepted: false,
        receiver: receiverId,
        sender: user.id,
      })
      .select()
      .single();
    if (error) {
      throw new SupabaseError(error);
    }
    if (!data) {
      throw new Error("Could not make request.")
    }
    return new NextResponse(null, { status: 201 });
  } catch (err) {
    return generateErrorReponse(err);
  }
}