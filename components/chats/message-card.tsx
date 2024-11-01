import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Message } from "@/types/api/messages";
import { MovieResponse, TVResponse } from "@/types/tmdb/tmdb";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FastAverageColor } from "fast-average-color";
import { useCallback, useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CalendarIcon, Ellipsis, Trash } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { UserResponse, UsersResponse } from "@/types/api/user";
import moment from "moment";
import { tmdb_base } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  TooltipTrigger,
  TooltipProvider,
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import { MessageCardSkeleton } from "./message-card-skeleton";
import { Watched } from "@/components/chats/watched";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const fac = new FastAverageColor();

export function MessageCard({
  created_at,
  tmdb_id,
  tmdb_type,
  sender,
  currentUserData,
  conversationId,
  deleteMutate,
  deletePending,
  watched,
  addToWatched,
  removeFromWatched,
}: Message & {
  currentUserData?: UserResponse;
  conversationId: string;
  deleteMutate: () => void;
  deletePending: boolean;
  watched: boolean;
  addToWatched: () => void;
  removeFromWatched: () => void;
}) {
  const [shadowColor, setShadowColor] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const senderData = queryClient
    .getQueryData<UsersResponse[]>([
      "conversation_users",
      conversationId,
    ])
    ?.find((item) => item.id === sender);
  const tmdb = useQuery({
    queryKey: [
      "tmdb",
      {
        id: tmdb_id,
        type: tmdb_type,
      },
    ],
    queryFn: async ({ signal }) => {
      const response = await axios.get<MovieResponse | TVResponse>(
        `/api/tmdb/${tmdb_type}/${tmdb_id}`,
        { signal }
      );
      return response.data;
    },
    staleTime: Infinity,
  });
  const image = tmdb.data?.poster_path
    ? tmdb_base.image + "/original" + tmdb.data.poster_path
    : "";
  const getColor = useCallback(async () => {
    try {
      const color = await fac.getColorAsync(image + "?for-no-cache", {
        crossOrigin: "allow",
      });
      setShadowColor(color.hex);
    } catch (err) {
      console.error(err);
    }
  }, [image]);
  useEffect(() => {
    if (image) {
      getColor();
    }
  }, [getColor, image]);
  const userData = {
    id: sender,
    first_name:
      sender === currentUserData?.id
        ? currentUserData?.first_name
        : senderData?.first_name,
    last_name:
      sender === currentUserData?.id
        ? currentUserData?.last_name
        : senderData?.last_name,
    username:
      sender === currentUserData?.id
        ? currentUserData?.username
        : senderData?.username,
    bio:
      sender === currentUserData?.id
        ? currentUserData?.bio
        : senderData?.bio,
    urls:
      sender === currentUserData?.id
        ? currentUserData?.urls
        : senderData?.urls,
    avatar:
      sender === currentUserData?.id
        ? currentUserData?.avatar
        : senderData?.avatar,
  };
  return (
    <>
      {tmdb.isError && <p>Error</p>}
      {tmdb.isLoading && (
        <MessageCardSkeleton
          sender={sender === currentUserData?.id}
        />
      )}
      {tmdb.data && (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="md:max-w-[50vw]">
              <ScrollArea className="max-h-[70vh]" type="hover">
                <DialogTitle className="hidden">
                  {tmdb_type === "movie"
                    ? (tmdb.data as MovieResponse).title
                    : (tmdb.data as TVResponse).name}
                  {"("}
                  {tmdb_type === "movie"
                    ? (
                        tmdb.data as MovieResponse
                      ).release_date?.split("-")[0]
                    : (tmdb.data as TVResponse).first_air_date?.split(
                        "-"
                      )[0]}
                  {")"}
                </DialogTitle>
                <DialogDescription className="hidden">
                  {tmdb.data.overview}
                </DialogDescription>
                <h2 className="text-4xl font-bold space-x-2 mb-8">
                  <span>
                    {tmdb_type === "movie"
                      ? (tmdb.data as MovieResponse).title
                      : (tmdb.data as TVResponse).name}
                  </span>
                  <span className="italic font-semibold text-muted-foreground">
                    {"("}
                    {tmdb_type === "movie"
                      ? (
                          tmdb.data as MovieResponse
                        ).release_date?.split("-")[0]
                      : (
                          tmdb.data as TVResponse
                        ).first_air_date?.split("-")[0]}
                    {")"}
                  </span>
                </h2>
                <div className="xl:grid xl:grid-cols-5 gap-4">
                  <div className="xl:col-span-2 p-4">
                    <div className="flex justify-center w-full mb-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="rounded-md object-cover h-[400px] w-auto"
                        alt={
                          tmdb_type === "movie"
                            ? (tmdb.data as MovieResponse).title ??
                              "" + "poster"
                            : (tmdb.data as TVResponse).name ??
                              "" + "poster"
                        }
                        src={image}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Watched
                        watched={watched}
                        addToWatched={addToWatched}
                        removeFromWatched={removeFromWatched}
                      />
                    </div>
                  </div>
                  <div className="xl:col-span-3 p-4 space-y-4">
                    <div>
                      <h4 className="text-xl font-bold mb-2">
                        Overview
                      </h4>
                      <p className="text-lg italic text-muted-foreground">
                        {tmdb.data.overview}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">
                        Genre
                      </h4>
                      <div className="flex flex-wrap">
                        {tmdb.data.genres?.map((genre) => (
                          <Badge
                            key={genre.id}
                            className="text-md m-1"
                          >
                            {genre.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">
                        Score
                      </h4>
                      <Badge
                        className={cn(
                          "text-md text-black dark:text-white",
                          tmdb.data.vote_average > 8
                            ? "dark:bg-green-600 bg-green-400"
                            : tmdb.data.vote_average > 6
                            ? "dark:bg-yellow-600 bg-yellow-400"
                            : "dark:bg-red-600 bg-red-400"
                        )}
                      >
                        {tmdb.data.vote_average.toPrecision(3)}
                      </Badge>
                    </div>
                    <TooltipProvider delayDuration={100}>
                      {tmdb_type === "movie" && (
                        <div>
                          <h4 className="text-xl font-bold mb-2">
                            Links
                          </h4>
                          <div className="flex space-x-4">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={
                                    "https://letterboxd.com/tmdb/" +
                                    tmdb_id
                                  }
                                  target="_blank"
                                >
                                  <Image
                                    alt="Letterboxd"
                                    src="/letterboxd.png"
                                    height={48}
                                    width={48}
                                  />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                Letterboxd
                              </TooltipContent>
                            </Tooltip>
                            {(tmdb.data as MovieResponse).imdb_id && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={
                                      "https://imdb.com/title/" +
                                      (tmdb.data as MovieResponse)
                                        .imdb_id
                                    }
                                    target="_blank"
                                  >
                                    <Image
                                      alt="IMDb"
                                      src="/imdb.png"
                                      height={48}
                                      width={48}
                                    />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  IMDb
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      )}
                    </TooltipProvider>
                  </div>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <div
            className={cn(
              "flex",
              "my-3",
              sender === currentUserData?.id ? "justify-end" : ""
            )}
          >
            {sender !== currentUserData?.id && (
              <div className="flex flex-col-reverse mr-2 mb-1">
                <Avatar
                  className="rounded-none rounded-l-full rounded-t-full border-2"
                  style={{ borderColor: shadowColor ?? "white" }}
                >
                  <AvatarImage
                    src={userData?.avatar}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {userData.first_name?.charAt(0)
                      ? userData.first_name?.charAt(0) +
                        userData.last_name?.charAt(0)
                      : "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="w-max">
              <HoverCard openDelay={50} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <button onClick={() => setOpen(true)}>
                    <div
                      className={cn(
                        "rounded-md w-max",
                        "relative",
                        "transition-all ease-in-out duration-300"
                      )}
                      style={{
                        boxShadow: !isHovering
                          ? "none"
                          : `0 25px 50px -12px ${
                              shadowColor ?? "white"
                            }`,
                        outline: `2px solid ${
                          shadowColor ?? "white"
                        }`,
                      }}
                      onMouseEnter={() => setIsHovering(true)}
                      onMouseLeave={() => setIsHovering(false)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className={cn(
                          "rounded-md object-cover",
                          "transition-all ease-in-out duration-300",
                          "h-[220px] w-[146.66px]",
                          isHovering ? "scale-105" : "scale-100"
                        )}
                        alt={
                          tmdb_type === "movie"
                            ? (tmdb.data as MovieResponse).title ??
                              "" + "poster"
                            : (tmdb.data as TVResponse).name ??
                              "" + "poster"
                        }
                        src={image}
                      />
                      <div className="absolute bottom-0">
                        <div
                          className={cn(
                            "w-[146.66px] max-h-20 overflow-clip",
                            "rounded-b-md",
                            "transition-all ease-in-out duration-100",
                            "bg-[#00000085]"
                          )}
                          style={{
                            opacity: isHovering ? "0" : "100",
                          }}
                        >
                          <p className="p-2 text-center font-bold">
                            {tmdb_type === "movie"
                              ? (tmdb.data as MovieResponse).title
                              : tmdb_type === "tv"
                              ? (tmdb.data as TVResponse).name
                              : null}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </HoverCardTrigger>
                <div>
                  <div
                    className={cn(
                      "flex items-center justify-between",
                      "bg-slate-950 text-sm",
                      "rounded-lg border border-muted",
                      "w-[146.66px]"
                    )}
                  >
                    <Watched
                      watched={watched}
                      addToWatched={addToWatched}
                      removeFromWatched={removeFromWatched}
                      className="rounded-r-none border-r px-2"
                    />
                    <div className="flex justify-center items-center self-center">
                      <p className="italic">
                        {tmdb_type === "movie"
                          ? (tmdb.data as MovieResponse).runtime +
                            " mins"
                          : tmdb_type === "tv"
                          ? (tmdb.data as TVResponse)
                              .number_of_episodes + " EPs"
                          : null}
                      </p>
                    </div>
                    <DropdownMenu modal>
                      <AlertDialog>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete{" "}
                              <span className="font-extrabold">
                                {tmdb_type === "movie"
                                  ? (tmdb.data as MovieResponse).title
                                  : tmdb_type === "tv"
                                  ? (tmdb.data as TVResponse).name
                                  : null}
                              </span>{" "}
                              from this list.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 text-white hover:bg-red-800"
                              onClick={() => {
                                deleteMutate();
                              }}
                            >
                              <span className="self-center flex">
                                <Trash className="self-center mr-2" />
                                <span className="self-center">
                                  Delete
                                </span>
                              </span>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="rounded-l-none border-l px-2"
                          >
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="text-red-600"
                              disabled={deletePending}
                            >
                              <Trash className="h-4 w-4 mr-2" />{" "}
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </AlertDialog>
                    </DropdownMenu>
                  </div>
                </div>
                <HoverCardContent
                  className="mx-4 max-w-96 w-max"
                  side={
                    sender === currentUserData?.id ? "left" : "right"
                  }
                >
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={userData?.avatar}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {userData.first_name?.charAt(0)
                          ? userData.first_name?.charAt(0) +
                            userData.last_name?.charAt(0)
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-md font-semibold">
                        @{userData?.username}
                      </h4>
                      <h2 className="text-lg space-x-2">
                        <span className="font-extrabold">
                          {tmdb_type === "movie"
                            ? (tmdb.data as MovieResponse).title
                            : (tmdb.data as TVResponse).name}
                        </span>
                        <span className="italic font-semibold text-muted-foreground">
                          {"("}
                          {tmdb_type === "movie"
                            ? (
                                tmdb.data as MovieResponse
                              ).release_date?.split("-")[0]
                            : (
                                tmdb.data as TVResponse
                              ).first_air_date?.split("-")[0]}
                          {")"}
                        </span>
                      </h2>
                      {tmdb.data.overview && (
                        <p className="text-md">
                          {tmdb.data.overview?.split(" ").length >
                          10 ? (
                            <>
                              {tmdb.data.overview
                                .split(" ")
                                .slice(0, 10)
                                .join(" ")}
                              <Button
                                variant="link"
                                onClick={() => setOpen(true)}
                                className="m-0 p-0 italic"
                              >
                                {" ...read more"}
                              </Button>
                            </>
                          ) : (
                            tmdb.data.overview
                          )}
                        </p>
                      )}
                      <div className="flex items-center pt-2">
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                        <span className="text-sm text-muted-foreground">
                          {moment(created_at).format(
                            "hh:mm a, Do MMM YY"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </>
      )}
    </>
  );
}
