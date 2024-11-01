import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { getUser } from "@/lib/api/user";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { listId } }: { params: { listId: string } }
) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("messages_with_watched")
      .select()
      .eq("list_id", listId)
      .order("created_at", {
        ascending: true,
      });
    if (error) {
      throw new SupabaseError(error);
    }
    return NextResponse.json(data);
  } catch (err) {
    return generateErrorReponse(err);
  }
}

export async function POST(
  request: NextRequest,
  { params: { listId } }: { params: { listId: string } }
) {
  try {
    const supabase = createClient();
    const { id } = await getUser();
    const { tmdb_id, tmdb_type } = await request.json();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        list_id: listId,
        tmdb_id,
        tmdb_type,
        sender: id,
      })
      .select()
      .single();
    if (error) {
      throw new SupabaseError(error);
    }
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return generateErrorReponse(err);
  }
}
