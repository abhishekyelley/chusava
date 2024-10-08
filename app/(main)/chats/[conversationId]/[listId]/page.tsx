"use client";

import { MessageCard } from "@/components/chats/message-card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import axios from "@/lib/axios";
import { tmdb_base } from "@/lib/constants";
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
import { Search } from "lucide-react";
import { useState } from "react";

export default function Page({
  params: { listId, conversationId },
}: {
  params: { listId: string; conversationId: string };
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const query = useDebounce(value, 300);
  const queryClient = useQueryClient();
  const conversationData = queryClient
    .getQueryData<ConversationsResponse>(["conversations"])
    ?.find((item) => item.conversation_id === conversationId);
  const currentUserData = queryClient.getQueryData<UserResponse>([
    "user",
  ]);
  const messages = useQuery({
    queryKey: ["messages", listId],
    queryFn: async () => {
      const response = await axios.get<Message[]>(
        "/api/chats/messages/" + listId
      );
      return response.data;
    },
  });
  const movies = useQuery<MovieSearchResponse>({
    queryKey: ["media", "movie", query],
    queryFn: async () => {
      const response = await axios.get<MovieSearchResponse>(
        `/api/tmdb?query=${query}&type=movie`
      );
      return response.data;
    },
  });
  const shows = useQuery<TVSearchResponse>({
    queryKey: ["media", "tv", query],
    queryFn: async () => {
      const response = await axios.get<TVSearchResponse>(
        `/api/tmdb?query=${query}&type=tv`
      );
      return response.data;
    },
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
        `/api/chats/messages/${listId}`,
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
        onOpenChange={setOpen}
        commandProps={{ shouldFilter: false }}
        title="Media search"
        description="Search for a movie or tv show to send as a message"
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={value}
          onValueChange={setValue}
        />
        <CommandList
          className={cn(
            "overflow-y-auto",
            "[&::-webkit-scrollbar-thumb]:rounded-md",
            "[&::-webkit-scrollbar]:w-2",
            "[&::-webkit-scrollbar-track]:bg-secondary",
            "[&::-webkit-scrollbar-thumb]:bg-primary"
          )}
        >
          {(movies.isLoading || shows.isLoading) && (
            <CommandLoading>Loading...</CommandLoading>
          )}
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Movies">
            {movies.data?.results?.length &&
              movies.data.results.map((item) => (
                <CommandItem key={item.id}>
                  <button
                    className="flex items-center space-x-2 w-full h-full"
                    onClick={() =>
                      sendMessage.mutate({
                        tmdb_id: item.id,
                        tmdb_type: "movie",
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        item.poster_path
                          ? tmdb_base.image +
                            "/original" +
                            item.poster_path
                          : ""
                      }
                      alt={`${item.title}-${item.id}-movie-poster`}
                      className="h-[150px] w-auto rounded-md"
                    />
                    <span className="mr-1 font-bold">
                      {item.title}
                    </span>
                    <span className="italic font-semibold text-muted-foreground">{`(${
                      item.release_date?.split("-")[0] ?? "unknown"
                    })`}</span>
                  </button>
                </CommandItem>
              ))}
          </CommandGroup>

          {(movies.data?.results?.length ||
            shows.data?.results?.length) && <CommandSeparator />}
          <CommandGroup heading="TV Shows">
            {shows.data?.results?.length &&
              shows.data.results.map((item) => (
                <CommandItem key={item.id}>
                  <button
                    className="flex items-center space-x-2 w-full h-full"
                    onClick={() =>
                      sendMessage.mutate({
                        tmdb_id: item.id,
                        tmdb_type: "tv",
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        item.poster_path
                          ? tmdb_base.image +
                            "/original" +
                            item.poster_path
                          : ""
                      }
                      alt={`${item.name}-${item.id}-tv-poster`}
                      className="h-[150px] w-auto rounded-md"
                    />
                    <span className="mr-1 font-bold">
                      {item.name}
                    </span>
                    <span className="italic font-semibold text-muted-foreground">{`(${
                      item.first_air_date?.split("-")[0] ?? "unknown"
                    })`}</span>
                  </button>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      {/* Real stuff start here */}
      <ScrollArea
        className="h-[calc(80dvh-72px-72px)] w-full"
        type="hover"
      >
        <div className="p-8">
          {messages.isLoading && <h1>Loading...</h1>}
          {messages.isError && <h1>Error!</h1>}
          {messages.data &&
            messages.data.map((item) => (
              <MessageCard
                key={item.id}
                {...item}
                currentUserData={currentUserData}
                conversationId={conversationId}
              />
            ))}
        </div>
      </ScrollArea>
      <div className="h-[72px] flex items-center justify-center">
        <Button onClick={() => setOpen(true)}>Send a rec</Button>
      </div>
    </div>
  );
}
