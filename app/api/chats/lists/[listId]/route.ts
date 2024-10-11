import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params: { listId } }: { params: { listId: string } }
) {
  try {
    const supabase = createClient();
    const { name } = await request.json();
    const { error } = await supabase
      .from("lists")
      .update({
        name,
      })
      .eq("id", listId);
    if (error) {
      throw new SupabaseError(error);
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return generateErrorReponse(err);
  }
}
