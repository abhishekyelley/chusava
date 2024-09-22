import { ProfileFormValues } from "@/components/settings/profile-form";
import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { getAvatarById, getUser, getUserById } from "@/lib/api/user";
import { ErrorResponse } from "@/types/api/error";
import { UserResponse } from "@/types/api/user";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<UserResponse | ErrorResponse>> {
  try {
    const { id, email } = await getUser();
    const user = await getUserById(id);
    const avatar = await getAvatarById(id);

    return NextResponse.json({
      ...user,
      id,
      email,
      avatar,
    });

  } catch (err) {
    return generateErrorReponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id } = await getUser();
    const supabase = createClient();
    const { first_name, last_name, bio, urls }: ProfileFormValues = await request.json();
    const urlsArray = urls ? urls.map(item => item.value) : [];
    const { data, error } = await supabase
      .from("users")
      .update({
        first_name,
        last_name,
        bio,
        urls: urlsArray,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      throw new SupabaseError(error);
    }
    if (!data) {
      throw new Error("Something went wrong.");
    }

    return new NextResponse(null, { status: 204 });

  } catch (err) {
    return generateErrorReponse(err);
  }
}