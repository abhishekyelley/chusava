"use client";

import { MediaCard } from "@/components/chats/media-card";
import { MessageCard } from "@/components/chats/message-card";
import { MessageCardSkeleton } from "@/components/chats/message-card-skeleton";
import { Paginator } from "@/components/common/paginator";
import { NoResults } from "@/components/dashboard/friends/no-results";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "@/hooks/use-debounce";
import axios from "@/lib/axios";
import { paths } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ConversationsResponse } from "@/types/api/conversations";
import { Message } from "@/types/api/messages";
import { UserResponse } from "@/types/api/user";
import {
  MovieSearchResponse,
  TVSearchResponse,
} from "@/types/tmdb/tmdb";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import { Film, Loader, Popcorn, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function isMovie(
  media: MovieSearchResponse | TVSearchResponse
): media is MovieSearchResponse {
  return media.results
    ? media.results.length !== 0
      ? (
          media.results[0] as NonNullable<
            MovieSearchResponse["results"]
          >[0]
        ).title !== undefined
      : true
    : true;
}

function isTV(
  media: MovieSearchResponse | TVSearchResponse
): media is TVSearchResponse {
  return media.results
    ? media.results.length !== 0
      ? (
          media.results[0] as NonNullable<
            TVSearchResponse["results"]
          >[0]
        ).name !== undefined
      : false
    : false;
}

export default function Page({
  params: { listId, conversationId },
}: {
  params: { listId: string; conversationId: string };
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [recSearch, setRecSearch] = useState("");
  const [type, setType] = useState("movie");
  const [adult, setAdult] = useState(false);
  const [page, setPage] = useState(1);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const query = useDebounce(value, 300);
  const queryClient = useQueryClient();
  const conversationData = queryClient
    .getQueryData<ConversationsResponse>(["conversations"])
    ?.find((item) => item.conversation_id === conversationId);
  const currentUserData = queryClient.getQueryData<UserResponse>([
    "user",
  ]);
  const messages = useQuery<Message[]>({
    queryKey: ["messages", listId],
    queryFn: async ({ signal }) => {
      const response = await axios.get<Message[]>(
        paths.api.messages`${listId}`,
        { signal }
      );
      return response.data;
    },
  });
  const media = useQuery({
    queryKey: ["media", type, query, adult, page],
    queryFn: async ({ signal }) => {
      const q = query.trim().toLowerCase();
      if (!q || q === "" || (type !== "movie" && type !== "tv")) {
        return null;
      }
      if (type === "movie") {
        const response = await axios.get<MovieSearchResponse>(
          `/api/tmdb?query=${q}&type=movie&include_adult=${adult}&page=${page}`,
          { signal }
        );
        return response.data;
      }
      if (type === "tv") {
        const response = await axios.get<TVSearchResponse>(
          `/api/tmdb?query=${q}&type=tv`,
          { signal }
        );
        return response.data;
      }
    },
    staleTime: Infinity,
  });
  const sendMessage = useMutation({
    mutationFn: async ({
      tmdb_id,
      tmdb_type,
    }: {
      tmdb_id: number;
      tmdb_type: "movie" | "tv";
    }) => {
      const response = await axios.post(
        paths.api.messages`${listId}`,
        { tmdb_id, tmdb_type }
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["messages", listId],
      });
      setOpen(false);
    },
  });
  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete<null>(
        paths.api.messagesId`${id}`
      );
      return response.data;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", listId],
      });
      const oldData = queryClient.getQueryData<Message[]>([
        "messages",
        listId,
      ]);
      queryClient.setQueryData<Message[]>(
        ["messages", listId],
        (old) => {
          return old ? old.filter((item) => item.id !== id) : [];
        }
      );
      return oldData;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", listId],
        exact: true,
        refetchType: "all",
      });
    },
    onError: (error, data, context) => {
      queryClient.setQueryData<Message[]>(
        ["messages", listId],
        context as Message[]
      );
      toast.error("Could not delete the rec");
      console.error(error);
    },
    onSuccess: () => {
      toast.success("Rec deleted");
    },
  });
  const watchedInsert = useMutation<
    null,
    Error,
    { id: string; tmdb_type: string; tmdb_id: number }
  >({
    mutationFn: async ({ tmdb_type, tmdb_id }) => {
      const response = await axios.post(
        paths.api.tmdb.watched`${tmdb_type}${tmdb_id}`
      );
      return response.data;
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", listId],
      });
      const oldData = queryClient.getQueryData<Message[]>([
        "messages",
        listId,
      ]);
      queryClient.setQueryData<Message[]>(
        ["messages", listId],
        (old) => {
          return old
            ? old.map((item) =>
                item.id !== id ? item : { ...item, watched: true }
              )
            : [];
        }
      );
      return oldData;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", listId],
        exact: true,
        refetchType: "all",
      });
    },
    onError: (error, data, context) => {
      queryClient.setQueryData<Message[]>(
        ["messages", listId],
        context as Message[]
      );
      toast.error("Could not add rec to watched");
      console.error(error);
    },
  });
  const watchedDelete = useMutation<
    null,
    Error,
    { id: string; tmdb_type: string; tmdb_id: number }
  >({
    mutationFn: async ({ tmdb_type, tmdb_id }) => {
      const response = await axios.delete(
        paths.api.tmdb.watched`${tmdb_type}${tmdb_id}`
      );
      return response.data;
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", listId],
      });
      const oldData = queryClient.getQueryData<Message[]>([
        "messages",
        listId,
      ]);
      queryClient.setQueryData<Message[]>(
        ["messages", listId],
        (old) => {
          return old
            ? old.filter((item) =>
                item.id !== id ? item : { ...item, watched: false }
              )
            : [];
        }
      );
      return oldData;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", listId],
        exact: true,
        refetchType: "all",
      });
    },
    onError: (error, data, context) => {
      queryClient.setQueryData<Message[]>(
        ["messages", listId],
        context as Message[]
      );
      toast.error("Could not remove rec from watched");
      console.error(error);
    },
  });
  useEffect(() => {
    if (!messages.isLoading) {
      lastMessageRef.current
        ? lastMessageRef.current.scrollIntoView()
        : null;
    }
  }, [messages.isLoading]);
  useEffect(() => {
    setPage(1);
  }, [query]);
  const handlePageChange = (num: number) => setPage(num);
  return (
    <div className="w-full rounded-r-xl">
      <div className="rounded-tr-xl sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
        <div className="mx-2 sm:mx-4 flex py-3 items-center">
          <div className="flex items-center">
            <div className="cursor-pointer w-max">
              <div className="flex items-center">
                <div className="mr-4">
                  <Avatar className="h-12 w-12 border border-gray-600 justify-center z-20">
                    <AvatarFallback className="bg-transparent self-center">
                      {conversationData?.first_name?.charAt(0)
                        ? conversationData?.first_name?.charAt(0) +
                          conversationData?.last_name?.charAt(0)
                        : "?"}
                    </AvatarFallback>
                    <AvatarImage
                      className="object-cover"
                      src={conversationData?.avatar}
                    />
                  </Avatar>
                </div>
                <p className="font-semibold">
                  {conversationData?.first_name}{" "}
                  {conversationData?.last_name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center space-x-2 justify-end">
            <Button
              variant="ghost"
              className="rounded-full h-12 w-12 p-1"
            >
              <Search />
            </Button>
          </div>
        </div>
      </div>
      <CommandDialog
        open={open}
        onOpenChange={(val) => {
          if (val === false) {
            setAdult(false);
            setType("movie");
            setPage(1);
            setValue("");
          }
          setOpen(val);
        }}
        commandProps={{ shouldFilter: false }}
        title="Media search"
        description="Search for a movie or tv show to send as a message"
      >
        <div className="flex w-[calc(100%-48px)]">
          <div className="w-full">
            <CommandInput
              placeholder="Type a command or search..."
              value={value}
              onValueChange={setValue}
            />
          </div>
          <div className="flex flex-col justify-center self-center">
            <Select
              value={type}
              onValueChange={(val) => {
                setPage(1);
                setType(val);
              }}
            >
              <SelectTrigger className="w-24 h-12 m-0 border-l border-t-0 rounded-none">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value="tv">TV</SelectItem>
                  <SelectItem value="movie">Movie</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div
            className={cn(
              "w-max flex px-2 pr-4 space-x-2",
              "border-l-0 border-r border-b rounded-br-md",
              "self-center items-center h-12"
            )}
          >
            <Switch
              className="m-0 p-0"
              id="adult"
              checked={adult}
              onCheckedChange={(checked) => {
                setPage(1);
                setAdult(checked);
              }}
            />
            <label
              htmlFor="adult"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Adult
            </label>
          </div>
        </div>
        <CommandList
          className={cn(
            "overflow-y-auto",
            "[&::-webkit-scrollbar-thumb]:rounded-md",
            "[&::-webkit-scrollbar]:w-2",
            "[&::-webkit-scrollbar-track]:bg-secondary",
            "[&::-webkit-scrollbar-thumb]:bg-primary",
            "max-h-[60vh]"
          )}
        >
          {media.isLoading ? (
            <CommandLoading className="my-4">
              <NoResults
                message="Loading..."
                subtitle="Finding stuff"
                icon={Loader}
                spin
              />
            </CommandLoading>
          ) : (
            <CommandEmpty>
              <NoResults
                message="Keep looking"
                subtitle="Cause we found nutthin'"
              />
            </CommandEmpty>
          )}
          <div className="grid grid-cols-3">
            {media.data &&
              type === "movie" &&
              isMovie(media.data) &&
              media.data.results &&
              media.data.results.map((item) => (
                <CommandItem key={item.id} value={String(item.id)} className="space-x-2 m-2">
                  <MediaCard
                    id={item.id}
                    poster_path={item.poster_path}
                    release_date={item.release_date}
                    sendMessage={sendMessage.mutate}
                    title={item.title}
                    type={type}
                  />
                </CommandItem>
              ))}
            {media.data &&
              type === "tv" &&
              isTV(media.data) &&
              media.data.results &&
              media.data.results.map((item) => (
                <CommandItem key={item.id} className="space-x-2 m-2">
                  <MediaCard
                    id={item.id}
                    poster_path={item.poster_path}
                    release_date={item.first_air_date}
                    sendMessage={sendMessage.mutate}
                    title={item.name}
                    type={type}
                  />
                </CommandItem>
              ))}
          </div>
        </CommandList>
        <div className="my-4">
          <Paginator
            total_pages={media.data?.total_pages}
            total_results={media.data?.total_results}
            page={page}
            handleChange={handlePageChange}
          />
        </div>
      </CommandDialog>
      {/* Real stuff start here */}
      <ScrollArea
        className="h-[calc(80dvh-48px-72px)] w-full"
        type="hover"
      >
        <div className="p-8">
          {messages.isLoading && (
            <>
              <MessageCardSkeleton sender={true} />
              <MessageCardSkeleton sender={false} />
              <MessageCardSkeleton sender={true} />
              <MessageCardSkeleton sender={true} />
              <MessageCardSkeleton sender={false} />
            </>
          )}
          {messages.isError && <h1>Error!</h1>}
          {messages.data && messages.data.length === 0 && (
            <NoResults
              message="Ya'll need to start something"
              subtitle="Send a rec. Press the button"
              icon={Popcorn}
            />
          )}
          {messages.data &&
            messages.data.length > 0 &&
            messages.data.map((item, index) => (
              <div
                key={item.id!}
                ref={
                  index === messages.data.length - 1
                    ? lastMessageRef
                    : undefined
                }
              >
                <MessageCard
                  {...item}
                  currentUserData={currentUserData}
                  conversationId={conversationId}
                  deleteMutate={() => deleteMessage.mutate(item.id!)}
                  deletePending={deleteMessage.isPending}
                  addToWatched={() =>
                    watchedInsert.mutate({
                      id: item.id!,
                      tmdb_id: item.tmdb_id!,
                      tmdb_type: item.tmdb_type!,
                    })
                  }
                  removeFromWatched={() =>
                    watchedDelete.mutate({
                      id: item.id!,
                      tmdb_id: item.tmdb_id!,
                      tmdb_type: item.tmdb_type!,
                    })
                  }
                  watched={!!item.watched}
                />
              </div>
            ))}
        </div>
      </ScrollArea>
      <form
        className={cn(
          "h-[48px] flex items-center justify-center",
          "rounded-br-lg border-t",
          "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring px-1"
        )}
        onSubmit={(e) => {
          e.preventDefault();
          setOpen(true);
          setValue(recSearch);
          setRecSearch("");
        }}
      >
        <div className="relative w-full h-full">
          <Input
            className="pl-9 disabled:cursor-default h-full border-none focus-visible:ring-0"
            placeholder="Send a Rec..."
            id="rec-search"
            name="rec-search"
            value={recSearch}
            onChange={(e) => setRecSearch(e.target.value)}
          />
          <Label htmlFor="placeholder-search">
            <Film className="absolute left-0 top-1.5 m-2.5 h-4 w-4 text-muted-foreground" />
          </Label>
        </div>
        <Button type="submit" variant="ghost" disabled={!recSearch}>
          <Search />
        </Button>
      </form>
      {/* <div className="h-[72px] flex items-center justify-center">
      </div> */}
    </div>
  );
}
