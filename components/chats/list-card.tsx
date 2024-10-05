import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Library } from "lucide-react";
import moment from "moment";
import { paths } from "@/lib/constants";

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
        <TooltipTrigger
          className="my-2"
          id={listId}
          asChild
        >
          <Link
            href={`${paths.chats}/${conversationId}/${listId}`}
          >
            <div
              className={cn(
                "rounded-md px-3 py-1 my-2 border-muted border",
                "hover:cursor-pointer hover:bg-muted",
                "transition-all ease-in-out duration-300",
                pathname.includes(listId) ? "bg-muted" : ""
              )}
            >
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
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
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
