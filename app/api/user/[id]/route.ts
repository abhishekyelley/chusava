import { generateErrorReponse } from "@/lib/api/error";
import { getUserById } from "@/lib/api/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  try {
    const data = await getUserById(id);
    return NextResponse.json(data);
  } catch (err) {
    const response = generateErrorReponse(err);
    return response;
  }
}