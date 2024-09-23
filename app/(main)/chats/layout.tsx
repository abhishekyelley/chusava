import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Layout({
  convo,
  people,
}: {
  convo: React.ReactNode;
  people: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex h-min">
          <div className="w-min h-96">{convo}</div>
          <Separator
            className="h-96"
            orientation="vertical"
          />
          <div className="w-min h-96">
            <div className="p-4 w-full">{people}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
