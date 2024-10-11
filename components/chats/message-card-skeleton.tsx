import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export function MessageCardSkeleton({
  sender = false,
}: {
  sender?: boolean;
}) {
  return (
    <div className={cn("flex", "my-3", sender ? "justify-end" : "")}>
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
      </div>
    </div>
  );
}
