"use client";

import { MessageCard } from "@/components/chats/message-card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "@/lib/axios";
import { ConversationsResponse } from "@/types/api/conversations";
import { Message } from "@/types/api/messages";
import { createClient } from "@/utils/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page({
  params: { listId, conversationId },
}: {
  params: { listId: string; conversationId: string };
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();
  const getUserId = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      if (!data.session) {
        throw new Error("No session");
      }
      setUserId(data.session.user.id);
    } catch (err) {
      toast.error("Session not found.", {
        description: "No user found in session",
      });
      await supabase.auth.signOut();
    }
  }, [supabase]);
  useEffect(() => {
    getUserId();
  }, [getUserId]);
  const queryClient = useQueryClient();
  const data = queryClient
    .getQueryData<ConversationsResponse>(["conversations"])
    ?.find((item) => item.conversation_id === conversationId);
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
                      {data?.first_name?.charAt(0) ?? "-"}
                    </AvatarFallback>
                    <AvatarImage
                      className="object-cover"
                      src={data?.avatar}
                    />
                  </Avatar>
                </div>
                <p className="font-semibold">
                  {data?.first_name} {data?.last_name}
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
        className="h-[calc(80dvh-72px)] w-full"
        type="hover"
      >
        <div className="p-8">
          {messages.isLoading && <h1>Loading...</h1>}
          {messages.isError && <h1>Error!</h1>}
          {messages.data &&
            messages.data.map((item) => (
              <MessageCard key={item.id} {...item} userId={userId} />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
