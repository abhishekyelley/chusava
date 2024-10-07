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
  CommandShortcut,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { ConversationsResponse } from "@/types/api/conversations";
import { Message } from "@/types/api/messages";
import { UserResponse } from "@/types/api/user";
import { MovieSearchResponse } from "@/types/tmdb/tmdb";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
  const mutation = useMutation<MovieSearchResponse>({
    mutationFn: async () => {
      const response = await axios.get<MovieSearchResponse>(
        `/api/tmdb?query=${query}&type=movie`
      );
      return response.data;
    },
    onSuccess: (data) => {
      setData([...data.results!]);
    },
  });
  const [data, setData] = useState<NonNullable<
    MovieSearchResponse["results"]
  > | null>(null);
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
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={value}
          onValueChange={setValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              mutation.mutate();
            }
          }}
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
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Movies">
            {data?.map((item) => (
              <CommandItem key={item.id}>
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="TV Shows">
            <CommandItem>
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Mail</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
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
      <div className="h-[72px]">
        <Button onClick={() => setOpen(true)}>Send a rec</Button>
      </div>
    </div>
  );
}
