"use client";

import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CirclePlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ListCard } from "./list-card";
import { Database } from "@/types/supabase";

type Lists = Array<
  Database["public"]["Tables"]["conversation_lists"]["Row"] & {
    list: Database["public"]["Tables"]["lists"]["Row"];
  }
>;

export function Lists({
  conversationId,
}: {
  conversationId: string;
}) {
  const lists = useQuery<Lists>({
    queryKey: ["lists", conversationId],
    queryFn: async () => {
      const response = await axios.get(
        "/api/chats/" + conversationId
      );
      return response.data;
    },
  });
  return (
    <ScrollArea className="h-[80dvh]" type="always">
      <div className="w-[300px]">
        <div className="rounded-tl-xl sticky top-0 pl-4 mr-4 pt-4 pb-2 bg-background z-50">
          <div className="flex justify-between items-center transition-all ease-in-out duration-300">
            <h3 className="w-max text-3xl font-bold overflow-hidden transition-all ease-in-out duration-300">
              Lists
            </h3>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger
                  className="rounded-full hover:bg-muted h-12 w-12 p-1 flex justify-center self-center"
                  onClick={() => {}}
                >
                  <CirclePlus className="self-center transition-all ease-in-out duration-300" />
                </TooltipTrigger>
                <TooltipContent>Add List</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="w-full mt-2 transition-all ease-in-out duration-300 opacity-100">
            <div className="relative w-full">
              <Input
                className="pl-9 disabled:cursor-default"
                placeholder="Search lists..."
                id="lists-search"
              />
              <Label htmlFor="lists-search">
                <Search className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
              </Label>
            </div>
          </div>
        </div>
        {/* Real Stuff goes here */}
        <div className="p-4 pt-2">
          {lists.isLoading && <p>Loading...</p>}
          {lists.isError && <p>Error!</p>}
          {lists.data && (
            <>
              {lists.data.map((list) => (
                <ListCard
                  key={list.id}
                  listId={list.list.id}
                  conversationId={conversationId}
                  listNameinConversation={list.name}
                  listName={list.list.name}
                  time={list.created_at}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
