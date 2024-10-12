import { tmdb_base } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MediaCard({
  id,
  type,
  poster_path,
  title,
  release_date,
  sendMessage,
}: {
  id: number;
  type: "movie" | "tv";
  poster_path: string | undefined;
  title: string | undefined;
  release_date: string | undefined;
  sendMessage: ({
    tmdb_id,
    tmdb_type,
  }: {
    tmdb_id: number;
    tmdb_type: "movie" | "tv";
  }) => void;
}) {
  return (
    <button
      className="flex flex-col items-center w-full h-full"
      onClick={() => {
        sendMessage({
          tmdb_id: id,
          tmdb_type: type,
        });
      }}
    >
      {poster_path ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={
            poster_path
              ? tmdb_base.image + "/original" + poster_path
              : ""
          }
          alt={`${title}-${id}-${type}-poster`}
          className="h-[150px] w-auto rounded-md mb-2"
        />
      ) : (
        <div
          className={cn(
            "h-[150px] w-[112.5px] rounded-md mb-2",
            "bg-gradient-to-br dark:from-cyan-800 dark:to-purple-900",
            "from-cyan-100 to-purple-300",
            "flex flex-col justify-center items-center",
            "font-bold"
          )}
        >
          <p>Image</p>
          <p>Not</p>
          <p>Found</p>
        </div>
      )}
      <span className="mr-1 font-bold">{title}</span>
      <span className="italic font-semibold text-muted-foreground">{`(${
        release_date ? release_date.split("-")[0] : "unknown"
      })`}</span>
    </button>
  );
}
