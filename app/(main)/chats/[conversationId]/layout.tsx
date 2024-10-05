import { Lists } from "@/components/chats/lists";
import { Separator } from "@/components/ui/separator";

export default function Layout({
  children,
  params: { conversationId },
}: {
  children: React.ReactNode;
  params: {
    conversationId: string;
  };
}) {
  return (
    <>
      <div className="md:w-min h-[80dvh]">
        <Lists conversationId={conversationId} />
      </div>
      <Separator
        className="h-[80dvh]"
        orientation="vertical"
      />
      {children}
    </>
  );
}
