"use client";

import { ConvoCard } from "@/components/chats/convo-card";
import { ConvoSkeleton } from "@/components/chats/convo-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { ErrorResponse } from "@/types/api/error";
import { FriendsResponse } from "@/types/dashboard";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import {
  Ellipsis,
  Maximize2,
  Minimize2,
  Search,
} from "lucide-react";
import { useCallback, useState } from "react";

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);
  const [selected, setSelected] = useState<string | null>(
    null
  );
  const [value, setValue] = useState("");
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
  const getFriends = useCallback(() => {
    if (!friends.data) {
      return [];
    }
    const query = value.trim().toLowerCase();
    if (!query) {
      return friends.data;
    }
    return friends.data.filter(
      ({ first_name, last_name, username }) => {
        const full_name = (
          first_name +
          " " +
          last_name
        ).toLowerCase();
        return (
          full_name.includes(query) ||
          username?.includes(query)
        );
      }
    );
  }, [friends.data, value]);
  if (friends.isLoading) {
    return <ConvoSkeleton />;
  }
  if (friends.isError) {
    return <></>;
  }
  return (
    <ScrollArea className="h-[80dvh]" type="always">
      <div className={cn(isOpen ? "w-[300px]" : "w-full")}>
        <div className="rounded-tl-xl sticky top-0 pl-4 mr-4 pt-4 pb-2 bg-background z-50">
          <div
            className={cn(
              "flex justify-between items-center transition-all ease-in-out duration-300",
              isOpen ? "" : "justify-center"
            )}
          >
            <h3
              className={cn(
                "w-max text-3xl font-bold overflow-hidden transition-all ease-in-out duration-300",
                isOpen ? "" : "w-0 opacity-0"
              )}
            >
              Chats
            </h3>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    className="rounded-full h-12 w-12 p-1"
                    variant="ghost"
                    onClick={() =>
                      setIsOpen((prev) => !prev)
                    }
                  >
                    <Maximize2
                      className={cn(
                        "self-center",
                        "transition-all ease-in-out duration-300",
                        isOpen
                          ? "opacity-0 w-0"
                          : "-rotate-[135deg]"
                      )}
                    />
                    <Minimize2
                      className={cn(
                        "self-center rotate-45",
                        "transition-all ease-in-out duration-300",
                        isOpen
                          ? "-rotate-[135deg]"
                          : "opacity-0 w-0"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isOpen ? "Collapse" : "Expand"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!isOpen}
              />
              <Label htmlFor="chats-search">
                <Search className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
              </Label>
            </div>
          </div>
        </div>
        <div className="p-4 pt-2">
          {getFriends().map(
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
                  onSelect={() => setSelected(id)}
                  isSelected={selected === id}
                />
              );
            }
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
