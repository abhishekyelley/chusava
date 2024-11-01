import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id)
      .select()
      .single();
    if (error) {
      throw new SupabaseError(error);
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return generateErrorReponse(err);
  }
}
