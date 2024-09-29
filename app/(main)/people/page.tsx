import { AddFriends } from "@/components/people/people";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="p-5 rounded-xl border">
      <h3 className="text-3xl m-2">Add a friend</h3>
      <Suspense fallback={<>Loading...</>}>
        <AddFriends />
      </Suspense>
    </div>
  );
}
