import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params: { listId } }: { params: { listId: string } }) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages")
      .select()
      .eq("list_id", listId);
    if (error) {
      throw new SupabaseError(error);
    }
    return NextResponse.json(data);
  } catch (err) {
    return generateErrorReponse(err);
  }
}