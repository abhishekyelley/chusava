import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { id } = await request.json();
  const supabase = createClient();
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();
  if (getUserError || !user) {
    return NextResponse.json({ error: true, message: "No user in session" }, { status: 403 });
  }
  const { data, error } = await supabase
    .from("friends")
    .insert({
      accepted: false,
      receiver: id,
      sender: user.id,
    })
    .select();
  if (error) {
    return NextResponse.json({ error: true, message: "Cannot create request" }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}