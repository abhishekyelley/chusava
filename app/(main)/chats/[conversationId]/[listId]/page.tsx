"use client";

import { MessageCard } from "@/components/chats/message-card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "@/lib/axios";
import { ConversationsResponse } from "@/types/api/conversations";
import { Message } from "@/types/api/messages";
import { UserResponse } from "@/types/api/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";

export default function Page({
  params: { listId, conversationId },
}: {
  params: { listId: string; conversationId: string };
}) {
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
        <div className="w-full transition-all ease-in-out duration-300 opacity-100">
          <div className="relative w-full border-t">
            <Input
              className="pl-9 disabled:cursor-default h-[72px] border-none rounded-none rounded-br-xl"
              placeholder="Search titles..."
              id="titles-search"
            />
            <Label htmlFor="titles-search">
              <Search className="absolute left-0 top-[25%] m-2.5 h-4 w-4 text-muted-foreground" />
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
