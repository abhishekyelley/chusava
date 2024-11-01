"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Convos } from "@/components/chats/convos";
import { EscapeListener } from "@/components/layout/escape-listener";
import { paths } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { currentTailwindConfig } from "@/utils/utils";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mediumScreen = useMediaQuery(
    `(min-width: ${currentTailwindConfig.theme.screens.md})`
  );
  return (
    <EscapeListener path={paths.chats}>
      <Card>
        <CardContent className="p-0">
          <div className="flex h-min">
            {mediumScreen ? (
              <div className="md:w-min w-full h-[80dvh]">
                <Convos />
              </div>
            ) : pathname.endsWith(paths.chats) ? (
              <div className="md:w-min w-full h-[80dvh]">
                <Convos />
              </div>
            ) : null}
            <Separator
              className="h-[80dvh] hidden md:block"
              orientation="vertical"
            />
            {children}
          </div>
        </CardContent>
      </Card>
    </EscapeListener>
  );
}
