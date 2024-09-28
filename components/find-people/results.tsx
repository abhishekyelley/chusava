import axios from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { RequestCardSkeleton } from "@/components/dashboard/friends/request-card-skeleton";
import { FriendsError } from "@/components/dashboard/friends/error";
import { NoResults } from "@/components/dashboard/friends/no-results";
import { Keyboard } from "lucide-react";
import { UserCard } from "@/components/common/user-card";
import { FindUserWithFreindshipResponse } from "@/types/api/user";
import { ErrorResponse } from "@/types/api/error";
import { AvatarHoverContent } from "@/components/common/avatar-hover-content";
import { RemoveRequest } from "@/components/dashboard/friends/remove-request";
import { AcceptRequest } from "@/components/dashboard/friends/accept-request";
import { MakeRequest } from "@/components/dashboard/friends/make-request";

export const Results = memo(function Results({
  search,
  typing,
}: {
  search: string;
  typing: boolean;
}) {
  const params = new URLSearchParams();
  params.set("q", search);
  params.set("friendship", "true");

  const people = useQuery<
    FindUserWithFreindshipResponse[],
    ErrorResponse
  >({
    queryKey: ["people", search],
    queryFn: async () => {
      const response = await axios.get(
        "/api/user/find?" + params.toString()
      );
      return response.data;
    },
  });

  if (typing || people.isLoading) {
    return (
      <>
        <RequestCardSkeleton />
        <RequestCardSkeleton />
        <RequestCardSkeleton />
        <RequestCardSkeleton />
      </>
    );
  }

  if (people.isError) {
    return <FriendsError />;
  }

  if (search === "") {
    return (
      <NoResults
        message="You gotta type something son..."
        icon={Keyboard}
      />
    );
  }

  if (!people.data || people.data.length === 0) {
    return <NoResults />;
  }

  return (
    <>
      {people.data.map(
        ({
          id,
          bio,
          username,
          first_name,
          last_name,
          urls,
          avatar,
          friendship,
        }) => (
          <UserCard
            key={id}
            id={id}
            bio={bio!}
            username={username!}
            first_name={first_name!}
            last_name={last_name!}
            urls={urls!}
            avatar={avatar}
            disabled={false}
            avatarHoverContent={
              <AvatarHoverContent
                username={username!}
                first_name={first_name!}
                last_name={last_name!}
                avatar={avatar}
                date={
                  friendship.status !== "none"
                    ? new Date(friendship.created_at)
                    : undefined
                }
              />
            }
          >
            {friendship.status === "sent" && (
              <RemoveRequest
                type="cancel"
                friendship_id={friendship.id}
                username={username!}
              />
            )}
            {friendship.status === "received" && (
              <AcceptRequest
                friendship_id={friendship.id}
                username={username!}
              />
            )}
            {friendship.status === "friend" && (
              <RemoveRequest
                type="unfriend"
                friendship_id={friendship.id}
                username={username!}
              />
            )}
            {friendship.status === "none" &&
              !friendship.self && (
                <MakeRequest id={id} username={username!} />
              )}
          </UserCard>
        )
      )}
    </>
  );
});
