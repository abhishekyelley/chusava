import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { memo } from "react";

export const AvatarHoverContent = memo(
  ({
    avatar,
    username,
    first_name,
    last_name,
    date,
  }: {
    avatar: string;
    username: string;
    first_name: string;
    last_name: string;
    date?: Date;
  }) => {
    const initials =
      first_name.charAt(0) + last_name.charAt(0);
    return (
      <>
        <div className="flex justify-center">
          <Avatar className="self-center h-32 w-32 m-3">
            <AvatarImage
              src={avatar}
              alt={`@${username}`}
            />
            <AvatarFallback className="text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <Link href="#" className="text-3xl text-center">
          @{username}
        </Link>
        <div className="flex pt-2">
          {date && (
            <span className="text-center w-full text-sm text-muted-foreground">
              Sent on:{" "}
              {date.toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </span>
          )}
        </div>
      </>
    );
  }
);
