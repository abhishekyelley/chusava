import { MessageSquarePlus, Search } from "lucide-react";
import { ConvoCardSkeleton } from "@/components/chats/convo-card-skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ConvoSkeleton() {
  return (
    <div className="w-[300px]">
      <div className="rounded-tl-xl sticky top-0 pl-4 mr-4 py-4 pb-2 bg-background z-50">
        <div
          className={"flex justify-between items-center"}
        >
          <h3
            className={
              "w-max text-3xl font-bold overflow-hidden"
            }
          >
            Chats
          </h3>
          <Button
            className="rounded-full h-12 w-12 p-1"
            variant="ghost"
          >
            <MessageSquarePlus className="self-center" />
          </Button>
        </div>

        <div className={"w-full mt-2"}>
          <div className="relative w-full">
            <Input
              className="pl-9 disabled:cursor-default"
              placeholder="Search..."
              id="placeholder-search"
            />
            <Label htmlFor="placeholder-search">
              <Search className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
            </Label>
          </div>
        </div>
      </div>
      <div className="p-4 pt-2">
        <ConvoCardSkeleton />
        <ConvoCardSkeleton />
        <ConvoCardSkeleton />
        <ConvoCardSkeleton />
        <ConvoCardSkeleton />
        <ConvoCardSkeleton />
        <ConvoCardSkeleton />
        <ConvoCardSkeleton />
      </div>
    </div>
  );
}
