import { NoResults } from "@/components/dashboard/friends/no-results";
import { cn } from "@/lib/utils";
import { Theater } from "lucide-react";

export default function Page() {
  return (
    <div className="flex self-center justify-center w-full">
      <NoResults
        message="Yeah, this is it..."
        subtitle={
          <div className="flex space-x-2 self-center items-center">
            <span>Press </span>
            <kbd
              className={cn(
                "min-h-[30px] inline-flex justify-center items-center py-1 px-1.5",
                "bg-white border border-gray-200",
                "font-mono text-sm text-gray-800 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.08)]",
                "dark:bg-muted dark:border-neutral-700",
                "dark:text-neutral-200 dark:shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)] rounded-md"
              )}
            >
              Esc
            </kbd>{" "}
            <span>to come back here anytime</span>
          </div>
        }
        icon={Theater}
      />
    </div>
  );
}
