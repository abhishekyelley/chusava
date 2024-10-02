import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserInfoDialog } from "@/components/common/user-info-dialog";
import { AvatarHover } from "@/components/common/avatar-hover";

const iconClass =
  "mr-0 md:mr-2 h-[16px] w-[16px] md:h-[24px] md:w-[24px]";

export function UserCard({
  id,
  username,
  first_name,
  last_name,
  avatar,
  bio,
  urls,
  disabled,
  avatarHoverContent,
  children,
}: {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  bio: string;
  urls: string[];
  disabled: boolean;
  avatarHoverContent?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const initials =
    first_name.charAt(0) + last_name.charAt(0);
  return (
    <div className="my-3 p-2 rounded-xl border border-solid">
      <div className="flex justify-between">
        <div className="flex">
          <AvatarHover
            hoverContent={avatarHoverContent}
            className="flex flex-col"
          >
            <Avatar className="mr-5 self-center">
              <AvatarImage
                src={avatar}
                alt={`@${username}`}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </AvatarHover>

          <div className="self-center">
            <Link
              href={`#${id}`}
              className=" text-sm md:text-base"
            >
              @{username}
            </Link>
            <p className="text-sm md:text-base">
              {first_name} {last_name}
            </p>
          </div>
        </div>
        <div className="flex h-8 items-center space-x-2 self-center">
          <UserInfoDialog
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
              disabled={disabled}
            >
              <User className={cn(iconClass)} />
              <span className="hidden md:block">Info</span>
            </Button>
          </UserInfoDialog>
          {children}
        </div>
      </div>
    </div>
  );
}
