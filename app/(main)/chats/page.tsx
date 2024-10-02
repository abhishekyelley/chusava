import { NoResults } from "@/components/dashboard/friends/no-results";
import { TreePalm } from "lucide-react";

export default function Page() {
  return (
    <div className="flex self-center justify-center w-full">
      <NoResults
        message="Yeah, this is it..."
        subtitle="Pick a convo now"
        icon={TreePalm}
      />
    </div>
  );
}
