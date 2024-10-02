import { NoResults } from "@/components/dashboard/friends/no-results";
import { getConversationByUsername } from "@/lib/api/user";
import { paths } from "@/lib/constants";
import { BrickWall } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  let redirectPath: string | null = null;
  try {
    const conversation = await getConversationByUsername(
      username
    );
    redirectPath = `${paths.chats}/${conversation.id}`;
  } catch (err) {
    console.error(err);
    return (
      <NoResults
        message="Who are you tryna talk to?"
        subtitle="Username not found"
        icon={BrickWall}
      />
    );
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}
