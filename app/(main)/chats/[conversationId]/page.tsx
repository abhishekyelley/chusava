import { Channels } from "@/components/chats/channels";
import { Separator } from "@/components/ui/separator";

export default function Page({
  params: { conversationId },
}: {
  params: { conversationId: string };
}) {
  return (
    <>
      <div className="w-min h-96">
        <div className="p-4 w-full">
          <Channels />
        </div>
      </div>
      <Separator
        className="h-[80dvh]"
        orientation="vertical"
      />
      <h1>Hello, {conversationId}</h1>;
    </>
  );
}
