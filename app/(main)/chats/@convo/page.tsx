"use client";

import { ConvoCard } from "@/components/chats/convo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { ErrorResponse } from "@/types/api/error";
import { FriendsResponse } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";
import {
  Ellipsis,
  MessageSquarePlus,
  Search,
} from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);
  const friends = useQuery<
    FriendsResponse[],
    ErrorResponse
  >({
    queryKey: ["friends"],
    queryFn: async () => {
      const response = await axios.get<FriendsResponse[]>(
        "/api/friends"
      );
      return response.data;
    },
  });
  if (friends.isLoading) {
    return <p>Loading...</p>;
  }
  if (friends.isError) {
    return <></>;
  }
  return (
    <div
      className="p-4 w-full"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className={cn(
          "flex justify-between items-center transition-all ease-in-out duration-300",
          isOpen ? "" : "justify-center"
        )}
      >
        <h3
          className={cn(
            "w-max text-3xl font-bold overflow-hidden transition-all ease-in-out duration-300",
            isOpen ? "" : "w-0"
          )}
        >
          Chats
        </h3>
        <Button
          className="rounded-full h-12 w-12 p-1"
          variant="ghost"
        >
          <MessageSquarePlus className="self-center" />
        </Button>
      </div>
      <div
        className={cn(
          "relative",
          isOpen ? "opacity-0" : ""
        )}
      >
        <div className="absolute top-4 left-[50%] -translate-x-[50%]">
          <Ellipsis />
        </div>
      </div>
      <div
        className={cn(
          "w-full mt-2 transition-all ease-in-out duration-300",
          isOpen ? "opacity-100" : "w-0 opacity-0"
        )}
      >
        <div className="relative w-full">
          <Input
            className="pl-9 disabled:cursor-default"
            placeholder="Search..."
            id="chats-search"
            disabled={!isOpen}
          />
          <Label htmlFor="chats-search">
            <Search className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
          </Label>
        </div>
      </div>
      <ScrollArea className="h-fit" type="always">
        {friends.data &&
          friends.data.map(
            ({
              first_name,
              last_name,
              id,
              username,
              avatar,
            }) => {
              return (
                <ConvoCard
                  key={id}
                  id={id}
                  first_name={first_name!}
                  last_name={last_name!}
                  username={username!}
                  image={avatar}
                  isOpen={isOpen}
                />
              );
            }
          )}
      </ScrollArea>
    </div>
  );
}
