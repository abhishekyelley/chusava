import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { getAvatarById } from "@/lib/api/user";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params: { conversationId },
  }: { params: { conversationId: string } }
) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc(
      "get_users_in_conversation",
      {
        p_conversation_id: conversationId,
      }
    );
    if (error) {
      throw new SupabaseError(error);
    }
    const usersWithAvatars = await Promise.all(
      data.map(async (user) => {
        const avatar = await getAvatarById(user.id);
        return {
          ...user,
          avatar,
        };
      })
    );
    return NextResponse.json(usersWithAvatars);
  } catch (err) {
    return generateErrorReponse(err);
  }
}
