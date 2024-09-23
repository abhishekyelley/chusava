import { AddFriends } from "@/components/find-people/find-people";

export default function Page() {
  return (
    <div className="p-5 rounded-xl border">
      <h3 className="text-3xl m-2">Add a friend</h3>
      <AddFriends />
    </div>
  );
}
