import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export function MessageCardSkeleton({
  sender = false,
}: {
  sender?: boolean;
}) {
  return (
    <div>
      <div
        className={cn(
          "flex",
          "my-3",
          sender ? "justify-end" : ""
        )}
      >
        {!sender && (
          <div className="flex flex-col-reverse mr-2">
            <Skeleton className="h-10 w-10 rounded-none rounded-l-full rounded-t-full border-2">
              <Skeleton />
            </Skeleton>
          </div>
        )}
        <div className="w-max">
          <div className="rounded-md w-max outline outline-2 outline-slate-800">
            <Skeleton className="rounded-md h-[220px] w-[146.66px]" />
          </div>
          <div
        className={cn(
          "flex items-center justify-between",
          "bg-slate-950 text-sm",
          "rounded-lg border border-muted",
          "w-[146.66px] mt-2"
        )}
      >
        <Skeleton className="rounded-r-none border-r px-2" />
        <div className="flex justify-center items-center self-center">
          <Skeleton className="w-full h-9" />
        </div>
        <Skeleton className="rounded-l-none border-l px-2" />
      </div>
        </div>
      </div>
      
    </div>
  );
}
