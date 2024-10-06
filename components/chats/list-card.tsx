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
        <div
          className={cn(
            "flex justify-between",
            "rounded-md px-3 py-1 my-2 border-muted border",
            "hover:cursor-pointer hover:bg-muted/50",
            "transition-all ease-in-out duration-300",
            pathname.includes(listId) ? "bg-muted/50" : ""
          )}
        >
          <TooltipTrigger className="my-2" asChild>
            <Link href={`${paths.chats}/${conversationId}/${listId}`} className="w-full mr-2">
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
            </Link>
          </TooltipTrigger>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
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
