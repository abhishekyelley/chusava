"use client";

import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function ConvoCard({
  id,
  image,
  first_name,
  last_name,
  username,
  time = "",
  isOpen = true,
}: {
  id: string;
  image: string;
  first_name: string;
  last_name: string;
  username: string;
  time?: string;
  isOpen?: boolean;
}) {
  const initials =
    first_name.charAt(0) + last_name.charAt(0);
  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "transition-all ease-in-out duration-300",
            isOpen ? "w-full" : "w-min"
          )}
        >
          <div
            className="rounded-md my-2 py-2 hover:cursor-pointer hover:bg-muted transition-all ease-in-out duration-300"
            id={id}
          >
            <div className="flex items-center">
              <div className="px-2">
                <Avatar className="h-12 w-12 border justify-center z-20">
                  <AvatarFallback className="bg-transparent self-center">
                    {initials}
                  </AvatarFallback>
                  <AvatarImage
                    className="object-cover"
                    src={image}
                  />
                </Avatar>
              </div>
              <div className="w-full transition-all ease-in-out duration-300 z-10">
                <div className="flex justify-between items-center">
                  <p
                    className={cn(
                      "w-max max-w-[200px] whitespace-nowrap truncate transition-all ease-in-out duration-300",
                      isOpen
                        ? "translate-x-0 opacity-100 pr-4"
                        : "-translate-x-96 opacity-0 w-0"
                    )}
                  >
                    {first_name} {last_name}
                  </p>
                  <p className="text-sm italic">{time}</p>
                </div>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <>
            <p className="font-bold italic">@{username}</p>
            <p>
              {first_name} {last_name}
            </p>
          </>
        </TooltipContent>
      </Tooltip>
      <Separator
        className={cn(
          "transition-all ease-in-out duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      />
    </TooltipProvider>
  );
}

/*
<p className="text-muted-foreground">
{is_sender ? "You: " : ""}
<span className="italic">{message}</span>
</p>
*/