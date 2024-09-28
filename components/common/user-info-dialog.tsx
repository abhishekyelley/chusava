import { memo } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import Link from "next/link";
import { IconFromUrl } from "@/components/common/icon-from-url";

export const UserInfoDialog = memo(function UserInfoDialog({
  children,
  username,
  initials,
  first_name,
  last_name,
  image,
  bio,
  urls,
}: {
  children: React.ReactNode;
  username: string;
  initials: string;
  first_name: string;
  last_name: string;
  image: string;
  bio: string;
  urls: Array<string>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            Details about {username}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-around space-x-2">
          <Avatar className="self-center h-32 w-32 m-3">
            <AvatarImage src={image} alt={`@${username}`} />
            <AvatarFallback className="text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>@{username}</p>
            <p>
              {first_name} {last_name}
            </p>
          </div>
        </div>
        <p>
          <strong>Bio:</strong>
        </p>
        <p>{bio}</p>
        {urls && (
          <>
            <p>
              <strong>Socials:</strong>
            </p>
            {urls.map((item) => (
              <div
                key={item}
                className="flex items-center space-x-2"
              >
                <Input value={item} readOnly />
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          navigator.clipboard.writeText(
                            item
                          )
                        }
                        className="rounded-md border-2 p-2"
                      >
                        <Copy className="p-1" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{"Copy to clipboard"}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item}
                        target={item ? "_blank" : ""}
                        className="rounded-md border-2 p-2"
                      >
                        <IconFromUrl url={item} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{"Visit link"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </>
        )}
        <DialogFooter className="flex h-8 items-center space-x-2 self-center justify-center">
          <DialogClose asChild>
            <Button variant="secondary" className="px-2">
              <span>Close</span>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
