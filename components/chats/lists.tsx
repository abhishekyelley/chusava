"use client";

import axios from "@/lib/axios";
import { toast } from "sonner";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
import { ListCard } from "@/components/chats/list-card";
import { Database } from "@/types/supabase";
import { UsersResponse } from "@/types/api/user";
import { paths } from "@/lib/constants";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useCallback, useState } from "react";
import { ListCardSkeleton } from "./list-card-skeleton";

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
  const pathname = usePathname();
  const queryClient = useQueryClient();
  // for adding lists
  const [name, setName] = useState("");
  // for filtering lists
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const lists = useQuery<Lists>({
    queryKey: ["lists", conversationId],
    queryFn: async ({ signal }) => {
      const response = await axios.get<Lists>(
        paths.api.conversationsId`${conversationId}`,
        { signal }
      );
      return response.data;
    },
  });
  useQuery<UsersResponse[]>({
    queryKey: ["conversation_users", conversationId],
    queryFn: async ({ signal }) => {
      const response = await axios.get<UsersResponse[]>(
        paths.api.conversationUsers`${conversationId}`,
        { signal }
      );
      return response.data;
    },
  });
  const rename = useMutation<
    number,
    Error,
    {
      listId: string;
      name: string;
      handleSettled: () => void;
    }
  >({
    mutationFn: async ({ listId, name }) => {
      const response = await axios.patch(
        paths.api.listsUpdate`${listId}`,
        { name }
      );
      return response.status;
    },
    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: ["lists", conversationId],
      });
    },
    onError: (error) => {
      toast.error("Could not rename the List");
      console.log(error);
    },
    onSuccess: () => {
      toast.success("Successfully renamed list");
    },
    onSettled: (data, error, { handleSettled }) => {
      queryClient.invalidateQueries({
        queryKey: ["lists", conversationId],
      });
      handleSettled();
    },
  });
  const addList = useMutation<number, Error, { name: string }>({
    mutationFn: async ({ name }) => {
      const response = await axios.post(paths.api.lists, {
        name,
        conversationId,
      });
      return response.status;
    },
    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: ["lists", conversationId],
      });
    },
    onError: (error) => {
      toast.error("Could not create a New List");
      console.log(error);
    },
    onSuccess: () => {
      toast.success("Successfully created a New List");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["lists", conversationId],
      });
      setName("");
      setOpen(false);
    },
  });
  const getLists = useCallback(() => {
    if (!lists.data) {
      return [];
    }
    const query = value.trim().toLowerCase();
    if (!query) {
      return lists.data;
    }
    return lists.data.filter(({ name }) => {
      name = name.toLowerCase();
      return name.includes(query);
    });
  }, [lists.data, value]);
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
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger>
                    <TooltipTrigger
                      className="rounded-full hover:bg-muted h-12 w-12 p-1 flex justify-center self-center"
                      asChild
                    >
                      <CirclePlus className="self-center transition-all ease-in-out duration-300" />
                    </TooltipTrigger>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addList.mutate({ name });
                      }}
                      className="space-y-4"
                    >
                      <DialogHeader>
                        <DialogTitle>Add List</DialogTitle>
                        <DialogDescription>
                          Create your list. Hit save when you
                          {"'"}re done.
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
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={addList.isPending}
                        >
                          {addList.isPending ? "Saving..." : "Save"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
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
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
              <Label htmlFor="lists-search">
                <Search className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
              </Label>
            </div>
          </div>
        </div>
        {/* Real Stuff goes here */}
        <div className="p-4 pt-2">
          {lists.isLoading && (
            <>
              <ListCardSkeleton />
              <ListCardSkeleton />
              <ListCardSkeleton />
              <ListCardSkeleton />
            </>
          )}
          {lists.isError && <p>Error!</p>}
          {lists.data && (
            <>
              {getLists().map((list) => (
                <ListCard
                  key={list.id}
                  listId={list.list.id}
                  conversationId={conversationId}
                  listNameinConversation={list.name}
                  listName={list.list.name}
                  time={list.created_at}
                  pathname={pathname}
                  rename={rename}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
