import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { getUser } from "@/lib/api/user";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const user = await getUser();
    console.log(user.id);
    const { name, conversationId } = await request.json();
    if (!name.trim()) {
      throw new Error("Name cannot be empty");
    }
    const { data: listsData, error: listsError } = await supabase
      .from("lists")
      .insert({
        name: name.trim(),
        owner_id: user.id,
      })
      .select()
      .single();
    if (listsError) {
      throw new SupabaseError(listsError);
    }
    const { error } = await supabase
      .from("conversation_lists")
      .insert({
        conversation_id: conversationId,
        name,
        list_id: listsData.id,
      });
    if (error) {
      throw new SupabaseError(error);
    }
    return new NextResponse(null, { status: 201 });
  } catch (err) {
    return generateErrorReponse(err);
  }
}
