import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { getUser } from "@/lib/api/user";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const user = await getUser();
    const formData = await request.formData();
    const avatar = formData.get("avatar") as File;
    const { error } = await supabase
      .storage
      .from("avatars")
      .upload(`${user.id}/avatar.${avatar.name.split(".").at(-1)}`, avatar, {
        cacheControl: '3600',
        upsert: true
      });
    if (error) {
      throw new SupabaseError(error);
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return generateErrorReponse(err);
  }
}