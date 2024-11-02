import { ListsResponse } from "@/types/chats";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export function useLists(conversationId: string) {
  const queryClient = useQueryClient();
  const [listsData, setListsData] = useState<ListsResponse>([]);
  const ensureQueryData = useCallback(async () => {
    try {
      const data = await queryClient.ensureQueryData<ListsResponse>({
        queryKey: ["lists", conversationId],
      });
      setListsData([...data]);
    } catch (err) {
      console.log("!!TANSTACK ERROR!!");
      console.error(err);
    }
  }, [queryClient, conversationId]);
  useEffect(() => {
    ensureQueryData();
  }, [ensureQueryData]);
  return listsData;
}
