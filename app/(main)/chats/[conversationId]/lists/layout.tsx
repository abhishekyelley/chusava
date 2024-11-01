"use client";

import { Lists } from "@/components/chats/lists";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { currentTailwindConfig } from "@/utils/utils";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
  params: { conversationId },
}: {
  children: React.ReactNode;
  params: {
    conversationId: string;
  };
}) {
  const pathname = usePathname();
  const mediumScreen = useMediaQuery(
    `(min-width: ${currentTailwindConfig.theme.screens.md})`
  );
  return (
    <>
      {mediumScreen || pathname.endsWith("/lists") ? (
        <div className="md:w-min h-[80dvh] w-full">
          <Lists conversationId={conversationId} />
        </div>
      ) : null}
      <Separator className="h-[80dvh]" orientation="vertical" />
      {children}
    </>
  );
}
