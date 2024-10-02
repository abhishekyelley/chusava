import { generateErrorReponse } from "@/lib/api/error";
import { getConversationByUsername } from "@/lib/api/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params: { username } }: { params: { username: string } }) {
  try {
    const conversation = await getConversationByUsername(username);
    return NextResponse.json(conversation);
  } catch (err) {
    return generateErrorReponse(err);
  }
}