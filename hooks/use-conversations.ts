import { ConversationsResponse } from "@/types/api/conversations";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export function useConversations() {
  const queryClient = useQueryClient();
  const [conversationData, setConversationData] =
    useState<ConversationsResponse>([]);
  const ensureQueryData = useCallback(async () => {
    try {
      const data =
        await queryClient.ensureQueryData<ConversationsResponse>({
          queryKey: ["conversations"],
        });
      setConversationData([...data]);
    } catch (err) {
      console.log("!!TANSTACK ERROR!!");
      console.error(err);
    }
  }, [queryClient]);
  useEffect(() => {
    ensureQueryData();
  }, [ensureQueryData]);
  return conversationData;
}

export function useConversation(conversationId: string) {
  const conversations = useConversations();
  return conversations?.find(
    (item) => item.conversation_id === conversationId
  );
}
