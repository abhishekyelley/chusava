import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("friends")
      .delete()
      .eq("id", id)
      .single();
    if (error) {
      throw new SupabaseError(error);
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return generateErrorReponse(err);
  }
}

export async function PATCH(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("friends")
      .update({ accepted: true })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      throw new SupabaseError(error);
    }
    if (!data) {
      throw new Error("Could not accept request");
    }
    return NextResponse.json(data);
  } catch (err) {
    return generateErrorReponse(err);
  }
}