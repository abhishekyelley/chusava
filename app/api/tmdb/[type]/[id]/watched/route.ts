import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { getUser } from "@/lib/api/user";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params: { type, id } }: { params: { id: string; type: string } }
) {
  try {
    const supabase = createClient();
    const user = await getUser();
    if (!type || (type !== "movie" && type !== "tv")) {
      throw new Error("Invalid media type");
    }
    if (!id || isNaN(Number(id))) {
      throw new Error("Missing media id");
    }
    // check if valid id is provided
    const { error } = await supabase
      .from("watched")
      .insert({
        user_id: user.id,
        tmdb_id: Number(id),
        tmdb_type: type,
      })
      .select()
      .single();
    if (error) {
      throw new SupabaseError(error);
    }
    return new NextResponse(null, { status: 201 });
  } catch (err) {
    return generateErrorReponse(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params: { type, id } }: { params: { id: string; type: string } }
) {
  try {
    const supabase = createClient();
    if (!type || (type !== "movie" && type !== "tv")) {
      throw new Error("Invalid media type");
    }
    if (!id || isNaN(Number(id))) {
      throw new Error("Missing media id");
    }
    const { error } = await supabase
      .from("watched")
      .delete()
      .eq("tmdb_id", Number(id))
      .eq("tmdb_type", type)
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
