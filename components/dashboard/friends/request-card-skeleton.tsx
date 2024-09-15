import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "../../ui/separator";
import { cn } from "@/lib/utils";

export function RequestCardSkeleton() {
  const iconClass =
    "mr-0 md:mr-2 h-[16px] w-[16px] md:h-[24px] md:w-[24px] rounded-md";
  const bgColor = "dark:bg-gray-600 bg-gray-300";
  return (
    <div className="my-3 p-2 rounded-xl border border-solid bg-gra">
      <div className="flex justify-between animate-pulse">
        <div className="flex">
          {/* Avatar Skeleton */}
          <Avatar className="mr-5 self-center">
            <div className={cn(bgColor, "w-12 h-12 rounded-full")} />
          </Avatar>
          {/* Text Skeleton */}
          <div className="self-center">
            <div className={cn(bgColor, "rounded-md h-2 md:h-4 w-24 mb-2")} />
            <div className={cn(bgColor, "rounded-md h-2 md:h-4 w-32")} />
          </div>
        </div>
        {/* Buttons Skeleton */}
        <div className="flex h-8 items-center space-x-2 self-center">
          <Button variant="ghost" className="px-2" disabled>
            <div className={cn(bgColor, iconClass)} />
            <span
              className={cn(bgColor, "hidden md:block h-4 w-12 rounded-md")}
            />
          </Button>
          <Separator orientation="vertical" />
          <Button variant="ghost" className="px-2" disabled>
            <div className={cn(bgColor, iconClass)} />
            <span
              className={cn(bgColor, "hidden md:block h-4 w-12 rounded-md")}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
