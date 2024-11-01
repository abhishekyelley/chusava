import {
  TooltipTrigger,
  TooltipProvider,
  Tooltip,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { EyeClosedIcon } from "@radix-ui/react-icons";

export function Watched({
  watched,
  addToWatched,
  removeFromWatched,
  className = "border",
}: {
  watched: boolean;
  className?: string;
  addToWatched: () => void;
  removeFromWatched: () => void;
}) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={watched ? "default" : "ghost"}
            className={className}
            onClick={() => {
              watched ? removeFromWatched() : addToWatched();
            }}
          >
            <div className="h-6 w-6 items-center self-center flex justify-center">
              <Eye
                className={cn(
                  "self-center transition-height-opacity ease-in-out duration-300 h-5 w-5",
                  watched ? "opacity-0 h-0 w-0" : ""
                )}
              />
              <EyeClosedIcon
                className={cn(
                  "self-center transition-height-opacity ease-in-out duration-300 h-4 w-4",
                  watched ? "" : "opacity-0 h-0 w-0"
                )}
              />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {watched ? "Unwatch" : "Watch"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
