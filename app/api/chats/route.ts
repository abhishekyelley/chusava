import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { getAvatarById } from "@/lib/api/user";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_conversations");
    if (error) {
      throw new SupabaseError(error);
    }
    const avatarData = await Promise.all(data?.map(async (item) => {
      if (item.user_id) {
        const avatar = await getAvatarById(item.user_id);
        return { ...item, avatar };
      }
      return item;
    }));
    return NextResponse.json(avatarData);
  } catch (err) {
    return generateErrorReponse(err);
  }
}