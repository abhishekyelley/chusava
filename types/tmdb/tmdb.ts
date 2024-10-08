import { paths } from "@/types/tmdb/schema";

export interface Movie {
  id: string | number;
  type: "movie";
}
export interface TV {
  id: string | number;
  type: "tv";
}
export type TMDB = Movie | TV;

export type MovieResponse =
  paths["/3/movie/{movie_id}"]["get"]["responses"]["200"]["content"]["application/json"];
export type TVResponse =
  paths["/3/tv/{series_id}"]["get"]["responses"]["200"]["content"]["application/json"];

export type MovieImagesResponse =
  paths["/3/movie/{movie_id}/images"]["get"]["responses"]["200"]["content"]["application/json"];
export type TVImagesResponse =
  paths["/3/tv/{series_id}/images"]["get"]["responses"]["200"]["content"]["application/json"];

export type MovieSearchResponse =
  paths["/3/search/movie"]["get"]["responses"]["200"]["content"]["application/json"];
export type TVSearchResponse =
  paths["/3/search/tv"]["get"]["responses"]["200"]["content"]["application/json"];
