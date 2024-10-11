import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Library, MoreVertical, Pencil, Share } from "lucide-react";
import moment from "moment";
import { paths } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { UseMutationResult } from "@tanstack/react-query";

export function ListCard({
  listId,
  conversationId,
  listName,
  listNameinConversation,
  time,
  pathname,
  rename,
}: {
  listId: string;
  conversationId: string;
  listName: string | null;
  listNameinConversation: string;
  time: string;
  pathname: string;
  rename: UseMutationResult<
    number,
    Error,
    {
      listId: string;
      name: string;
      handleSettled: () => void;
    },
    unknown
  >;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(listName ?? "");
  return (
    <TooltipProvider delayDuration={50}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              rename.mutate({
                listId,
                name,
                handleSettled: () => setOpen(false),
              });
            }}
            className="space-y-4"
          >
            <DialogHeader>
              <DialogTitle>Rename</DialogTitle>
              <DialogDescription>
                Rename your list here. Hit save when you{"'"}re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={rename.isPending}>
                {rename.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Tooltip>
        <div
          className={cn(
            "flex justify-between",
            "rounded-md pl-3 pr-1 py-0.5 my-2 border-muted border",
            "hover:cursor-pointer dark:hover:bg-muted/50 hover:bg-gray-300",
            "transition-all ease-in-out duration-300",
            pathname.includes(listId)
              ? "dark:bg-muted/50 bg-gray-300"
              : ""
          )}
        >
          <Link
            href={`${paths.chats}/${conversationId}/${listId}`}
            className="w-full mr-2 block"
          >
            <TooltipTrigger className="my-2 w-full pr-1" asChild>
              <div className="flex items-center">
                <div className="w-full transition-all ease-in-out duration-300 z-10">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Library className="text-muted-foreground" />
                      <p
                        className={cn(
                          "w-max max-w-[200px] whitespace-nowrap truncate",
                          "transition-all ease-in-out duration-300"
                        )}
                      >
                        {listName}
                      </p>
                    </div>
                    <p className="text-xs italic">
                      {moment(time).format("Do MMM YY")}
                    </p>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
          </Link>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="self-center"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(true);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" /> Rename
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Share className="h-4 w-4 mr-2" /> Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TooltipContent side="bottom">
          <>
            <p className="font-bold italic">
              {listNameinConversation}
            </p>
            {listName && (
              <p className="font-bold italic">{listName}</p>
            )}
            <p className="font-bold italic">
              {moment(time).format("Do MMM YY - hh:mm a")}
            </p>
          </>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
