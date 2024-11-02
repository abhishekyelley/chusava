import { UsersResponse } from "@/types/api/user";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export function useConversationParticipants(conversationId: string) {
  const queryClient = useQueryClient();
  const [conversationParticipants, setConversationParticipants] =
    useState<UsersResponse[]>([]);
  const ensureQueryData = useCallback(async () => {
    try {
      const data = await queryClient.ensureQueryData<UsersResponse[]>(
        {
          queryKey: ["conversation_participants", conversationId],
        }
      );
      setConversationParticipants([...data]);
    } catch (err) {
      console.log("!!TANSTACK ERROR!!");
      console.error(err);
    }
  }, [queryClient, conversationId]);
  useEffect(() => {
    ensureQueryData();
  }, [ensureQueryData]);
  return conversationParticipants;
}
