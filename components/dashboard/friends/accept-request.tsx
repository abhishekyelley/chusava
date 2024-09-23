import { AlertDialogWrapper } from "@/components/common/alert";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { ErrorResponse } from "@/types/api/error";
import { Database } from "@/types/supabase";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Check, LoaderCircle } from "lucide-react";

const iconClass =
  "mr-0 md:mr-2 h-[16px] w-[16px] md:h-[24px] md:w-[24px]";

type FriendsType =
  Database["public"]["Tables"]["friends"]["Row"];

export function AcceptRequest({
  friendship_id,
  username,
}: {
  friendship_id: string;
  username: string;
}) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    FriendsType,
    ErrorResponse,
    string
  >({
    mutationFn: async (friendship_id: string) => {
      const response = await axios.patch<FriendsType>(
        "/api/friends/" + friendship_id
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["people"],
        exact: false,
        refetchType: "all",
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  function handleConfirm() {
    mutate(friendship_id);
  }
  return (
    <AlertDialogWrapper
      title={"Are you sure?"}
      description={`By pressing accept, you will add ${username} as a friend.`}
      confirm={
        <span className="self-center flex">
          <Check className="self-center mr-2" />
          <span className="self-center">Accept</span>
        </span>
      }
      confirmClass={
        "bg-green-600 text-white hover:bg-green-800"
      }
      handleConfirm={handleConfirm}
    >
      <Button
        variant="ghost"
        className="px-2"
        disabled={isPending}
      >
        {!isPending && (
          <>
            <Check
              className={cn("text-green-600", iconClass)}
            />
            <span className="hidden md:block">Accept</span>
          </>
        )}
        {isPending && (
          <>
            <LoaderCircle
              className={cn(iconClass, "animate-spin")}
            />
            <span className="hidden md:block">
              Accepting
            </span>
          </>
        )}
      </Button>
    </AlertDialogWrapper>
  );
}
