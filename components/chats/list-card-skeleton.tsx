import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function ListCardSkeleton() {
  return (
    <Skeleton
      className={cn(
        "flex justify-between",
        "rounded-md pl-3 pr-1 py-0.5 my-2 border-muted border h-10"
      )}
    >
      <Skeleton className="w-5 h-5 mr-2 block self-center" />
      <Skeleton className="w-28 h-5 mr-2 block self-center" />
      <Skeleton className="w-12 h-5 mr-2 block self-center" />
      <Skeleton className="w-5 h-5 mr-2 block self-center" />
    </Skeleton>
  );
}
