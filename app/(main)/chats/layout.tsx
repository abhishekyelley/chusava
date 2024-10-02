import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Convos } from "@/components/chats/convos";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex h-min">
          <div className="md:w-min h-[80dvh]">
            <Convos />
          </div>
          <Separator
            className="h-[80dvh] hidden md:block"
            orientation="vertical"
          />
          <div className="hidden md:flex w-full">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
