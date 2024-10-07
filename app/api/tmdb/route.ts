import { generateErrorReponse } from "@/lib/api/error";
import axios from "@/lib/api/tmdb-axios";
import { getUser } from "@/lib/api/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await getUser();
    const searchParams = request.nextUrl.searchParams;
    let query = searchParams.get("query");
    const include_adult =
      searchParams.get("include_adult") ?? "false";
    const page = searchParams.get("page") ?? "1";
    const type = searchParams.get("type");
    if (!query) {
      return NextResponse.json([]);
    }
    if (isNaN(Number(page)) || isNaN(parseInt(page))) {
      throw new Error("Page must be a number");
    }
    if (type !== "movie" && type !== "tv") {
      throw new Error("Invalid media type");
    }
    query = query.trim().toLowerCase();
    const newParams = new URLSearchParams();
    newParams.append("query", query);
    newParams.append("include_adult", include_adult);
    newParams.append("page", String(page));
    const response = await axios.get(
      "/search/" + type + "?" + newParams.toString()
    );
    const data = response.data;
    return NextResponse.json(data);
  } catch (err) {
    return generateErrorReponse(err);
  }
}
