"use client";

import { ConvoCard } from "@/components/chats/convo-card";
import { ConvoSkeleton } from "@/components/chats/convo-skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { ErrorResponse } from "@/types/api/error";
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
  MessageSquarePlus,
  Minimize2,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { paths } from "@/lib/constants";
import { ConversationsResponse } from "@/types/api/conversations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function Convos() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [didUserOpen, setDidUserOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (!pathname.endsWith(paths.chats) && !didUserOpen) {
      setIsOpen(false);
    }
  }, [pathname, didUserOpen]);
  const conversations = useQuery<
    ConversationsResponse,
    ErrorResponse
  >({
    queryKey: ["conversations"],
    queryFn: async ({ signal }) => {
      const response = await axios.get<ConversationsResponse>(
        "/api/chats",
        { signal }
      );
      return response.data;
    },
  });
  const getConversations = useCallback(() => {
    if (!conversations.data) {
      return [];
    }
    const query = value.trim().toLowerCase();
    if (!query) {
      return conversations.data;
    }
    return conversations.data.filter(
      ({ first_name, last_name, username }) => {
        const full_name = (
          first_name +
          " " +
          last_name
        ).toLowerCase();
        return full_name.includes(query) || username?.includes(query);
      }
    );
  }, [conversations.data, value]);
  if (conversations.isLoading) {
    return <ConvoSkeleton />;
  }
  if (conversations.isError) {
    return <></>;
  }
  return (
    <ScrollArea className="h-[80dvh]" type="always">
      <div className={cn(isOpen ? "md:w-[300px] w-full" : "w-full")}>
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
                <TooltipTrigger
                  className="rounded-full hover:bg-muted h-12 w-12 p-1 flex justify-center self-center"
                  onClick={() => {
                    setDidUserOpen(true);
                    setIsOpen((prev) => !prev);
                  }}
                >
                  <Maximize2
                    className={cn(
                      "self-center hidden md:flex",
                      "transition-all ease-in-out duration-300",
                      isOpen ? "opacity-0 w-0" : "-rotate-[360deg]"
                    )}
                  />
                  <Minimize2
                    className={cn(
                      "self-center hidden md:flex",
                      "transition-all ease-in-out duration-300",
                      isOpen ? "-rotate-[360deg]" : "opacity-0 w-0"
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {isOpen ? "Collapse" : "Expand"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className={cn("relative", isOpen ? "opacity-0" : "")}>
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
              <div className="flex gap-1">
                <Input
                  className="pl-9 disabled:cursor-default"
                  placeholder="Search conversations..."
                  id="chats-search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={!isOpen}
                />
                {isOpen && (
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <Dialog
                        open={groupDialogOpen}
                        onOpenChange={setGroupDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <TooltipTrigger asChild>
                            <Button variant="outline">
                              <MessageSquarePlus className="self-center transition-all ease-in-out duration-300" />
                            </Button>
                          </TooltipTrigger>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              // addList.mutate({ name });
                            }}
                            className="space-y-4"
                          >
                            <DialogHeader>
                              <DialogTitle>New Group</DialogTitle>
                              <DialogDescription>
                                Add members to your group.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                  htmlFor="name"
                                  className="text-right"
                                >
                                  Name
                                </Label>
                                <Input
                                  id="name"
                                  className="col-span-3"
                                  // value={name}
                                  // onChange={(e) =>
                                  //   setName(e.target.value)
                                  // }
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                // disabled={addList.isPending}
                              >
                                {/* {addList.isPending
                                  ? "Saving..."
                                  : "Save"} */}
                                Save
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <TooltipContent>New Group</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Label htmlFor="chats-search">
                <Search className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
              </Label>
            </div>
          </div>
        </div>
        {/* Real Stuff goes here */}
        <div className="p-4 pt-2">
          {getConversations().map(
            ({
              conversation_id,
              first_name,
              last_name,
              group_name,
              conversation_type,
              username,
              avatar,
            }) => {
              return (
                <ConvoCard
                  key={conversation_id}
                  id={conversation_id!}
                  first_name={first_name}
                  last_name={last_name}
                  username={username}
                  image={avatar}
                  isOpen={isOpen}
                  isGroup={conversation_type === "group"}
                  group_name={group_name}
                  pathname={pathname}
                />
              );
            }
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
