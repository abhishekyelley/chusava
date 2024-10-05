import { generateErrorReponse } from "@/lib/api/error";
import axios from "@/lib/api/tmdb-axios";
import { getUser } from "@/lib/api/user";
import {
  Movie,
  MovieResponse,
  TMDB,
  TV,
  TVResponse,
} from "@/types/tmdb/tmdb";
import { NextRequest, NextResponse } from "next/server";

async function getData<T extends TMDB>(tmdb: T) {
  const response = await axios.get<
    T extends Movie
      ? MovieResponse
      : T extends TV
      ? TVResponse
      : never
  >(`/${tmdb.type}/${tmdb.id}?language=en-US`);
  return response.data;
}

export async function GET(
  request: NextRequest,
  { params: { id, type } }: { params: { id: string; type: string } }
) {
  try {
    await getUser();
    if (!type || (type !== "movie" && type !== "tv")) {
      throw new Error("Invalid media type");
    }
    if (!id) {
      throw new Error("Missing media id");
    }
    const tmdb: TMDB = {
      id,
      type,
    };
    const response = await getData(tmdb);
    return NextResponse.json(response);
  } catch (err) {
    return generateErrorReponse(err);
  }
}
