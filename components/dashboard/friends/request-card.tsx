import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Check,
  Copy,
  LoaderCircle,
  Trash2,
  User,
  UserMinus,
  X,
} from "lucide-react";
import Link from "next/link";
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FriendRequestsType } from "@/types/dashboard";
import { AlertDialogWrapper } from "@/components/common/alert";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "@/lib/axios";
import { ErrorResponse } from "@/types/api/error";
import { Database } from "@/types/supabase";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconFromUrl } from "@/components/common/icon-from-url";

const iconClass =
  "mr-0 md:mr-2 h-[16px] w-[16px] md:h-[24px] md:w-[24px]";

type FriendsType = Database["public"]["Tables"]["friends"]["Row"];

export function RequestCard({
  friendship_id,
  username,
  first_name,
  last_name,
  initials,
  avatar,
  bio,
  urls,
  date,
  type,
}: {
  friendship_id: string;
  user_id?: string;
  username: string;
  first_name: string;
  last_name: string;
  initials: string;
  avatar: string;
  bio: string;
  urls: string[];
  date: Date;
  type: FriendRequestsType;
}) {
  const queryClient = useQueryClient();
  const { mutate: deleteMutate, isPending: deleteIsPending } =
    useMutation<null, ErrorResponse, string>({
      mutationFn: async (friendship_id: string) => {
        const response = await axios.delete<null>(
          "/api/friends/" + friendship_id
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["dashboard", "users"],
        });
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const { mutate: acceptMutate, isPending: acceptIsPending } =
    useMutation<FriendsType, ErrorResponse, string>({
      mutationFn: async (friendship_id: string) => {
        const response = await axios.patch<FriendsType>(
          "/api/friends/" + friendship_id
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["dashboard", "users"],
        });
      },
      onError: (error) => {
        console.error(error);
      },
    });

  async function handleDeleteConfirm() {
    deleteMutate(friendship_id);
  }
  async function handleAcceptConfirm() {
    acceptMutate(friendship_id);
  }
  return (
    <div className="my-3 p-2 rounded-xl border border-solid">
      <div className="flex justify-between">
        <div className="flex">
          <AvatarHover
            initials={initials}
            username={username}
            date={date}
            image={avatar}
            className="flex flex-col"
          >
            <Avatar className="mr-5 self-center">
              <AvatarImage src={avatar} alt={`@${username}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </AvatarHover>

          <div className="self-center">
            <Link href="#" className=" text-sm md:text-base">
              @{username}
            </Link>
            <p className="text-sm md:text-base">
              {first_name} {last_name}
            </p>
          </div>
        </div>
        <div className="flex h-8 items-center space-x-2 self-center">
          <DialogWrapper
            username={username}
            initials={initials}
            first_name={first_name}
            last_name={last_name}
            image={avatar}
            bio={bio}
            urls={urls}
          >
            <Button
              variant="ghost"
              className="px-2"
              disabled={acceptIsPending || deleteIsPending}
            >
              <User className={cn(iconClass)} />
              <span className="hidden md:block">Info</span>
            </Button>
          </DialogWrapper>
          <Separator orientation="vertical" />
          {type === "incoming" && (
            <Button
              variant="ghost"
              className="px-2"
              onClick={handleAcceptConfirm}
              disabled={acceptIsPending}
            >
              <Check className={cn("text-green-500", iconClass)} />
              <span className="hidden md:block">Accept</span>
            </Button>
          )}
          {type === "outgoing" && (
            <AlertDialogWrapper
              title={"Are you sure?"}
              description={
                "By pressing continue, you will remove your request."
              }
              confirm={
                <span className="self-center flex">
                  <Trash2 className="self-center mr-2" />
                  <span className="self-center">Remove</span>
                </span>
              }
              confirmClass={"bg-red-600 text-white hover:bg-red-800"}
              handleConfirm={handleDeleteConfirm}
            >
              <Button
                variant="ghost"
                className="px-2"
                disabled={deleteIsPending}
              >
                {!deleteIsPending && (
                  <>
                    <X className={cn("text-red-600", iconClass)} />
                    <span className="hidden md:block">Remove</span>
                  </>
                )}
                {deleteIsPending && (
                  <>
                    <LoaderCircle
                      className={cn(iconClass, "animate-spin")}
                    />
                    <span className="hidden md:block">
                      Removing...
                    </span>
                  </>
                )}
              </Button>
            </AlertDialogWrapper>
          )}
          {type === "all" && (
            <AlertDialogWrapper
              title={"Are you sure?"}
              description={
                "By pressing continue, you will delete your friendship."
              }
              confirm={
                <span className="self-center flex">
                  <UserMinus className="self-center mr-2" />
                  <span className="self-center">Remove Friend</span>
                </span>
              }
              confirmClass={"bg-red-600 text-white hover:bg-red-800"}
              handleConfirm={handleDeleteConfirm}
            >
              <Button
                variant="ghost"
                className="px-2"
                disabled={deleteIsPending}
              >
                {!deleteIsPending && (
                  <>
                    <UserMinus
                      className={cn("text-red-600", iconClass)}
                    />
                    <span className="hidden md:block">Unfriend</span>
                  </>
                )}
                {deleteIsPending && (
                  <>
                    <LoaderCircle
                      className={cn(iconClass, "animate-spin")}
                    />
                    <span className="hidden md:block">
                      Removing...
                    </span>
                  </>
                )}
              </Button>
            </AlertDialogWrapper>
          )}
        </div>
      </div>
    </div>
  );
}

function AvatarHover({
  children,
  username,
  initials,
  image,
  date,
  className,
}: {
  children: React.ReactNode;
  username: string;
  initials: string;
  image: string;
  date: Date;
  className: string;
}) {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger className="self-center">
        {children}
      </HoverCardTrigger>
      <HoverCardContent className={className}>
        <div className="flex justify-center">
          <Avatar className="self-center h-32 w-32 m-3">
            <AvatarImage src={image} alt={`@${username}`} />
            <AvatarFallback className="text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <Link href="#" className="text-3xl text-center">
          @{username}
        </Link>
        <div className="flex pt-2">
          <span className="text-center w-full text-sm text-muted-foreground">
            Sent on:{" "}
            {date.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function DialogWrapper({
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
              <div key={item} className="flex items-center space-x-2">
                <Input value={item} readOnly />
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          navigator.clipboard.writeText(item)
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
}
