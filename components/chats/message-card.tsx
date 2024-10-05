import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Message } from "@/types/api/messages";
import { MovieResponse, TVResponse } from "@/types/tmdb/tmdb";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export function MessageCard({
  tmdb_id,
  tmdb_type,
  sender,
  userId,
}: Message & { userId: string | null }) {
  const tmdb = useQuery({
    queryKey: [
      "tmdb",
      {
        id: tmdb_id,
        type: tmdb_type,
      },
    ],
    queryFn: async () => {
      const response = await axios.get<MovieResponse | TVResponse>(
        `/api/tmdb/${tmdb_type}/${tmdb_id}`
      );
      return response.data;
    },
  });
  return (
    <>
      {tmdb.isError && <p>Error</p>}
      {tmdb.isLoading && <p>Loading...</p>}
      {tmdb.data && (
        <div
          className={cn(
            "flex",
            sender === userId ? "justify-end" : ""
          )}
        >
          <div className="w-max">
            <Link
              href={`https://www.themoviedb.org/${tmdb_type}/${tmdb_id}`}
              target="_blank"
            >
              <div className="rounded-md w-max shadow-slate-800 dark:shadow-amber-950 shadow-2xl hover:shadow-none transition-all ease-in-out duration-300">
                <Image
                  className="rounded-md hover:brightness-75 transition-all ease-in-out duration-300"
                  alt={
                    tmdb_type === "movie"
                      ? (tmdb.data as MovieResponse).title ??
                        "" + "poster"
                      : (tmdb.data as TVResponse).name ??
                        "" + "poster"
                  }
                  height={240}
                  width={180}
                  src={
                    tmdb.data.poster_path
                      ? "https://image.tmdb.org/t/p/w500" +
                        tmdb.data.poster_path
                      : ""
                  }
                />
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
