import { generateErrorReponse, SupabaseError } from "@/lib/api/error";
import { getAvatarById, getUser } from "@/lib/api/user";
import { ErrorResponse } from "@/types/api/error";
import { FindUserResponse, FindUserWithFreindshipResponse } from "@/types/api/user";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest):
  Promise<
    NextResponse<
      | FindUserWithFreindshipResponse[]
      | FindUserResponse[]
      | ErrorResponse
    >
  > {
  try {
    const supabase = createClient();
    const q = request.nextUrl.searchParams.get("q");
    const friendship = request.nextUrl.searchParams.get("friendship");
    if (!q) {
      return NextResponse.json([]);
    }
    const query = q
      .trim()
      .replace(/%/g, '\\%')
      .replace(/_/g, '\\_')
      .replace(/'/g, "''");
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select()
      .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`);
    if (usersError) {
      throw new SupabaseError(usersError);
    }
    if (friendship !== "true") {
      const data = await Promise.all(usersData.map(async (user) => {
        const avatar = await getAvatarById(user.id);
        return {
          ...user,
          avatar,
        };
      }));
      return NextResponse.json(data);
    }
    const { id } = await getUser();

    const data = await Promise.all(usersData.map(async (person) => {
      const avatar = await getAvatarById(person.id);
      const { data, error } = await supabase
        .from("friends")
        .select()
        .or(`and(sender.eq.${person.id},receiver.eq.${id}),and(sender.eq.${id},receiver.eq.${person.id})`)
        .single();
      if (error || !data) {
        return {
          ...person,
          avatar,
          friendship: {
            status: "none",
            self: id === person.id,
          }
        }
      }
      const status = data.accepted === true ? "friend" : data.sender === id ? "sent" : "received";
      return {
        ...person,
        avatar,
        friendship: {
          status,
          created_at: data.created_at,
          id: data.id,
        }
      };
    }));
    return NextResponse.json(data);
  } catch (err) {
    return generateErrorReponse(err);
  }

}