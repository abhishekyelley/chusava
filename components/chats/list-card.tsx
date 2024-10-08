import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Library, MoreVertical, Pencil, Share } from "lucide-react";
import moment from "moment";
import { paths } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export function ListCard({
  listId,
  conversationId,
  listName,
  listNameinConversation,
  time,
}: {
  listId: string;
  conversationId: string;
  listName: string | null;
  listNameinConversation: string;
  time: string;
}) {
  const pathname = usePathname();
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <Link
          href={`${paths.chats}/${conversationId}/${listId}`}
          className="w-full mr-2 block"
        >
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
                        {listNameinConversation}
                      </p>
                    </div>
                    <p className="text-xs italic">
                      {moment(time).format("Do MMM YY")}
                    </p>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="self-center"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Pencil className="h-4 w-4 mr-2" /> Rename
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" /> Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Link>

        <TooltipContent side="top">
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
