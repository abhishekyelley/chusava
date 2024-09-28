import { memo } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export const AvatarHover = memo(function AvatarHover({
  children,
  hoverContent,
  className,
}: {
  children: React.ReactNode;
  hoverContent?: React.ReactNode;
  className: string;
}) {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger className="self-center">
        {children}
      </HoverCardTrigger>
      <HoverCardContent className={className}>
        {hoverContent}
      </HoverCardContent>
    </HoverCard>
  );
});
