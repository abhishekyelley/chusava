import { RequestCard } from "@/components/dashboard/friends/request-card";
import { RequestsPropsType } from "@/types/dashboard";
import { RequestCardSkeleton } from "./request-card-skeleton";
import { FriendsError } from "@/components/dashboard/friends/error";
import { Binoculars } from "lucide-react";

export function Requests({
  data,
  error,
  isLoading,
  isError,
  type,
}: RequestsPropsType) {
  if (isError) {
    return <FriendsError error={error} />;
  }
  if (isLoading) {
    return (
      <>
        <RequestCardSkeleton />
        <RequestCardSkeleton />
        <RequestCardSkeleton />
        <RequestCardSkeleton />
      </>
    );
  }
  if (!data) {
    return <FriendsError error={error} />;
  }
  data = data.filter((item) => {
    switch (type) {
      case "incoming": {
        return !item.is_sender && !item.accepted;
      }
      case "outgoing": {
        return item.is_sender && !item.accepted;
      }
      case "all": {
        return item.accepted;
      }
      default: {
        return false;
      }
    }
  });

  if (data.length === 0) {
    return (
      <div className="flex flex-col space-y-8">
        <h1 className="text-5xl text-center text-muted-foreground">
          Yeah, you kinda lonely...
        </h1>
        <Binoculars
          className="self-center text-muted-foreground"
          size={96}
        />
      </div>
    );
  }
  return (
    <>
      {data.map(
        ({
          friendship_id,
          username,
          first_name,
          last_name,
          bio,
          urls,
          avatar,
          created_at,
        }) => (
          <RequestCard
            key={friendship_id}
            friendship_id={friendship_id}
            username={username!}
            first_name={first_name!}
            last_name={last_name!}
            avatar={avatar}
            bio={bio!}
            urls={urls!}
            initials={
              ((first_name?.charAt(0) as string) +
                last_name?.charAt(0)) as string
            }
            date={new Date(created_at!)}
            type={type}
          />
        )
      )}
    </>
  );
}
