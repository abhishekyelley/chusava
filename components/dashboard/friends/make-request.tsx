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
import { LoaderCircle, UserPlus } from "lucide-react";

const iconClass =
  "mr-0 md:mr-2 h-[16px] w-[16px] md:h-[24px] md:w-[24px]";

type FriendsType =
  Database["public"]["Tables"]["friends"]["Row"];

export function MakeRequest({
  id,
  username,
}: {
  id: string;
  username: string;
}) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    FriendsType,
    ErrorResponse,
    string
  >({
    mutationFn: async (id: string) => {
      const response = await axios.post<FriendsType>(
        "/api/friends/",
        { id }
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
    mutate(id);
  }
  return (
    <AlertDialogWrapper
      title={"Are you sure?"}
      description={`By pressing add, you will send a friend request ${username}.`}
      confirm={
        <span className="self-center flex">
          <UserPlus className="self-center mr-2" />
          <span className="self-center">Add</span>
        </span>
      }
      confirmClass={"bg-green-600 text-white hover:bg-green-800"}
      handleConfirm={handleConfirm}
    >
      <Button
        variant="ghost"
        className="px-2"
        disabled={isPending}
      >
        {!isPending && (
          <>
            <UserPlus className={cn("text-green-600", iconClass)} />
            <span className="hidden md:block text-green-600">Add</span>
          </>
        )}
        {isPending && (
          <>
            <LoaderCircle
              className={cn(iconClass, "animate-spin")}
            />
            <span className="hidden md:block">
              Adding...
            </span>
          </>
        )}
      </Button>
    </AlertDialogWrapper>
  );
}
