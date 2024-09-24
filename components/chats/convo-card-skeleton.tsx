"use client";

import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function ConvoCardSkeleton({
  isOpen = true,
}: {
  isOpen?: boolean;
}) {
  return (
    <>
      <div
        className={cn(
          "my-2",
          "transition-all ease-in-out duration-300",
          isOpen ? "w-full" : "w-min"
        )}
      >
        <div
          className={cn(
            "rounded-md py-2",
            "hover:cursor-pointer hover:bg-muted",
            "transition-all ease-in-out duration-300"
          )}
        >
          <div className="flex items-center">
            <div className="px-2">
              <Avatar className="h-12 w-12 justify-center z-20">
                <Skeleton
                  className={cn("w-12 h-12 rounded-full")}
                />
              </Avatar>
            </div>
            <div className="w-full transition-all ease-in-out duration-300 z-10">
              <div className="flex justify-between items-center">
                <div>
                  <p
                    className={cn(
                      "w-max max-w-[200px] whitespace-nowrap truncate transition-all ease-in-out duration-300",
                      isOpen
                        ? "translate-x-0 opacity-100 pr-4"
                        : "-translate-x-96 opacity-0 w-0"
                    )}
                  >
                    <div className="self-center">
                      <Skeleton className="rounded-md h-2 md:h-4 w-24 mb-2" />

                      <Skeleton
                        className={
                          "text-sm max-w-[200px] h-2 w-24 whitespace-nowrap truncate"
                        }
                      />
                    </div>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator
        className={cn(
          "transition-all ease-in-out duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      />
    </>
  );
}
