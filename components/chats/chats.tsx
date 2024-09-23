// "use client";

import { Card, CardContent } from "@/components/ui/card";

export function Chat({ children }: { children?: React.ReactNode }) {
  return (
    <Card>
      <CardContent>
        <div className="w-[200px] h-[50vh] flex">{children}</div>
      </CardContent>
    </Card>
  );
}
