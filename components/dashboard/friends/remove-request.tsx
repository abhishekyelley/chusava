import { AlertDialogWrapper } from "@/components/common/alert";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { ErrorResponse } from "@/types/api/error";
import { FindUserWithFreindshipResponse } from "@/types/api/user";
import { createClient } from "@/utils/supabase/client";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  LoaderCircle,
  Trash2,
  UserMinus,
  X,
} from "lucide-react";

const iconClass =
  "mr-0 md:mr-2 h-[16px] w-[16px] md:h-[24px] md:w-[24px]";

export function RemoveRequest({
  type,
  friendship_id,
  username,
  search,
}: {
  type: "unfriend" | "cancel";
  friendship_id: string;
  username: string;
  search: string;
}) {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    null,
    ErrorResponse,
    string
  >({
    mutationFn: async (friendship_id: string) => {
      const response = await axios.delete<null>(
        "/api/friends/" + friendship_id
      );
      return response.data;
    },
    onMutate: async (friendship_id: string) => {
      await queryClient.cancelQueries({
        queryKey: ["people", search],
      });
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session) {
        throw Error("No user in session");
      }
      const oldData = queryClient.getQueryData<
        FindUserWithFreindshipResponse[]
      >(["people", search]);
      queryClient.setQueryData<
        FindUserWithFreindshipResponse[]
      >(["people", search], (old) => {
        let newData: FindUserWithFreindshipResponse[] = [];
        if (type === "unfriend") {
          newData =
            old?.filter(
              (item) =>
                item.friendship.status === "none" ||
                item.friendship.id !== friendship_id
            ) ?? [];
        }
        if (type === "cancel") {
          newData =
            old?.map((item) => {
              if (
                item.friendship.status !== "none" &&
                item.friendship.id === friendship_id
              ) {
                item = {
                  ...item,
                  friendship: {
                    status: "none",
                    self: item.id === session.user.id,
                  },
                };
              }
              return item;
            }) ?? [];
        }
        return newData;
      });
      return oldData;
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["people", search],
        exact: true,
        refetchType: "all",
      });
    },
    onError: (error, data, context) => {
      queryClient.setQueryData<
        FindUserWithFreindshipResponse[]
      >(
        ["people", search],
        context as FindUserWithFreindshipResponse[]
      );
      console.error(error);
    },
  });
  async function handleConfirm() {
    mutate(friendship_id);
  }
  const actionText =
    type === "cancel"
      ? "Remove"
      : type === "unfriend"
      ? "Unfriend"
      : "";
  const actionPendingText =
    type === "cancel"
      ? "Removing..."
      : type === "unfriend"
      ? "Deleting..."
      : "";
  const actionDescription =
    type === "cancel"
      ? "remove your request."
      : type === "unfriend"
      ? `delete your friendship with ${username}.`
      : "";
  return (
    <AlertDialogWrapper
      title={"Are you sure?"}
      description={`By pressing continue, you will ${actionDescription}`}
      confirm={
        <span className="self-center flex">
          {type === "cancel" && (
            <Trash2 className="self-center mr-2" />
          )}
          {type === "unfriend" && (
            <UserMinus className="self-center mr-2" />
          )}
          <span className="self-center">{actionText}</span>
        </span>
      }
      confirmClass={
        "bg-red-600 text-white hover:bg-red-800"
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
            {type === "cancel" && (
              <X
                className={cn("text-red-600", iconClass)}
              />
            )}
            {type === "unfriend" && (
              <UserMinus
                className={cn("text-red-600", iconClass)}
              />
            )}
            <span className="hidden md:block">
              {actionText}
            </span>
          </>
        )}
        {isPending && (
          <>
            <LoaderCircle
              className={cn(iconClass, "animate-spin")}
            />
            <span className="hidden md:block">
              {actionPendingText}
            </span>
          </>
        )}
      </Button>
    </AlertDialogWrapper>
  );
}
