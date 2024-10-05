import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params: { conversationId } }: { params: { conversationId: string } }) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("conversation_lists")
      .select(
        `*,
        list: lists (*)
        `
      )
      .eq("conversation_id", conversationId);
    if (error) {
      throw new SupabaseError(error);
    }
    return NextResponse.json(data);
  } catch (err) {
    return generateErrorReponse(err);
  }
}